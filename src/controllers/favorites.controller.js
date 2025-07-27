import { pool } from '../databases/dbTecno.js';

// Agregar producto a favoritos
export const addToFavorites = async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
        // Verificar si ya existe en favoritos
        const existing = await pool.query(
        'SELECT * FROM Favorites WHERE user_id = $1 AND product_id = $2',
        [user_id, product_id]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'El producto ya está en favoritos' });
        } else {
            await pool.query(
                'INSERT INTO Favorites (user_id, product_id) VALUES ($1, $2)',
                [user_id, product_id]
            );
        }
        res.json({ message: 'Producto agregado a favoritos' });
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        res.status(500).json({ message: 'Error al agregar a favoritos' });
    }
};

// Obtener favoritos del usuario
export const getFavorites = async (req, res) => {
    const { userId } = req.params;
    console.log('Obteniendo favoritos para el usuario:', userId);
    // Validar que se haya pasado el userId
    if (!userId || userId === 'undefined') {
        return res.status(400).json({ message: 'ID de usuario es requerido' });
    }
    try {
        const result = await pool.query(
            `SELECT f.id, f.product_id, p.name, p.price, p.imageUrl, p.description, p.category
            FROM Favorites f
            JOIN Products p ON f.product_id = p.id
            WHERE f.user_id = $1`,
            [userId]
        );
        console.log('Favoritos obtenidos:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los favoritos:', error);
        res.status(500).json({ message: 'Error al obtener los favoritos' });
    }
};

// Eliminar producto de favoritos
export const removeFavorite = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM Favorites WHERE id = $1', [id]);
        res.json({ message: 'Producto eliminado de favoritos' });
    } catch (error) {
        console.error('Error al eliminar producto de favoritos:', error);
        res.status(500).json({ message: 'Error al eliminar producto de favoritos' });
    }
};

// Eliminar producto de favoritos por user_id y product_id
export const removeFavoriteByUserAndProduct = async (req, res) => {
    const { userId, productId } = req.params;
    try {
        const result = await pool.query('DELETE FROM Favorites WHERE user_id = $1 AND product_id = $2 RETURNING *', [userId, productId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Favorito no encontrado' });
        }
        res.json({ message: 'Producto eliminado de favoritos' });
    } catch (error) {
        console.error('Error al eliminar producto de favoritos:', error);
        res.status(500).json({ message: 'Error al eliminar producto de favoritos' });
    }
};

// Verificar si un producto está en favoritos
export const checkFavorite = async (req, res) => {
    const { userId, productId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM Favorites WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        res.json({ isFavorite: result.rows.length > 0 });
    } catch (error) {
        console.error('Error al verificar favorito:', error);
        res.status(500).json({ message: 'Error al verificar favorito' });
    }
};

// Vaciar favoritos
export const clearFavorites = async (req, res) => {
    const { userId } = req.params;
    try {
        await pool.query('DELETE FROM Favorites WHERE user_id = $1', [userId]);
        res.json({ message: 'Favoritos vaciados' });
    } catch (error) {
        console.error('Error al vaciar favoritos:', error);
        res.status(500).json({ message: 'Error al vaciar favoritos' });
    }
};