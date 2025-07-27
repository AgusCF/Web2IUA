import express from 'express';
import {
  addToFavorites,
  getFavorites,
  removeFavorite,
  removeFavoriteByUserAndProduct,
  checkFavorite,
  clearFavorites
} from '../controllers/favorites.controller.js';

const router = express.Router();

router.post('/add', addToFavorites); // Agregar producto a favoritos
router.get('/:userId', getFavorites); // Obtener favoritos del usuario
router.get('/check/:userId/:productId', checkFavorite); // Verificar si está en favoritos
router.delete('/remove/:id', removeFavorite); // Eliminar producto de favoritos por ID
router.delete('/user/:userId/product/:productId', removeFavoriteByUserAndProduct); // Eliminar por user_id y product_id
router.delete('/clear/:userId', clearFavorites); // Vaciar favoritos

export default router;