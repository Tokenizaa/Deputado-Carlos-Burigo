#!/usr/bin/env node
/**
 * Seed script for Admin Auth validation
 * Creates 3 test users in Supabase Auth with roles:
 * - ADMIN (full access)
 * - EDITOR (content management)
 * - COMUNICACAO (news/media)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load .dev.vars for local development
config({ path: '.dev.vars' });
config({ path: '.env' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wktanxbpijurimdjgone.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment');
  console.error('   Add to .dev.vars or .env file');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface TestUser {
  email: string;
  password: string;
  name: string;
  cargo: string;
  role: 'ADMIN' | 'EDITOR' | 'COMUNICACAO';
}

const TEST_USERS: TestUser[] = [
  {
    email: 'admin@test.carlosburigo.rs.gov.br',
    password: 'TestAdmin123!',
    name: 'Admin Test User',
    cargo: 'Administrador do Sistema',
    role: 'ADMIN',
  },
  {
    email: 'editor@test.carlosburigo.rs.gov.br',
    password: 'TestEditor123!',
    name: 'Editor Test User',
    cargo: 'Editor de Conteúdo',
    role: 'EDITOR',
  },
  {
    email: 'comunicacao@test.carlosburigo.rs.gov.br',
    password: 'TestComunicacao123!',
    name: 'Comunicação Test User',
    cargo: 'Assessoria de Comunicação',
    role: 'COMUNICACAO',
  },
];

async function createAuthUser(user: TestUser) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    user_metadata: { name: user.name },
  });

  if (error) throw error;
  return data.user;
}

async function createProfile(userId: string, user: TestUser) {
  const { error } = await supabaseAdmin.from('profiles').upsert({
    id: userId,
    name: user.name,
    cargo: user.cargo,
    avatar_url: null,
  });

  if (error) throw error;
}

async function assignRole(userId: string, role: string) {
  const { error } = await supabaseAdmin.from('user_roles').upsert({
    user_id: userId,
    role: role,
  });

  if (error) throw error;
}

async function signInUser(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.session?.access_token ?? null;
}

async function main() {
  console.log('🌱 Seeding test users for Admin Auth validation...\n');

  const createdUsers: Array<TestUser & { userId: string; accessToken: string }> = [];

  for (const user of TEST_USERS) {
    try {
      console.log(`📝 Creating ${user.role}: ${user.email}`);
      
      // Create auth user
      const authUser = await createAuthUser(user);
      console.log(`   ✓ Auth user created: ${authUser.id}`);

      // Create profile
      await createProfile(authUser.id, user);
      console.log(`   ✓ Profile created`);

      // Assign role
      await assignRole(authUser.id, user.role);
      console.log(`   ✓ Role assigned: ${user.role}`);

      // Sign in to get access token
      const accessToken = await signInUser(user.email, user.password);
      console.log(`   ✓ Access token obtained`);

      createdUsers.push({ ...user, userId: authUser.id, accessToken: accessToken! });
      console.log('');
    } catch (error) {
      console.error(`   ❌ Failed to create ${user.role}:`, error);
      process.exit(1);
    }
  }

  // Verify by fetching all admin users
  console.log('🔍 Verifying seeded users...');
  const { data: allUsers, error } = await supabaseAdmin
    .from('profiles')
    .select(`
      id,
      name,
      cargo,
      user_roles ( role )
    `);

  if (error) throw error;

  console.log('\n📋 Seeded users:');
  for (const u of allUsers ?? []) {
    const role = (u as any).user_roles?.[0]?.role || 'N/A';
    console.log(`   - ${u.name} (${u.cargo}) - Role: ${role} - ID: ${u.id}`);
  }

  // Save tokens to file for testing
  const tokens = createdUsers.map(u => ({
    role: u.role,
    email: u.email,
    userId: u.userId,
    accessToken: u.accessToken,
  }));

  const fs = await import('fs');
  fs.writeFileSync(
    'test-tokens.json',
    JSON.stringify(tokens, null, 2)
  );
  console.log('\n💾 Tokens saved to test-tokens.json');

  console.log('\n✅ Seed complete! Use tokens in test-tokens.json for endpoint testing.');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});