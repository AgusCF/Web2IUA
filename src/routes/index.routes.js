import express from "express";
import { autenticarUsuario } from "../controllers/user.Controller.js";
import routerUser from "./user.routes.js";
import routerProducts from "./products.routes.js";
import routerOrders from "./orders.routes.js";
import routerCart from "./cart.routes.js";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Rutas públicas
router.post("/login", autenticarUsuario);
router.get("/", (req, res) => {
    res.send("API is running...");
});

// Rutas protegidas
router.use("/users", routerUser);
router.use("/products", routerProducts);
router.use("/orders", routerOrders);
router.use("/cart", routerCart);

export default router;