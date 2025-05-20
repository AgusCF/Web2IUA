import { pool } from '../databases/db.js';

// Obtener productos disponibles
export const getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Products WHERE stock > 0');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Crear una nueva orden
export const createOrder = async (req, res) => {
  const { products } = req.body; // [{ productId, quantity }]
  const userId = req.user.id;

  try {
    // Calcular el total y registrar la orden
    let total = 0;
    const orderDetails = [];
    for (const { productId, quantity } of products) {
      const product = await pool.query('SELECT * FROM Products WHERE id = $1', [productId]);
      if (!product.rows.length || product.rows[0].stock < quantity) {
        return res.status(400).json({ message: 'Producto no disponible o stock insuficiente' });
      }
      const subtotal = product.rows[0].price * quantity;
      total += subtotal;
      orderDetails.push({ productId, quantity, subtotal });
    }

    const orderResult = await pool.query(
      'INSERT INTO Orders (user_id, total) VALUES ($1, $2) RETURNING id',
      [userId, total]
    );
    const orderId = orderResult.rows[0].id;

    for (const detail of orderDetails) {
      await pool.query(
        'INSERT INTO OrderDetails (order_id, product_id, quantity, subtotal) VALUES ($1, $2, $3, $4)',
        [orderId, detail.productId, detail.quantity, detail.subtotal]
      );
      await pool.query('UPDATE Products SET stock = stock - $1 WHERE id = $2', [detail.quantity, detail.productId]);
    }

    res.json({ message: 'Orden creada exitosamente', orderId });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: 'Error al crear orden' });
  }
};

// Obtener órdenes del usuario autenticado
export const getOrdersByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await pool.query('SELECT * FROM Orders WHERE user_id = $1', [userId]);
    res.json(orders.rows);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error al obtener órdenes' });
  }
};