/**
 * Helper para validações comuns
 */

export const validarCamposObrigatorios = (campos: Record<string, any>, nomesObrigatorios: string[]): string | null => {
  for (const nome of nomesObrigatorios) {
    if (!campos[nome] || (typeof campos[nome] === 'string' && campos[nome].trim() === '')) {
      return `Preencha todos os campos!`;
    }
  }
  return null;
};

export const validarEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validarTelefone = (telefone: string): boolean => {
  const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return telefoneRegex.test(telefone);
};

export const validarCPF = (cpf: string): boolean => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfRegex.test(cpf);
};
