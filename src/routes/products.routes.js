import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Aplica el middleware a todas las rutas de órdenes
router.use(verificarToken);

router.get('/', getAllProducts); // Obtener todos los productos
router.get('/:id', getProductById); // Obtener producto por ID
router.post('/newProduct', createProduct); // Crear producto
router.put('/:id', updateProduct); // Editar producto
router.delete('/:id', deleteProduct); // Eliminar producto

export default router;