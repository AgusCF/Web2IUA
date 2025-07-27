import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './Users.js';
import Product from './Products.js';

const CartItem = sequelize.define('CartItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

CartItem.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

export default CartItem;