import express from 'express';
import { criarAluno } from '../controllers/AlunoControllers.js';
import { verificarToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index.ejs', { page: "home" });
});

router.post('/criarAluno', criarAluno);


export default router;
