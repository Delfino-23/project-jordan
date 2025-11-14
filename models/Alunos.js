import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Alunos = sequelize.define('Alunos', {
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
  tableName: 'Alunos',
  timestamps: true,
});

export default Alunos
