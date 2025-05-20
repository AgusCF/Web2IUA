import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  img: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  stock: {
    type: DataTypes.INTEGER,
  },
  offert: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
});

export default Product;