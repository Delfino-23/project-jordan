import { validarUsuario, criarUsuario } from "../controllers/UsuarioControllers.js";
import { criarAluno } from "../controllers/AlunoControllers.js";
import { gerarToken, verificarToken } from "../middleware/authMiddleware.js";
import Usuario from "../models/Usuario.js";
import Alunos from "../models/Alunos.js";
import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock do modelo Usuario
jest.mock("../models/Usuario.js", () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
  };
});

// Mock do modelo Alunos
jest.mock("../models/Alunos.js", () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
  };
});

// Mock do bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock do jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("Testes de Controllers e Middleware", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validarUsuario", () => {
    test("Deve validar um usuário com credenciais corretas", async () => {
      (jwt.sign as jest.Mock).mockReturnValue("token-valido");
      const mockUsuario = {
        id: 1,
        nome: "Teste",
        email: "teste@teste.com",
        senha: "senhaHash123",
      };

      (Usuario.findOne as jest.Mock).mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const mockReq = {
        body: {
          email: "teste@teste.com",
          senha: "senha123",
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await validarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Login realizado com sucesso!",
        token: "token-valido",
        usuario: { id: 1, nome: "Teste", email: "teste@teste.com" },
      });
    });

    test("Deve retornar erro para email não preenchido", async () => {
      const mockReq = {
        body: {
          email: "",
          senha: "senha123",
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await validarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Preencha todos os campos!",
      });
    });

    test("Deve retornar erro para senha não preenchida", async () => {
      const mockReq = {
        body: {
          email: "teste@teste.com",
          senha: "",
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await validarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Preencha todos os campos!",
      });
    });

    test("Deve retornar erro para usuário não encontrado", async () => {
      (Usuario.findOne as jest.Mock).mockResolvedValue(null);

      const mockReq = {
        body: {
          email: "naoexiste@teste.com",
          senha: "senha123",
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await validarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Usuário não encontrado!",
      });
    });

    test("Deve retornar erro para senha incorreta", async () => {
      const mockUsuario = {
        id: 1,
        nome: "Teste",
        email: "teste@teste.com",
        senha: "senhaHash123",
      };

      (Usuario.findOne as jest.Mock).mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const mockReq = {
        body: {
          email: "teste@teste.com",
          senha: "senhaErrada",
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await validarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Email ou senha incorreto!",
      });
    });

    test("Deve retornar erro 500 quando ocorre exceção ao validar", async () => {
      (Usuario.findOne as jest.Mock).mockRejectedValue(new Error("Erro de banco de dados"));

      const mockReq = {
        body: {
          email: "teste@teste.com",
          senha: "senha123",
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await validarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro interno do servidor",
      });
    });
  });

  describe("criarUsuario", () => {
    test("Deve criar um novo usuário com dados válidos", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("senhaHash123");
      (Usuario.findOne as jest.Mock).mockResolvedValue(null);
      (Usuario.create as jest.Mock).mockResolvedValue({
        id: 1,
        nome: "João",
        email: "joao@teste.com",
        senha: "senhaHash123",
      });

      const mockReq = {
        body: {
          nome: "João",
          email: "joao@teste.com",
          senha: "senha123",
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await criarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Usuário criado com sucesso!",
        usuario: {
          id: 1,
          nome: "João",
          email: "joao@teste.com",
        },
      });
    });

    test("Deve retornar erro quando faltam campos obrigatórios", async () => {
      const mockReq = {
        body: {
          nome: "João",
          // faltam email e senha
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await criarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Preencha todos os campos!",
      });
    });

    test("Deve retornar erro quando usuário já existe", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("senhaHash123");
      (Usuario.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: "joao@teste.com",
      });

      const mockReq = {
        body: {
          nome: "João",
          email: "joao@teste.com",
          senha: "senha123",
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await criarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Usuário já cadastrado!",
      });
    });

    test("Deve retornar erro 500 quando ocorre exceção no banco de dados", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("senhaHash123");
      (Usuario.findOne as jest.Mock).mockRejectedValue(new Error("Erro de banco de dados"));

      const mockReq = {
        body: {
          nome: "João",
          email: "joao@teste.com",
          senha: "senha123",
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await criarUsuario(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro ao criar usuário.",
      });
    });
  });

  describe("criarAluno", () => {
    test("Deve criar um novo aluno com dados válidos", async () => {
      (Alunos.findOne as jest.Mock).mockResolvedValue(null);
      (Alunos.create as jest.Mock).mockResolvedValue({
        id: 1,
        nome: "João Silva",
        email: "joao@email.com",
        tel: "11999999999",
        cpf: "12345678910"
      });

      const mockReq = {
        body: {
          nome: "João Silva",
          email: "joao@email.com",
          tel: "11999999999",
          cpf: "12345678910"
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await criarAluno(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Aluno criado com sucesso!",
        aluno: {
          id: 1,
          nome: "João Silva",
          email: "joao@email.com",
          tel: "11999999999",
          cpf: "12345678910"
        },
      });
    });

    test("Deve retornar erro ao não preencher campos obrigatórios", async () => {
      const mockReq = {
        body: {
          nome: "João Silva",
          // faltam email, tel e cpf
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await criarAluno(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Preencha todos os campos!",
      });
    });

    test("Deve retornar erro quando aluno já existe", async () => {
      (Alunos.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: "joao@email.com",
      });

      const mockReq = {
        body: {
          nome: "João Silva",
          email: "joao@email.com",
          tel: "11999999999",
          cpf: "12345678910"
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await criarAluno(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Aluno já cadastrado!",
      });
    });

    test("Deve retornar erro 500 quando ocorre exceção no banco de dados", async () => {
      (Alunos.findOne as jest.Mock).mockRejectedValue(new Error("Erro de banco de dados"));

      const mockReq = {
        body: {
          nome: "João Silva",
          email: "joao@email.com",
          tel: "11999999999",
          cpf: "12345678910"
        },
      } as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await criarAluno(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Erro ao criar aluno.",
      });
    });
  });

  describe("gerarToken", () => {
    test("Deve gerar um token válido com dados corretos", () => {
      (jwt.sign as jest.Mock).mockReturnValue("token-valido-123");

      const token = gerarToken(1, "usuario@email.com", "João");

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, email: "usuario@email.com", nome: "João" },
        expect.any(String),
        expect.any(Object)
      );
      expect(token).toBe("token-valido-123");
    });
  });

  describe("verificarToken", () => {
    test("Deve permitir acesso com token válido no header Authorization", () => {
      const mockDecoded = { id: 1, email: "usuario@email.com", nome: "João" };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const mockReq = {
        headers: {
          authorization: "Bearer token-valido-123",
        },
        cookies: {},
      } as unknown as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn() as NextFunction;

      verificarToken(mockReq, mockRes, mockNext);

      expect(mockReq.usuarioId).toBe(1);
      expect(mockReq.usuario).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalled();
    });

    test("Deve retornar erro quando token não é fornecido", () => {
      const mockReq = {
        headers: {},
        cookies: {},
      } as unknown as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn() as NextFunction;

      verificarToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Token não fornecido!",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test("Deve retornar erro quando token é inválido", () => {
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Token inválido");
      });

      const mockReq = {
        headers: {
          authorization: "Bearer token-invalido",
        },
        cookies: {},
      } as unknown as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn() as NextFunction;

      verificarToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Token inválido ou expirado!",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test("Deve retornar erro quando token expirou", () => {
      const expiredError = new Error("jwt expired");
      (expiredError as any).name = "TokenExpiredError";
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw expiredError;
      });

      const mockReq = {
        headers: {
          authorization: "Bearer token-expirado",
        },
        cookies: {},
      } as unknown as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn() as NextFunction;

      verificarToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Token inválido ou expirado!",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test("Deve ler token do cookie quando não houver Authorization header", () => {
      const mockDecoded = { id: 1, email: "usuario@email.com", nome: "João" };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const mockReq = {
        headers: {},
        cookies: { token: "token-do-cookie" },
      } as unknown as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn() as NextFunction;

      verificarToken(mockReq, mockRes, mockNext);

      expect(mockReq.usuarioId).toBe(1);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
