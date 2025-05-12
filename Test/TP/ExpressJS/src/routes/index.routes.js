const express = require("express");
const { allProducts, getProductById, updateProduct, deleteProduct, createProduct } = require("../controllers/products.controller.js");
//const { allUsers, getUserById, updateUser, deleteUser } = require("../controllers/users.controller.js");
const { allOrders, getOrderById, updateOrder, deleteOrder } = require("../controllers/orders.controller.js");
const auth  = require("../middlewares/auth.js"); // Importa el middleware auth
const router = express.Router();

//? PRODUCTOS =============================================
router.get("/productos", (req, res) => {
    allProducts(req, res);
});

router.route("/productos/:id")
  .get(auth(['admin', 'client']), getProductById)
  .put(auth(['admin']), updateProduct)
  .delete(auth(['admin']), deleteProduct);


router.post("/productos/newProduct", (req, res) => {
    createProduct(req, res);
});
//? =========================================================
//? USUARIOS =============================================

//? =========================================================
//? PEDIDOS =============================================
router.get("/pedidos", (req, res) => {
    allOrders(req, res);
});
router.route("/pedidos/:id")
  .get(auth(['admin', 'client']), getOrderById)
  .put(auth(['admin']), updateOrder)
  .delete(auth(['admin']), deleteOrder);
//? =========================================================
//? AUTENTICACION ==========================================
router.post("/login", (req, res) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
        return res.status(400).json({ message: "Faltan datos" });
    }
    // Aquí iría la lógica de autenticación
    res.json({ message: "Login exitoso" });
});
router.post("/register", (req, res) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
        return res.status(400).json({ message: "Faltan datos" });
    }
    // Aquí iría la lógica de registro
    res.json({ message: "Registro exitoso" });
});
router.post("/logout", (req, res) => {
    // Aquí iría la lógica de cierre de sesión
    res.json({ message: "Logout exitoso" });
});
router.post("/refresh-token", (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: "Falta el token" });
    }
    // Aquí iría la lógica de refresco de token
    res.json({ message: "Token refrescado exitosamente" });
});
router.post("/forgot-password", (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ message: "Falta el email" });
    }
    // Aquí iría la lógica de recuperación de contraseña
    res.json({ message: "Email de recuperación enviado" });
});
router.post("/reset-password", (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: "Faltan datos" });
    }
    // Aquí iría la lógica de restablecimiento de contraseña
    res.json({ message: "Contraseña restablecida exitosamente" });
});
router.post("/change-password", (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Faltan datos" });
    }
    // Aquí iría la lógica de cambio de contraseña
    res.json({ message: "Contraseña cambiada exitosamente" });
});
router.post("/verify-email", (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Falta el email" });
    }
    // Aquí iría la lógica de verificación de email
    res.json({ message: "Email verificado exitosamente" });
});
router.post("/resend-verification", (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Falta el email" });
    }
    // Aquí iría la lógica de reenvío de verificación
    res.json({ message: "Email de verificación reenviado" });
});
router.post("/verify-token", (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: "Falta el token" });
    }
    // Aquí iría la lógica de verificación de token
    res.json({ message: "Token verificado exitosamente" });
});
//? PRUEBAS API ============================================
router.get("/", (req, res) => {
    res.send("Bienvenido a la API en /api de ExpressJS");
});
router.get("/hello", (req, res) => {
    res.send("Hola desde la API de ExpressJS");
});
router.get("/hello/:name", (req, res) => {
    const { name } = req.params;
    res.send(`Hola ${name} desde la API de ExpressJS`);
}); 
//? =========================================================
module.exports = router;