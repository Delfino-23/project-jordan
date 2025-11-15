import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

// ---- INTERFACE DE TIPAGEM ----
export interface IAluno {
  id: number;
  nome: string;
  email: string;
  tel: string;
  cpf: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// para permitir criação sem “id”
interface IAlunoCreation extends Optional<IAluno, "id"> {}

// ---- MODEL TIPADO ----
class Aluno extends Model<IAluno, IAlunoCreation> implements IAluno {
  public id!: number;
  public nome!: string;
  public email!: string;
  public tel!: string;
  public cpf!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Aluno.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
}, {
  sequelize,
  modelName: 'Aluno',
  tableName: 'Alunos',
  timestamps: true,
});

export default Aluno;
