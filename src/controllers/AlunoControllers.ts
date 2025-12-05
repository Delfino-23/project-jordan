import Alunos from "../models/Alunos.js";
import { Request, Response } from "express";
import { validarCamposObrigatorios } from "../utils/validators.js";
import logger from "../utils/logger.js";

/**
 * Cria um novo aluno.
 */
export const criarAluno = async (req: Request, res: Response) => {
  const { nome, email, tel, cpf } = req.body;

  try {
    const validacaoErro = validarCamposObrigatorios(
      { nome, email, tel, cpf },
      ['nome', 'email', 'tel', 'cpf']
    );

    if (validacaoErro) {
      return res.status(400).json({ error: validacaoErro });
    }

    const alunoExistente = await Alunos.findOne({ where: { email } });
    if (alunoExistente) {
      return res.status(400).json({ error: "Aluno já cadastrado!" });
    }

    const novoAluno = await Alunos.create({ nome, email, tel, cpf });
    return res.status(201).json({
      message: "Aluno criado com sucesso!",
      aluno: {
        id: novoAluno.id,
        nome: novoAluno.nome,
        email: novoAluno.email,
        tel: novoAluno.tel,
        cpf: novoAluno.cpf
      },
    });
  } catch (error) {
    logger.error("Erro ao criar aluno", error);
    return res.status(500).json({ error: "Erro ao criar aluno." });
  }
};
