import express from 'express';
import { 
    getAllUsers, 
    getUserByTel,
    getUserById, 
    createUser, 
    updateUser, 
    updatedPassword,
    getUserByMail
} from '../controllers/userTecno.Controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/by-tel', getUserByTel);
router.get('/by-mail', getUserByMail);
router.get('/:id', getUserById);
router.post('/newUser', createUser);
router.put('/newPass/:id', updatedPassword);
router.put('/:id', updateUser);

export default router;