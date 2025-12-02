import { pool } from '../databases/dbTecno.js';

// Agregar producto al carrito con validación de stock
export const addToCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    try {
        // Obtener stock actual del producto
        const productRes = await pool.query(
            'SELECT stock FROM Products WHERE id = $1',
            [product_id]
        );

        if (productRes.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const availableStock = productRes.rows[0].stock;

        // Buscar si ya existe en el carrito
        const existing = await pool.query(
            'SELECT * FROM CartItems WHERE user_id = $1 AND product_id = $2',
            [user_id, product_id]
        );

        let newQuantity = quantity;
        if (existing.rows.length > 0) {
            newQuantity += existing.rows[0].quantity;
        }

        // Validar stock
        if (newQuantity > availableStock) {
            return res.status(400).json({
                message: `No hay suficiente stock (disponible: ${availableStock})`
            });
        }

        // Insertar o actualizar
        if (existing.rows.length > 0) {
            await pool.query(
                'UPDATE CartItems SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
                [newQuantity, user_id, product_id]
            );
            return res.json({ message: 'Cantidad actualizada en el carrito' });
        } else {
            await pool.query(
                'INSERT INTO CartItems (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [user_id, product_id, quantity]
            );
            return res.json({ message: 'Producto agregado al carrito' });
        }

    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ message: 'Error interno al agregar al carrito' });
    }
};

// Obtener carrito del usuario
export const getCart = async (req, res) => {
    const { userId } = req.params;
    console.log('Obteniendo carrito para el usuario:', userId);
    // Validar que se haya pasado el userId
    if (!userId || userId === 'undefined') {
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
        console.log('Carrito obtenido:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
};

// Actualizar cantidad de un producto en el carrito con validación de stock
export const updateCartItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        // Obtener el producto relacionado con el ítem del carrito
        const itemRes = await pool.query(
            `SELECT ci.product_id, ci.quantity AS current_quantity, p.stock
             FROM CartItems ci
             JOIN Products p ON ci.product_id = p.id
             WHERE ci.id = $1`,
            [id]
        );

        if (itemRes.rows.length === 0) {
            return res.status(404).json({ message: 'Ítem no encontrado en el carrito' });
        }

        const { product_id, stock: availableStock } = itemRes.rows[0];

        // Validar que la nueva cantidad no exceda el stock
        if (quantity > availableStock) {
            return res.status(400).json({
                message: `No hay suficiente stock (disponible: ${availableStock})`
            });
        }

        // Actualizar cantidad
        await pool.query(
            'UPDATE CartItems SET quantity = $1 WHERE id = $2',
            [quantity, id]
        );

        res.json({ message: 'Cantidad actualizada' });

    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        res.status(500).json({ message: 'Error interno al actualizar cantidad' });
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