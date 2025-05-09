const express = require("express");
const { allProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/products.controller.js");
const auth  = require("../middlewares/auth.js"); // Importa el middleware auth
const router = express.Router();


//? PRODUCTOS =============================================
router.get("/productos", (req, res) => {
    allProducts(req, res);
});

router.route("/productos/:id")
  .get(auth(['admin', 'resident']), getProductById)
  .put(auth(['admin']), updateProduct)
  .delete(auth(['admin']), deleteProduct);
//? =========================================================
//? USUARIOS =============================================

//? =========================================================

//? PRUEBAS API ============================================
router.get("/", (req, res) => {
    res.send("Bienvenido a la API em / de ExpressJS");
});

router.get("/api", (req, res) => {
    res.send("Bienvenido a la API en /api de ExpressJS");
});
router.get("/api/hello", (req, res) => {
    res.send("Hola desde la API de ExpressJS");
});
router.get("/api/hello/:name", (req, res) => {
    const { name } = req.params;
    res.send(`Hola ${name} desde la API de ExpressJS`);
}); 
//? =========================================================
module.exports = router;