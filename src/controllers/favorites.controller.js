import { pool } from '../databases/dbTecno.js';

// Agregar producto a favoritos
export const addToFavorites = async (req, res) => {
    const { user_id, product_id } = req.body;
    
    // ✅ Validaciones completas
    if (!user_id || !product_id) {
        return res.status(400).json({ message: 'user_id y product_id son requeridos' });
    }
    
    if (isNaN(user_id) || isNaN(product_id)) {
        return res.status(400).json({ message: 'user_id y product_id deben ser números válidos' });
    }
    
    try {
        // ✅ Verificar que el usuario existe
        const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        // ✅ Verificar que el producto existe
        const productExists = await pool.query('SELECT id FROM products WHERE id = $1', [product_id]);
        if (productExists.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        // Verificar si ya existe en favoritos
        const existing = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
            [user_id, product_id]
        );
        
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'El producto ya está en favoritos' });
        }
        
        await pool.query(
            'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)',
            [user_id, product_id]
        );
        
        res.json({ message: 'Producto agregado a favoritos' });
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        res.status(500).json({ message: 'Error al agregar a favoritos' });
    }
};

// Obtener favoritos del usuario
export const getFavorites = async (req, res) => {
    const { user_id } = req.params;
    console.log('Obteniendo favoritos para el usuario:', user_id);
    
    // ✅ Validación mejorada
    if (!user_id || user_id === 'undefined') {
        return res.status(400).json({ message: 'ID de usuario es requerido' });
    }
    
    if (isNaN(user_id)) {
        return res.status(400).json({ message: 'user_id debe ser un número válido' });
    }
    
    try {
        const result = await pool.query(
            `SELECT f.id, f.product_id, p.name, p.price, p.imageUrl, p.description, p.category
            FROM favorites f
            JOIN products p ON f.product_id = p.id
            WHERE f.user_id = $1`,
            [user_id]
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
    
    // ✅ Agregar validación
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID de favorito es requerido y debe ser número válido' });
    }
    
    try {
        const result = await pool.query('DELETE FROM favorites WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Favorito no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado de favoritos' });
    } catch (error) {
        console.error('Error al eliminar producto de favoritos:', error);
        res.status(500).json({ message: 'Error al eliminar producto de favoritos' });
    }
};

// Eliminar producto de favoritos por user_id y product_id
export const removeFavoriteByUserAndProduct = async (req, res) => {
    const { user_id, product_id } = req.params;
    
    // ✅ Agregar validación
    if (!user_id || !product_id || isNaN(user_id) || isNaN(product_id)) {
        return res.status(400).json({ 
            message: 'user_id y product_id son requeridos y deben ser números válidos' 
        });
    }
    
    try {
        const result = await pool.query(
            'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *', 
            [user_id, product_id]
        );
        
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
    const { user_id, product_id } = req.params;
    
    // ✅ Agregar validación
    if (!user_id || !product_id || isNaN(user_id) || isNaN(product_id)) {
        return res.status(400).json({ 
            message: 'user_id y product_id son requeridos y deben ser números válidos' 
        });
    }
    
    try {
        const result = await pool.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
            [user_id, product_id]
        );
        
        res.json({ isFavorite: result.rows.length > 0 });
    } catch (error) {
        console.error('Error al verificar favorito:', error);
        res.status(500).json({ message: 'Error al verificar favorito' });
    }
};

// Vaciar favoritos
export const clearFavorites = async (req, res) => {
    const { user_id } = req.params;
    
    // ✅ Agregar validación
    if (!user_id || isNaN(user_id)) {
        return res.status(400).json({ message: 'user_id es requerido y debe ser número válido' });
    }
    
    try {
        const result = await pool.query('DELETE FROM favorites WHERE user_id = $1 RETURNING *', [user_id]);
        
        res.json({ 
            message: 'Favoritos vaciados',
            deletedCount: result.rows.length 
        });
    } catch (error) {
        console.error('Error al vaciar favoritos:', error);
        res.status(500).json({ message: 'Error al vaciar favoritos' });
    }
};