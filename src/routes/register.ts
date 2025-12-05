import express from "express";
import { criarUsuario } from "../controllers/UsuarioControllers.js";
import { redirecionarSeAutenticado } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", redirecionarSeAutenticado, (req, res) => {
    res.render("register", { page: "register" });
})

router.post("/salvar", criarUsuario);

export default router;
