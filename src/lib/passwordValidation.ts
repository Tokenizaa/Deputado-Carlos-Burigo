export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 12) {
    return {
      valid: false,
      error: 'A senha deve ter pelo menos 12 caracteres.',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: 'A senha deve conter pelo menos uma letra maiúscula.',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: 'A senha deve conter pelo menos uma letra minúscula.',
    };
  }

  if (!/\d/.test(password)) {
    return {
      valid: false,
      error: 'A senha deve conter pelo menos um dígito.',
    };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      error: 'A senha deve conter pelo menos um caractere especial.',
    };
  }

  return { valid: true };
};