import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";

const dbPath = path.resolve("banco.db");


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
    storage: path.join(dbPath, '..', '..', 'banco.db'), // <-- Verifique esta linha
});

export default sequelize;