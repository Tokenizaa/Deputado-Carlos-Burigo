import { describe, it, expect } from 'vitest';
import { validatePassword } from '../../../src/lib/passwordValidation';

describe('Password Validation', () => {
  describe('Valid passwords', () => {
    it('should accept a password with exactly 12 characters meeting all criteria', () => {
      const result = validatePassword('Abcdefghij1!');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept a longer password meeting all criteria', () => {
      const result = validatePassword('MySecurePassword123!@#');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept passwords with various special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:\'",.<>?';
      for (const char of specialChars) {
        const password = `Abcdefghij1${char}`;
        const result = validatePassword(password);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      }
    });
  });

  describe('Invalid passwords - length', () => {
    it('should reject password with less than 12 characters', () => {
      const result = validatePassword('Abcdefghij1');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve ter pelo menos 12 caracteres.');
    });

    it('should reject empty string', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve ter pelo menos 12 caracteres.');
    });

    it('should reject password with only spaces (less than 12)', () => {
      const result = validatePassword('           '); // 11 spaces
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve ter pelo menos 12 caracteres.');
    });
  });

  describe('Invalid passwords - missing uppercase', () => {
    it('should reject password with no uppercase letters', () => {
      const result = validatePassword('abcdefghij1!');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve conter pelo menos uma letra maiúscula.');
    });

    it('should reject password with only lowercase and numbers', () => {
      const result = validatePassword('abcdefghij123!');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve conter pelo menos uma letra maiúscula.');
    });
  });

  describe('Invalid passwords - missing lowercase', () => {
    it('should reject password with no lowercase letters', () => {
      const result = validatePassword('ABCDEFGHIJ1!');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve conter pelo menos uma letra minúscula.');
    });

    it('should reject password with only uppercase and numbers', () => {
      const result = validatePassword('ABCDEFGHIJ123!');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve conter pelo menos uma letra minúscula.');
    });
  });

  describe('Invalid passwords - missing digits', () => {
    it('should reject password with no digits', () => {
      const result = validatePassword('Abcdefghij!@'); // 12 chars: letters + special, no digits
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve conter pelo menos um dígito.');
    });

    it('should reject password with only letters and special characters', () => {
      const result = validatePassword('Abcdefghij!!??'); // 12 chars: letters + special, no digits
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve conter pelo menos um dígito.');
    });
  });

  describe('Invalid passwords - missing special characters', () => {
    it('should reject password with no special characters', () => {
      const result = validatePassword('Abcdefghij12');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve conter pelo menos um caractere especial.');
    });

    it('should reject password with only letters and numbers', () => {
      const result = validatePassword('Abcdefghij1234');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('A senha deve conter pelo menos um caractere especial.');
    });
  });

  describe('Error messages', () => {
    it('should not include the password in error messages', () => {
      const testPassword = 'secretPassword123!';
      const result = validatePassword('short');
      expect(result.error).not.toContain(testPassword);
      
      const result2 = validatePassword('nospecial123');
      expect(result2.error).not.toContain(testPassword);
      
      const result3 = validatePassword('NOLOWERCASE123!');
      expect(result3.error).not.toContain(testPassword);
    });

    it('should provide specific error messages for each validation failure', () => {
      // Length error
      expect(validatePassword('short').error).toBe('A senha deve ter pelo menos 12 caracteres.');
      
      // Missing uppercase (12 chars: lowercase + digit + special)
      expect(validatePassword('lowercase123!@#').error).toBe('A senha deve conter pelo menos uma letra maiúscula.');
      
      // Missing lowercase (12 chars: uppercase + digit + special)
      expect(validatePassword('UPPERCASE123!@#').error).toBe('A senha deve conter pelo menos uma letra minúscula.');
      
      // Missing digit (12 chars: uppercase + lowercase + special)
      expect(validatePassword('NoDigit!!??!').error).toBe('A senha deve conter pelo menos um dígito.');
      
      // Missing special character (12 chars: uppercase + lowercase + digit)
      expect(validatePassword('NoSpecialChar123').error).toBe('A senha deve conter pelo menos um caractere especial.');
    });
  });

  describe('Order of validation', () => {
    it('should fail on length check first', () => {
      // This password fails length and uppercase, but should report length first
      const result = validatePassword('Abcdefghij');
      expect(result.error).toBe('A senha deve ter pelo menos 12 caracteres.');
    });

    it('should fail on uppercase check second', () => {
      // This password passes length (12) but fails uppercase and others, should report uppercase first
      const result = validatePassword('abcdefghij1!');
      expect(result.error).toBe('A senha deve conter pelo menos uma letra maiúscula.');
    });

    it('should fail on lowercase check third', () => {
      // This password passes length (12) and uppercase but fails lowercase, should report lowercase first
      const result = validatePassword('ABCDEFGHIJ1!');
      expect(result.error).toBe('A senha deve conter pelo menos uma letra minúscula.');
    });

    it('should fail on digit check fourth', () => {
      // This password passes length (12), uppercase, lowercase but fails digit, should report digit first
      const result = validatePassword('Abcdefghij!!');
      expect(result.error).toBe('A senha deve conter pelo menos um dígito.');
    });

    it('should fail on special character check last', () => {
      // This password passes length (12), uppercase, lowercase, digit but fails special char, should report special char first
      const result = validatePassword('Abcdefghij12');
      expect(result.error).toBe('A senha deve conter pelo menos um caractere especial.');
    });
  });
});