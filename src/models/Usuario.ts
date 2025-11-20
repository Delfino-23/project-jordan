import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

// ---- INTERFACE DE TIPAGEM ----
export interface IUsuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// para permitir criação sem “id”
interface IUsuarioCreation extends Optional<IUsuario, "id"> {}

// ---- MODEL TIPADO ----
class Usuario extends Model<IUsuario, IUsuarioCreation> implements IUsuario {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Usuario.init(
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuarios',
    timestamps: true,
  }
);

export default Usuario;
