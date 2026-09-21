import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Supabase Client', () => {
  const mockEnv = {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-anon-key',
  };

  beforeEach(() => {
    // Clear all mocks and reset module state so clientPromise starts fresh
    vi.clearAllMocks();
    vi.resetModules();

    // Mock environment variables
    vi.stubEnv('SUPABASE_URL', mockEnv.SUPABASE_URL);
    vi.stubEnv('SUPABASE_ANON_KEY', mockEnv.SUPABASE_ANON_KEY);

    // Mock fetch globally
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('getSupabaseClient', () => {
    it('should return a Promise that resolves to a SupabaseClient on success', async () => {
      const { getSupabaseClient } = await import('../../../src/lib/supabaseClient');

      // Arrange
      const mockConfig = {
        url: mockEnv.SUPABASE_URL,
        publishableKey: mockEnv.SUPABASE_ANON_KEY,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockConfig),
      } as Response);

      // Act
      const clientPromise = getSupabaseClient();

      // Assert
      expect(clientPromise).toBeInstanceOf(Promise);
      await expect(clientPromise).resolves.toBeDefined();

      // Verify fetch was called with correct URL
      expect(fetch).toHaveBeenCalledWith('/api/auth/config');
    });

    it('should cache the client and return the same promise on subsequent calls', async () => {
      const { getSupabaseClient } = await import('../../../src/lib/supabaseClient');

      // Arrange
      const mockConfig = {
        url: mockEnv.SUPABASE_URL,
        publishableKey: mockEnv.SUPABASE_ANON_KEY,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockConfig),
      } as Response);

      // Act
      const promise1 = getSupabaseClient();
      const promise2 = getSupabaseClient();

      // Assert
      expect(promise1).toBe(promise2); // Same promise object (caching works)
      await promise1;
      await promise2;

      // Verify fetch was only called once due to caching
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when auth config fetch fails', async () => {
      const { getSupabaseClient } = await import('../../../src/lib/supabaseClient');

      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // Act & Assert
      await expect(getSupabaseClient()).rejects.toThrow(
        'Falha ao carregar configuração de autenticação'
      );
    });

    it('should throw an error when auth config is incomplete (missing URL)', async () => {
      const { getSupabaseClient } = await import('../../../src/lib/supabaseClient');

      // Arrange
      const incompleteConfig = {
        // missing url
        publishableKey: mockEnv.SUPABASE_ANON_KEY,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(incompleteConfig),
      } as Response);

      // Act & Assert
      await expect(getSupabaseClient()).rejects.toThrow(
        'Configuração de autenticação incompleta'
      );
    });

    it('should throw an error when auth config is incomplete (missing key)', async () => {
      const { getSupabaseClient } = await import('../../../src/lib/supabaseClient');

      // Arrange
      const incompleteConfig = {
        url: mockEnv.SUPABASE_URL,
        // missing publishableKey
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(incompleteConfig),
      } as Response);

      // Act & Assert
      await expect(getSupabaseClient()).rejects.toThrow(
        'Configuração de autenticação incompleta'
      );
    });
  });
});