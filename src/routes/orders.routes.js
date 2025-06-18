import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser
} from '../controllers/orders.controller.js';
import { verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas de órdenes
router.get('/', verificarAdmin, getAllOrders); // Solo admin
router.get('/client=:tel', getOrdersByUser); // Usuario autenticado
router.post('/newOrder', createOrder); // Usuario autenticado
router.get('/:id', getOrderById); // Usuario autenticado
router.put('/:id', verificarAdmin, updateOrder); // Solo admin
router.delete('/:id', verificarAdmin, deleteOrder); // Solo admin

export default router;