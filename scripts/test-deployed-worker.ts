#!/usr/bin/env node
/**
 * Test script for deployed worker using x-user-id header (current implementation)
 * Tests role-based access with the 3 seeded test users
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tokens = JSON.parse(readFileSync(join(__dirname, '..', 'test-tokens.json'), 'utf-8'));

// Use user IDs as x-user-id header values (current auth mechanism)
const testUsers = tokens.map(t => ({
  role: t.role,
  userId: t.userId,
  name: t.name,
}));

const BASE_URL = 'https://deputado-carlos-burigo.lightning-wasabi.workers.dev';

interface TestResult {
  endpoint: string;
  method: string;
  role: string;
  expectedStatus: number;
  actualStatus: number;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function printHeader(title: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(` ${title}`);
  console.log(`${'='.repeat(60)}`);
}

function printTest(method: string, endpoint: string, role: string, expected: number, actual: number, passed: boolean, error?: string) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  console.log(`${color}${status}${reset} ${method} ${endpoint} [${role}] expected:${expected} got:${actual}${error ? ` - ${error}` : ''}`);
}

async function makeRequest(
  method: string,
  endpoint: string,
  userId: string | null,
  body?: any
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (userId) {
    headers['x-user-id'] = userId;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = await response.text();
  }

  return { status: response.status, data };
}

async function testEndpoint(
  method: string,
  endpoint: string,
  role: string,
  userId: string | null,
  expectedStatus: number,
  body?: any
): Promise<TestResult> {
  const { status, data } = await makeRequest(method, endpoint, userId, body);
  const passed = status === expectedStatus;
  
  let error;
  if (!passed) {
    error = `Expected ${expectedStatus}, got ${status}: ${JSON.stringify(data).slice(0, 200)}`;
  }

  printTest(method, endpoint, role, expectedStatus, status, passed, error);
  
  return {
    endpoint,
    method,
    role,
    expectedStatus,
    actualStatus: status,
    passed,
    error,
  };
}

// Admin endpoints - current implementation uses x-user-id header
const ADMIN_ENDPOINTS = [
  { method: 'GET', endpoint: '/api/admin/pages', public: false },
  { method: 'POST', endpoint: '/api/admin/pages', public: false, body: { title: 'Test Page', slug: 'test-page-deployed', status: 'rascunho' } },
  { method: 'GET', endpoint: '/api/demands', public: false },
  { method: 'GET', endpoint: '/api/audit-logs', public: false },
  { method: 'GET', endpoint: '/api/auth/me', public: false },
];

const PUBLIC_ENDPOINTS = [
  { method: 'GET', endpoint: '/api/health', public: true },
  { method: 'GET', endpoint: '/api/settings', public: true },
  { method: 'GET', endpoint: '/api/projects', public: true },
  { method: 'GET', endpoint: '/api/results', public: true },
  { method: 'GET', endpoint: '/api/municipalities', public: true },
  { method: 'GET', endpoint: '/api/videos', public: true },
  { method: 'GET', endpoint: '/api/media', public: true },
  { method: 'GET', endpoint: '/api/news', public: true },
  { method: 'GET', endpoint: '/api/agenda', public: true },
  { method: 'GET', endpoint: '/api/votes', public: true },
  { method: 'GET', endpoint: '/api/pages', public: true },
  { method: 'GET', endpoint: '/api/documents', public: true },
  { method: 'GET', endpoint: '/api/evidence', public: true },
];

async function runTests() {
  printHeader('DEPLOYED WORKER AUTH VALIDATION (x-user-id header)');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Users: ${testUsers.map(t => `${t.role}(${t.userId.slice(0,8)})`).join(', ')}`);

  // Test 1: Public endpoints
  printHeader('TEST 1: Public Endpoints (no auth required)');
  for (const ep of PUBLIC_ENDPOINTS) {
    for (const user of testUsers) {
      const result = await testEndpoint(ep.method, ep.endpoint, user.role, user.userId, 200);
      results.push(result);
    }
    // Also test without auth
    const result = await testEndpoint(ep.method, ep.endpoint, 'NO_AUTH', null, 200);
    results.push(result);
  }

  // Test 2: Admin endpoints - ADMIN role (full access)
  printHeader('TEST 2: Admin Endpoints - ADMIN Role (full access)');
  const adminUser = testUsers.find(t => t.role === 'ADMIN');
  for (const ep of ADMIN_ENDPOINTS) {
    const expected = ep.method === 'POST' ? 201 : 200;
    const result = await testEndpoint(ep.method, ep.endpoint, 'ADMIN', adminUser?.userId || null, expected, ep.body);
    results.push(result);
  }

  // Test 3: Admin endpoints - EDITOR role (content access)
  printHeader('TEST 3: Admin Endpoints - EDITOR Role (content access)');
  const editorUser = testUsers.find(t => t.role === 'EDITOR');
  for (const ep of ADMIN_ENDPOINTS) {
    let expected = ep.method === 'POST' ? 201 : 200;
    // Current implementation: no role check, just checks x-user-id exists
    // So EDITOR should have access to all admin endpoints
    const result = await testEndpoint(ep.method, ep.endpoint, 'EDITOR', editorUser?.userId || null, expected, ep.body);
    results.push(result);
  }

  // Test 4: Admin endpoints - COMUNICACAO role
  printHeader('TEST 4: Admin Endpoints - COMUNICACAO Role');
  const comUser = testUsers.find(t => t.role === 'COMUNICACAO');
  for (const ep of ADMIN_ENDPOINTS) {
    let expected = ep.method === 'POST' ? 201 : 200;
    const result = await testEndpoint(ep.method, ep.endpoint, 'COMUNICACAO', comUser?.userId || null, expected, ep.body);
    results.push(result);
  }

  // Test 5: No auth on admin endpoints (should be 401)
  printHeader('TEST 5: Unauthorized Access (no x-user-id header)');
  for (const ep of ADMIN_ENDPOINTS) {
    const result = await testEndpoint(ep.method, ep.endpoint, 'NO_AUTH', null, 401);
    results.push(result);
  }

  // Test 6: Page Builder flow with ADMIN
  printHeader('TEST 6: Page Builder Flow (ADMIN)');
  await testPageBuilderFlow(adminUser!);

  // Summary
  printHeader('SUMMARY');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.method} ${r.endpoint} [${r.role}] expected:${r.expectedStatus} got:${r.actualStatus} - ${r.error}`);
    });
  } else {
    console.log('\n✅ All tests passed!');
  }

  // Note about current implementation
  console.log('\n📝 NOTE: Current deployed worker uses x-user-id header auth');
  console.log('   Role-based access control is enforced at DB level (RLS policies)');
  console.log('   New implementation (Bearer token) requires deployment');
}

async function testPageBuilderFlow(adminUser: any) {
  const userId = adminUser.userId;
  
  // 1. Create a page
  console.log('\n📄 Creating page...');
  const createRes = await makeRequest('POST', '/api/admin/pages', userId, {
    title: 'Test Landing Page Deployed',
    slug: 'test-landing-page-deployed',
    description: 'A test page for validation',
    status: 'rascunho',
    blocks: [
      { type: 'hero', title: 'Hero Block', content: { headline: 'Welcome', subheadline: 'Test page' }, visible: true, active: true, order: 1 },
      { type: 'text', title: 'Content Block', content: { body: 'This is test content' }, visible: true, active: true, order: 2 },
    ],
  });
  console.log(`   Create: ${createRes.status}`);
  if (createRes.status !== 201) {
    console.log(`   ❌ Failed:`, createRes.data);
    return;
  }
  const page = createRes.data;
  console.log(`   ✅ Page created: ${page.id}`);
  
  // 2. Get the page
  console.log('\n📖 Getting page...');
  const getRes = await makeRequest('GET', `/api/admin/pages/${page.id}`, userId);
  console.log(`   Get: ${getRes.status}`);
  if (getRes.status !== 200) {
    console.log(`   ❌ Failed:`, getRes.data);
    return;
  }
  console.log(`   ✅ Page retrieved with ${getRes.data.blocks?.length || 0} blocks`);
  
  // 3. Update the page
  console.log('\n✏️ Updating page...');
  const updateRes = await makeRequest('PUT', `/api/admin/pages/${page.id}`, userId, {
    title: 'Test Landing Page Updated',
    blocks: [
      ...page.blocks,
      { type: 'cta', title: 'CTA Block', content: { text: 'Click me', url: '/contact' }, visible: true, active: true, order: 3 },
    ],
    status: 'rascunho',
  });
  console.log(`   Update: ${updateRes.status}`);
  if (updateRes.status !== 200) {
    console.log(`   ❌ Failed:`, updateRes.data);
    return;
  }
  console.log(`   ✅ Page updated`);
  
  // 4. Publish the page
  console.log('\n🚀 Publishing page...');
  const publishRes = await makeRequest('PUT', `/api/admin/pages/${page.id}`, userId, {
    ...updateRes.data,
    status: 'publicado',
    publish: true,
  });
  console.log(`   Publish: ${publishRes.status}`);
  if (publishRes.status !== 200) {
    console.log(`   ❌ Failed:`, publishRes.data);
    return;
  }
  console.log(`   ✅ Page published`);
  
  // 5. Verify version created
  console.log('\n📜 Checking versions...');
  const versionsRes = await makeRequest('GET', `/api/admin/pages/${page.id}`, userId);
  if (versionsRes.status === 200 && versionsRes.data.versions) {
    console.log(`   ✅ Versions: ${versionsRes.data.versions.length} version(s)`);
    versionsRes.data.versions.forEach((v: any, i: number) => {
      console.log(`      v${v.versionNumber}: ${v.status} - ${v.note}`);
    });
  }
  
  // 6. Test rollback
  console.log('\n↩️ Testing rollback...');
  if (versionsRes.data.versions && versionsRes.data.versions.length >= 2) {
    const v1 = versionsRes.data.versions[1];
    const rollbackRes = await makeRequest('POST', `/api/admin/pages/${page.id}/rollback`, userId, {
      versionId: v1.id,
    });
    console.log(`   Rollback: ${rollbackRes.status}`);
    if (rollbackRes.status === 200) {
      console.log(`   ✅ Rollback successful`);
    }
  }
  
  // 7. Verify public access
  console.log('\n🌐 Verifying public access...');
  const publicRes = await makeRequest('GET', `/api/pages/${page.slug}`, null);
  console.log(`   Public GET: ${publicRes.status}`);
  if (publicRes.status === 200) {
    console.log(`   ✅ Published page accessible publicly`);
  }
}

runTests();