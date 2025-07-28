import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'client'),
    defaultValue: 'client',
  },
  tel: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

export default User;