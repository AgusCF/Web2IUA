import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js';
import { verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProducts); // Obtener todos los productos
router.get('/:id', getProductById); // Obtener producto por ID
router.post('/newProduct', verificarAdmin, createProduct); // Crear producto
router.put('/:id', verificarAdmin, updateProduct); // Editar producto
router.delete('/:id', verificarAdmin, deleteProduct); // Eliminar producto

export default router;