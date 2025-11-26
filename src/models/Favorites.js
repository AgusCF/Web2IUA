import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER, // Cambiado de STRING a INTEGER
    primaryKey: true,
    autoIncrement: true
  },
  user_id: { // Cambiado de userId a user_id para coincidir con la BD
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: { // Cambiado de productId a product_id
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'favorites', // Especificar nombre de tabla
  timestamps: false // Si no tienes created_at/updated_at
});

export default Favorite;