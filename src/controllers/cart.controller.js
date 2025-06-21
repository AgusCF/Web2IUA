import { pool } from '../databases/db.js';

// Agregar producto al carrito
export const addToCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    try {
        // Si ya existe, suma la cantidad
        const existing = await pool.query(
        'SELECT * FROM CartItems WHERE user_id = $1 AND product_id = $2',
        [user_id, product_id]
        );
        if (existing.rows.length > 0) {
        await pool.query(
            'UPDATE CartItems SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
            [quantity, user_id, product_id]
        );
        } else {
        await pool.query(
            'INSERT INTO CartItems (user_id, product_id, quantity) VALUES ($1, $2, $3)',
            [user_id, product_id, quantity]
        );
        }
        res.json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ message: 'Error al agregar al carrito' });
    }
};

// Obtener carrito del usuario
export const getCart = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: 'ID de usuario es requerido' });
    }
    try {
        const result = await pool.query(
        `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.img
        FROM CartItems c
        JOIN Products p ON c.product_id = p.id
        WHERE c.user_id = $1`,
        [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
};

// Actualizar cantidad de un producto en el carrito
export const updateCartItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        await pool.query(
        'UPDATE CartItems SET quantity = $1 WHERE id = $2',
        [quantity, id]
        );
        res.json({ message: 'Cantidad actualizada' });
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        res.status(500).json({ message: 'Error al actualizar cantidad' });
    }
};

// Eliminar producto del carrito
export const removeCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM CartItems WHERE id = $1', [id]);
        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar producto del carrito' });
    }
};

// Vaciar carrito
export const clearCart = async (req, res) => {
    const { userId } = req.params;
    try {
        await pool.query('DELETE FROM CartItems WHERE user_id = $1', [userId]);
        res.json({ message: 'Carrito vaciado' });
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        res.status(500).json({ message: 'Error al vaciar carrito' });
    }
};