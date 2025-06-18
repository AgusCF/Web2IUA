import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, getUserByTel } from '../controllers/user.Controller.js';
import { verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// Aplica el middleware a todas las rutas de órdenes
router.use( verificarAdmin );

router.get('/', getAllUsers);
router.get('/by-tel', getUserByTel);
router.get('/:id', getUserById);
router.post('/newUser', createUser);
router.put('/:id', updateUser);

export default router;