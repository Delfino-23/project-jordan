import express from 'express';
import { validarUsuario } from '../controllers/UsuarioControllers.js';
import { redirecionarSeAutenticado } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", redirecionarSeAutenticado, (req, res) => {
  res.render("login", { page: "login" });
});

router.post("/validar", validarUsuario);

export default router;
