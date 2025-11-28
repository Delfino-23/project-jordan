import { Request, Response } from "express";
import Usuario from "../models/Usuario.js";
import bcrypt from 'bcryptjs';
import { gerarToken } from '../middleware/authMiddleware.js';

/**
 * Cria um novo usuário.
 */
export const criarUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: "Usuário já cadastrado!" });
    }

    const novoUsuario = await Usuario.create({ nome, email, senha: hashedSenha });
    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      },
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

/**
 * Validar login do usuário.
 */
export const validarUsuario = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Email ou senha incorreto!" });
    }

    const token = gerarToken(usuario.id, usuario.email, usuario.nome);

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (error) {
    console.error("Erro ao validar login:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
