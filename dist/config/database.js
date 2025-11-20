import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// caminho correto para o config.json após build
const configPath = path.join(__dirname, "config.json");
// lê o arquivo
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
// const sequelize = new Sequelize({
//     dialect: "sqlite",
//     storage: config.storage
// });
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', '..', 'banco.db'), // <-- Verifique esta linha
});
export default sequelize;
