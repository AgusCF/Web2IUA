import express from "express";
import { autenticarUsuario } from "../controllers/userController.js";
import routerUser from "./user.routes.js";
import routerProducts from "./products.routes.js";
import routerOrders from "./orders.routes.js";
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
router.use("/users", routerUser);
//? =======================================================
//? TIENDA ================================================
router.use("/products", routerProducts); // Rutas de productos
router.use("/orders", routerOrders); // Rutas de órdenes
//? =======================================================

export default router;