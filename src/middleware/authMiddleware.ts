import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      usuarioId?: number;
      usuario?: {
        id: number;
        nome: string;
        email: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-muito-segura-aqui';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Gera um token JWT para o usuário
 */
export const gerarToken = (usuarioId: number, email: string, nome: string): string => {
  return jwt.sign(
    { id: usuarioId, email, nome },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
};

/**
 * Middleware para verificar se o usuário está autenticado
 */
export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido!' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      nome: string;
    };
    
    req.usuarioId = decoded.id;
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      nome: decoded.nome,
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado!' });
  }
};

/**
 * Middleware para redirecionar usuários já autenticados para a página principal
 */
export const redirecionarSeAutenticado = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      // Token válido, redirecionar para home
      res.redirect('/');
      return;
    } catch (error) {
      // Token inválido, continuar normalmente
      next();
    }
  } else {
    // Sem token, continuar normalmente
    next();
  }
};

/**
 * Middleware para adicionar token ao header Authorization (para renderização de páginas)
 * Nota: Este middleware funciona com tokens passados via localStorage pelo cliente
 */
export const verificarTokenPagina = (req: Request, res: Response, next: NextFunction): void => {
  // Renderizar página mesmo sem token (token será validado no frontend)
  next();
};
