import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dbPath = path.resolve("banco.db");

// Solução para obter __filename e __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Agora você pode usar o __dirname para construir o caminho:
const configPath = path.join(__dirname, "config.json");

// lê o arquivo
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

// const sequelize = new Sequelize({
//     dialect: "sqlite",
//     storage: config.storage
// });

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve("banco.db"), // <-- agora sim aponta para o banco certo
});


export default sequelize;