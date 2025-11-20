import bodyParser from "body-parser";
import express from "express";
import homeRoutes from "./routes/home.js";
import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import sequelize from "./config/database.js";
import { fileURLToPath } from "url";
import path from "path";

// 👇 Solução para usar __dirname com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Configura EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

// Serve arquivos JS gerados
app.use(express.static(path.resolve(__dirname, "public")));

app.use("/", homeRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados foi estabelecida com sucesso.");

    await sequelize.sync({ force: false });

    console.log("Banco de dados sincronizado e tabelas verificadas.");
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Não foi possível conectar ao banco de dados:", err);
  }
};
startServer();
