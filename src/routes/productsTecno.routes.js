import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productsTecno.controller.js';
import { verificarAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllProducts); // Obtener todos los productos
router.get('/category/:category', getProductsByCategory); // Obtener productos por categoría
router.get('/:id', getProductById); // Obtener producto por ID
router.post('/newProduct', verificarAdmin, createProduct); // Crear producto
router.put('/:id', verificarAdmin, updateProduct); // Editar producto
router.delete('/:id', verificarAdmin, deleteProduct); // Eliminar producto

export default router;