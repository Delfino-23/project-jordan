import { validarUsuario, criarUsuario } from "../controllers/UsuarioControllers.js";
import Usuario from "../models/Usuario.js";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';

// Mock do modelo Usuario
jest.mock("../models/Usuario.js", () => {
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

describe("Testes de validação de usuário - Controller", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validarUsuario", () => {
    test("Deve validar um usuário com credenciais corretas", async () => {
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
        usuario: { nome: "Teste", email: "teste@teste.com" },
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
  });
});