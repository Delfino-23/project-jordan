import Usuario from "../models/Usuario.js";
import sequelize from "../config/database.js"; // Adicionar a importação para sequelize

/**
 * Cria um novo usuário.
 */
export const criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: "Usuário já cadastrado!" });
    }

    const novoUsuario = await Usuario.create({ nome, email, senha });
    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

/**
 * Validar login do usuário.
 */
export const validarUsuario = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos!" });
  }

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'Erro ao consultar usuário.' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // 🔒 Compara senha digitada com hash do banco
    const senhaValida = bcrypt.compareSync(senha, user.senha);
    if (!senhaValida) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Login bem-sucedido
    res.send(`Bem-vindo, ${user.nome}!`);
  });
};