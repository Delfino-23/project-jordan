import express from "express";
import { criarUsuario } from "../controllers/UsuarioControllers.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("register", { page: "register" });
})

router.post("/salvar", criarUsuario);

export default router;
