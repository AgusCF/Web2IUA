import { pool }  from '../databases/db.js'; // Asegúrate de que pool esté configurado para PostgreSQL

// Obtener todos los productos
export const allProducts = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Products`);
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

// Obtener un usuario por ID
export const getProductById = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Products WHERE id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener usuario" });
    }
};

// Actualizar un Producto por ID
export const updateProduct = async (req, res) => {
    const { name, img, description, cost, stock } = req.body;
  
    try {
      await pool.query(
        `UPDATE Products
         SET name = $1, img = $2, description = $3, cost = $4, stock = $5
         WHERE id = $6`,
        [ name, img, description, cost, stock, req.params.id ]
      );
      return res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al actualizar Producto" });
    }
  };
  
  // Eliminar un Producto por ID
  export const deleteProduct = async (req, res) => {
    try {
      await pool.query(`DELETE FROM Products WHERE id = $1`, [req.params.id]);
      return res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al eliminar Producto" });
    }
  };





/* 
router.get("/productos", (req, res) => {
    res.send("Bienvenido a la API de productos");
});
router.get("/productos/:id", (req, res) => {
    const { id } = req.params;
    res.send(`Bienvenido a la API de productos con id ${id}`);
}); */