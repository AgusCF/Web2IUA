import express from "express";
import { autenticarUsuario } from "../controllers/user.Controller.js";
import routerUser from "./user.routes.js";
import routerProducts from "./products.routes.js";
import routerOrders from "./orders.routes.js";
import routerCart from "./cart.routes.js";
import auth  from "../middleware/auth.js";
import { verificarToken } from '../middlewares/auth.js';

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Aplica el middleware a todas las rutas de órdenes
router.use(verificarToken);

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
router.get('/users?order=asc')
router.get('/products?order=asc')
router.get('/orders?order=asc')
router.use("/users", routerUser);
//? =======================================================
//? TIENDA ================================================
router.use("/products", routerProducts); // Rutas de productos
router.use("/orders", routerOrders); // Rutas de órdenes
router.use("/cart", routerCart); // Rutas de carrito
//? =======================================================

export default router;