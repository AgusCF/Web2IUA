import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', getAllProducts); // Obtener todos los productos
router.get('/:id', getProductById); // Obtener producto por ID
router.post('/newProduct', createProduct); // Crear producto
router.put('/:id', updateProduct); // Editar producto
router.delete('/:id', deleteProduct); // Eliminar producto

export default router;