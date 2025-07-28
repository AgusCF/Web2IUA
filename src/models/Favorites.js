import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

export default Favorite;