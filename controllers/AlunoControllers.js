import Alunos from "../models/Alunos.js";

/**
 * Cria um novo aluno.
 */
export const criarAluno = async (req, res) => {
  const { nome, email, tel, cpf } = req.body;

  try {
    if (!nome || !email || !tel || !cpf) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
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
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar aluno." });
  }
};
