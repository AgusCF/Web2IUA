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
router.get('/:user_id', getFavorites); // ✅ Cambiado :userId → :user_id
router.get('/check/:user_id/:product_id', checkFavorite); // ✅ Cambiado parámetros
router.delete('/remove/:id', removeFavorite); // Eliminar producto de favoritos por ID
router.delete('/user/:user_id/product/:product_id', removeFavoriteByUserAndProduct); // ✅ Cambiado parámetros
router.delete('/clear/:user_id', clearFavorites); // ✅ Cambiado :userId → :user_id

export default router;