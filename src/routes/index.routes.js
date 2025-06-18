import express from "express";
import { autenticarUsuario } from "../controllers/user.Controller.js";
import routerUser from "./user.routes.js";
import routerProducts from "./products.routes.js";
import routerOrders from "./orders.routes.js";
import routerCart from "./cart.routes.js";
import { verificarToken } from '../middleware/auth.js';

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Rutas públicas
router.post("/login", autenticarUsuario);
router.get("/", (req, res) => {
    res.send("API is running...");
});

// Rutas protegidas
router.use("/users", verificarToken, routerUser);
router.use("/products", verificarToken, routerProducts);
router.use("/orders", verificarToken, routerOrders);
router.use("/cart", verificarToken, routerCart);

export default router;