import { supabaseAdmin } from './supabase';

export type AdminInviteRole = 'ADMIN' | 'EDITOR' | 'COMUNICACAO' | 'ATENDIMENTO' | 'VISUALIZADOR';
const ROLE_DEPARTMENT: Record<AdminInviteRole, string> = {
  ADMIN: 'Administração',
  EDITOR: 'Conteúdo',
  COMUNICACAO: 'Comunicação',
  ATENDIMENTO: 'Atendimento',
  VISUALIZADOR: 'Visualização',
};

export type AdminInviteStatus = 'pendente' | 'aceito' | 'aprovacao' | 'aprovado' | 'recusado' | 'revogado' | 'expirado';

export interface AdminInvite {
  id: string;
  email: string;
  name: string;
  cargo: string;
  role: AdminInviteRole;
  status: AdminInviteStatus;
  invited_by: string;
  invited_at: string;
  expires_at: string;
  accepted_at?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  auth_user_id?: string | null;
}

function randomToken(): string {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function getAdminInvites(): Promise<AdminInvite[]> {
  const { data, error } = await supabaseAdmin
    .from('admin_invites')
    .select('id,email,name,cargo,role,status,invited_by,invited_at,expires_at,accepted_at,approved_at,approved_by,auth_user_id')
    .order('invited_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminInvite[];
}

export async function createAdminInvite(input: {
  email: string;
  name: string;
  cargo: string;
  role: AdminInviteRole;
  invitedBy: string;
  origin: string;
  sendEmail: boolean;
}): Promise<{ invite: AdminInvite; link: string }> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const cargo = input.cargo.trim();
  if (!email || !name || !cargo) throw new Error('Nome, email e cargo são obrigatórios.');

  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const redirectTo = new URL('/convite', input.origin);
  redirectTo.searchParams.set('token', token);

  const existing = await supabaseAdmin
    .from('admin_invites')
    .select('id,status')
    .eq('email', email)
    .in('status', ['pendente', 'aceito', 'aprovacao'])
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) throw new Error('Já existe um convite pendente para este email.');

  let authUserId: string | null = null;
  let link = '';

  if (input.sendEmail) {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { name, cargo, requested_role: input.role },
      redirectTo: redirectTo.toString(),
    });
    if (error) throw error;
    authUserId = data.user?.id ?? null;
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email,
      options: {
        data: { name, cargo, requested_role: input.role },
        redirectTo: redirectTo.toString(),
      },
    });
    if (error) throw error;
    authUserId = data.user?.id ?? null;
    link = data.properties?.action_link ?? '';
    if (!link) throw new Error('O Supabase não retornou o link de convite.');
  }

  const { data: invite, error: insertError } = await supabaseAdmin
    .from('admin_invites')
    .insert({
      email,
      name,
      cargo,
      role: input.role,
      token_hash: tokenHash,
      invited_by: input.invitedBy,
      auth_user_id: authUserId,
      expires_at: expiresAt,
      status: 'pendente',
    })
    .select('id,email,name,cargo,role,status,invited_by,invited_at,expires_at,accepted_at,approved_at,approved_by,auth_user_id')
    .single();
  if (insertError) throw insertError;

  if (input.sendEmail) {
    link = redirectTo.toString();
  }

  return { invite: invite as AdminInvite, link };
}

export async function acceptAdminInvite(token: string, userId: string, userEmail: string): Promise<AdminInvite> {
  const tokenHash = await sha256Hex(token);
  const { data: invite, error } = await supabaseAdmin
    .from('admin_invites')
    .select('*')
    .eq('token_hash', tokenHash)
    .maybeSingle();
  if (error) throw error;
  if (!invite) throw new Error('Convite não encontrado.');
  if (invite.email !== userEmail.toLowerCase()) throw new Error('Este convite pertence a outro email.');
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    await supabaseAdmin.from('admin_invites').update({ status: 'expirado', updated_at: new Date().toISOString() }).eq('id', invite.id);
    throw new Error('Este convite expirou.');
  }
  if (['recusado', 'revogado', 'expirado'].includes(invite.status)) throw new Error('Este convite não está mais disponível.');

  const { data, error: updateError } = await supabaseAdmin
    .from('admin_invites')
    .update({
      status: 'aprovacao',
      accepted_at: new Date().toISOString(),
      auth_user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', invite.id)
    .select('id,email,name,cargo,role,status,invited_by,invited_at,expires_at,accepted_at,approved_at,approved_by,auth_user_id')
    .single();
  if (updateError) throw updateError;
  return data as AdminInvite;
}

export async function approveAdminInvite(id: string, approvedBy: string): Promise<AdminInvite> {
  const { data: invite, error } = await supabaseAdmin.from('admin_invites').select('*').eq('id', id).single();
  if (error) throw error;
  if (!invite.auth_user_id) throw new Error('O convidado ainda não aceitou o convite.');
  if (!['pendente', 'aprovacao', 'aceito'].includes(invite.status)) throw new Error('Este convite não pode ser aprovado.');

  const now = new Date().toISOString();
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: invite.auth_user_id,
    name: invite.name,
    cargo: invite.cargo,
    department: ROLE_DEPARTMENT[invite.role],
    function_title: invite.cargo,
    updated_at: now,
  }, { onConflict: 'id' });
  if (profileError) throw profileError;

  const { error: roleError } = await supabaseAdmin.from('user_roles').upsert({
    user_id: invite.auth_user_id,
    role: invite.role,
  }, { onConflict: 'user_id' });
  if (roleError) throw roleError;

  const { data, error: updateError } = await supabaseAdmin
    .from('admin_invites')
    .update({ status: 'aprovado', approved_at: now, approved_by: approvedBy, updated_at: now })
    .eq('id', id)
    .select('id,email,name,cargo,role,status,invited_by,invited_at,expires_at,accepted_at,approved_at,approved_by,auth_user_id')
    .single();
  if (updateError) throw updateError;
  return data as AdminInvite;
}

export async function rejectAdminInvite(id: string, rejectedBy: string): Promise<AdminInvite> {
  const { data, error } = await supabaseAdmin
    .from('admin_invites')
    .update({ status: 'recusado', approved_by: rejectedBy, updated_at: new Date().toISOString() })
    .eq('id', id)
    .in('status', ['pendente', 'aprovacao', 'aceito'])
    .select('id,email,name,cargo,role,status,invited_by,invited_at,expires_at,accepted_at,approved_at,approved_by,auth_user_id')
    .single();
  if (error) throw error;
  return data as AdminInvite;
}
