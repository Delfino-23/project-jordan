/**
 * Interface para o payload do token JWT
 */
export interface TokenPayload {
  id: number;
  email: string;
  nome: string;
}

/**
 * Interface para a resposta de login
 */
export interface LoginResponse {
  message: string;
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

/**
 * Interface para a resposta de erro de autenticação
 */
export interface AuthError {
  error: string;
}
