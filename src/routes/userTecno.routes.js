import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    getUserByTel,
    getUserByMail
} from '../controllers/userTecno.Controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/by-tel', getUserByTel);
router.get('/by-mail', getUserByMail);
router.get('/:id', getUserById);
router.post('/newUser', createUser);
router.post('/newPass', updatedPassword);
router.put('/:id', updateUser);

export default router;