// Mock crypto for environments that don't have it natively
if (typeof crypto === 'undefined') {
  // @ts-ignore: Property 'crypto' does not exist on type 'Window & typeof globalThis'.
  globalThis.crypto = {
    // @ts-ignore: Property 'getRandomValues' does not exist on type 'Crypto'.
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        // @ts-ignore: Property 'arr' does not exist on type 'Uint8Array'.
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }
  };
}

// Mock fetch for Node.js environment
if (typeof fetch === 'undefined') {
  // @ts-ignore: Variable 'fetch' does not exist.
  globalThis.fetch = async (url: RequestInfo | URL, init?: RequestInit) => {
    // This is a minimal mock - in real tests you might want to use msw or similar
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };
}

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'test-anon-key';

// Cloudflare Workers environment mock
if (typeof process.env.CF_PAGES === 'undefined') {
  process.env.CF_PAGES = '1';
}
if (typeof process.env.CLOUDFLARE === 'undefined') {
  process.env.CLOUDFLARE = 'true';
}