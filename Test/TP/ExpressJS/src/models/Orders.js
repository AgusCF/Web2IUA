import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './Users.js';

const Order = sequelize.define('Order', {
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Order.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

export default Order;