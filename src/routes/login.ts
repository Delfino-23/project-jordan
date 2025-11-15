import express from 'express';
import { validarUsuario } from '../controllers/UsuarioControllers.js';

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { page: "login" });
});

router.post("/validar", validarUsuario);

export default router;
