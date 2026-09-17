import type {
  PublicDemandDto,
  DemandMessageDto,
  DemandHistoryDto,
} from '../../src/contracts/publicDemand';

type DemandRow = {
  id: string;
  protocol: string;
  tracking_token_hash: string;
  citizen_name: string;
  citizen_email: string;
  citizen_phone: string;
  municipality: string;
  neighborhood?: string | null;
  category:
    | 'solicitar atendimento'
    | 'apresentar demanda'
    | 'enviar sugestão'
    | 'solicitar informação'
    | 'projeto de lei'
    | 'saúde e hospitalar'
    | 'infraestrutura e rodovias'
    | 'educação'
    | 'agricultura e silvicultura'
    | 'outro assunto';
  subject: string;
  description: string;
  attachments: string[] | unknown;
  assigned_to?: string | null;
  priority: 'baixa' | 'média' | 'alta' | 'urgente';
  status:
    | 'recebida'
    | 'em análise'
    | 'em atendimento'
    | 'encaminhada'
    | 'aguardando retorno'
    | 'respondida'
    | 'concluída'
    | 'arquivada';
  created_at: string;
  updated_at: string;
};

type DemandMessageRow = {
  id: string;
  demand_id: string;
  sender_type: 'citizen' | 'cabinet';
  sender_name: string;
  text: string;
  attachments?: string[] | null;
  created_at: string;
};

type DemandHistoryRow = {
  id: string;
  demand_id: string;
  action: string;
  previous_status?:
    | 'recebida'
    | 'em análise'
    | 'em atendimento'
    | 'encaminhada'
    | 'aguardando retorno'
    | 'respondida'
    | 'concluída'
    | 'arquivada';
  new_status?:
    | 'recebida'
    | 'em análise'
    | 'em atendimento'
    | 'encaminhada'
    | 'aguardando retorno'
    | 'respondida'
    | 'concluída'
    | 'arquivada';
  actor_id: string;
  actor_name: string;
  actor_role: string;
  note?: string | null;
  created_at: string;
};

function jsonObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function mapToPublicDemandDto(row: DemandRow): PublicDemandDto {
  return {
    id: row.id,
    protocol: row.protocol,
    trackingTokenHash: row.tracking_token_hash,
    citizenName: row.citizen_name,
    citizenEmail: row.citizen_email,
    citizenPhone: row.citizen_phone,
    municipality: row.municipality,
    neighborhood: row.neighborhood ?? undefined,
    category: row.category,
    subject: row.subject,
    description: row.description,
    attachments: stringArray(row.attachments),
    assignedTo: row.assigned_to ?? undefined,
    priority: row.priority,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: [],
    history: []
  };
}

export function mapToPublicDemandMessageDto(row: DemandMessageRow): DemandMessageDto {
  return {
    id: row.id,
    demandId: row.demand_id,
    senderType: row.sender_type,
    senderName: row.sender_name,
    text: row.text,
    attachments: row.attachments ?? undefined,
    createdAt: row.created_at,
  };
}

export function mapToPublicDemandHistoryDto(row: DemandHistoryRow): DemandHistoryDto {
  return {
    id: row.id,
    demandId: row.demand_id,
    action: row.action,
    previousStatus: row.previous_status ?? undefined,
    newStatus: row.new_status ?? undefined,
    actorId: row.actor_id,
    actorName: row.actor_name,
    actorRole: row.actor_role,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}