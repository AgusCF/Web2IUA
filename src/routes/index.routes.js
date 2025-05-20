import express from "express";
import { 
  newUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  autenticarUsuario,
  updatedPassword
} from "../controllers/userController.js";
import { getProducts } from '../controllers/productController.js';
import { createOrder, getOrdersByUser } from '../controllers/ordersController.js';
import auth  from "../middleware/auth.js";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//? USUARIOS =============================================
router.post("/login", autenticarUsuario);
router.get("/", (req, res) => {
    res.send("API is running...");
});

// Nuevas rutas GET para acceder desde el navegador
router.get("/login", auth, (req, res) => {
  // Llama a la función controladora y maneja la respuesta
  autenticarUsuario(req, res);
});

router.route("/users")
  .post(auth(['admin']), newUser)
  .get(auth(['admin', 'client']), getAllUsers);

router.route("/users/:id")
  .get(auth(['admin', 'client']), getUserById)
  .put(auth(['admin', 'client']), updateUser) // Actualizar usuario
  .delete(auth(['admin']), deleteUser); // Eliminar usuario

router.put("/users/:id/password", auth(['admin', 'client']), updatedPassword); // Cambiar contraseña
//? =======================================================


//? TIENDA ================================================
router.get('/products', getProducts); // Obtener productos disponibles
router.post('/orders', auth(['admin', 'client']), createOrder); // Crear una nueva orden
router.get('/orders/:userId', auth(['admin', 'client']), getOrdersByUser); // Obtener órdenes del usuario autenticado
//? =======================================================

export default router;