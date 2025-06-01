import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/add', addToCart); // Agregar producto al carrito
router.get('/:userId', getCart); // Obtener carrito del usuario
router.put('/update/:id', updateCartItem); // Actualizar cantidad
router.delete('/remove/:id', removeCartItem); // Eliminar producto del carrito
router.delete('/clear/:userId', clearCart); // Vaciar carrito

export default router;