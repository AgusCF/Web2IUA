import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import Order from './Orders.js';
import Product from './Products.js';

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

OrderItem.belongsTo(Order, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

export default OrderItem;