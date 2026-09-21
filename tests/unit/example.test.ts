import { describe, it, expect } from 'vitest';

describe('Example test suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should test environment setup', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(typeof fetch).toBe('function');
  });
});