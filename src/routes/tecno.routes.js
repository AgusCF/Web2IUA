import express from "express";
import { autenticarUsuario, createUser } from "../controllers/userTecno.Controller.js";
import routerUser from "./userTecno.routes.js";
import routerProducts from "./productsTecno.routes.js";
import routerFavorites from "./fav.routes.js";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Rutas públicas
router.post("/login", autenticarUsuario);
router.post("/register", createUser);
router.get("/", (req, res) => {
    res.send("API Tecno is running...");
});

// Rutas protegidas
router.use("/users", routerUser);
router.use("/products", routerProducts);
router.use("/fav", routerFavorites);

export default router;