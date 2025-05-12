/**
router.get("/pedidos", (req, res) => {
    allOrders(req, res);
});
router.route("/pedidos/:id")
  .get(auth(['admin', 'clientt']), getOrderById)
  .put(auth(['admin']), updateOrder)
  .delete(auth(['admin']), deleteOrder);
 */
import { pool } from '../databases/db.js'; // Asegúrate de que pool esté configurado para PostgreSQL

// Obtener todos los pedidos
export const allOrders = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Orders`);
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener pedidos" });
    }
};
// Obtener un pedido por ID
export const getOrderById = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Orders WHERE id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener pedido" });
    }
};
// Actualizar un pedido por ID
export const updateOrder = async (req, res) => {
    const { status, total } = req.body;

    try {
        await pool.query(
            `UPDATE Orders
            SET status = $1, total = $2
            WHERE id = $3`,
            [status, total, req.params.id]
        );
        return res.json({ message: "Pedido actualizado correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar pedido" });
    }
};
// Eliminar un pedido por ID
export const deleteOrder = async (req, res) => {
    try {
        await pool.query(`DELETE FROM Orders WHERE id = $1`, [req.params.id]);
        return res.json({ message: "Pedido eliminado correctamente" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar pedido" });
    }
}
// Crear un nuevo pedido
export const createOrder = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO Orders (userId, productId, quantity)
            VALUES ($1, $2, $3) RETURNING *`,
            [userId, productId, quantity]
        );
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear pedido" });
    }
};
// Obtener todos los pedidos de un usuario
export const getOrdersByUserId = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Orders WHERE userId = $1`, [req.params.userId]);
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener pedidos del usuario" });
    }
};
// Obtener todos los pedidos de un producto
export const getOrdersByProductId = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Orders WHERE productId = $1`, [req.params.productId]);
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener pedidos del producto" });
    }
};