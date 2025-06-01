import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser
} from '../controllers/orders.controller.js';

const router = express.Router();

router.get('/', getAllOrders); // Obtener todas las órdenes
router.get('/:id', getOrderById); // Obtener orden por ID
router.get('/client=:tel', getOrdersByUser); // Obtener orden por ID
router.post('/newOrder', createOrder); // Crear orden
router.put('/:id', updateOrder); // Editar orden
router.delete('/:id', deleteOrder); // Eliminar orden

export default router;