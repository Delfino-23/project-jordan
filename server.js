import bodyParser from "body-parser";
import express from "express";
import homeRoutes from "./routes/home.js";
import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import sequelize from "./config/database.js";

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/css", express.static("./node_modules/bootstrap/dist/css"));
app.use("/js", express.static("./node_modules/bootstrap/dist/js"));

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

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
