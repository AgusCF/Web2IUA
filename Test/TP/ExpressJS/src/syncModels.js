import sequelize from './config/sequelize.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';

const syncModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('Error al sincronizar los modelos:', error);
  } finally {
    await sequelize.close();
  }
};

syncModels();