import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser
} from '../controllers/orders.controller.js';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

// Aplica el middleware a todas las rutas de órdenes
router.use(verificarToken);

router.get('/', getAllOrders); // Obtener todas las órdenes
router.get('/client=:tel', getOrdersByUser); // Obtener orden por Tel (debe ir antes que /:id sino genera errores)
router.post('/newOrder', createOrder); // Crear orden (debe ir antes que /:id sino genera errores)
router.get('/:id', getOrderById); // Obtener orden por ID
router.put('/:id', updateOrder); // Editar orden
router.delete('/:id', deleteOrder); // Eliminar orden

export default router;