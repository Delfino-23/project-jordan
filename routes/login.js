import express from 'express';
import { criarUsuario } from '../controllers/UsuarioControllers.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login.ejs');
});

router.post('/salvar', criarUsuario);

export default router;
