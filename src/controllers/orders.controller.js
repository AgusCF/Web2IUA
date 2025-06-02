import { pool } from '../databases/db.js';

// Obtener todas las órdenes
export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Orders ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error al obtener órdenes' });
  }
};

// Obtener orden por ID
export const getOrderById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Orders WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).send('Orden no encontrada');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ message: 'Error al obtener orden' });
  }
};
// Obtener órdenes por usuario (usando teléfono)
export const getOrdersByUser = async (req, res) => {
  const userTel = req.params.tel;
  try {
    // 1. Buscar el usuario por teléfono
    const userResult = await pool.query('SELECT id FROM Users WHERE tel = $1', [userTel]);
    if (userResult.rows.length === 0) return res.json([]);
    const userId = userResult.rows[0].id;
    // 2. Buscar las órdenes por user_id
    const result = await pool.query('SELECT * FROM Orders WHERE user_id = $1 ORDER BY order_date DESC', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener órdenes por usuario:', error);
    res.status(500).json({ message: 'Error al obtener órdenes por usuario' });
  }
}

// Crear orden
export const createOrder = async (req, res) => {
  const { user_id, items, total, state = 'pendiente' } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // 1. Insertar la orden principal
    const result = await client.query(
      `INSERT INTO Orders (user_id, total, state, order_date)
       VALUES ($1, $2, $3, NOW()) RETURNING id`,
      [user_id, total, state]
    );
    const orderId = result.rows[0].id;

    // 2. Insertar los detalles de la orden
    for (const item of items) {
      await client.query(
        `INSERT INTO OrderItems (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Pedido registrado', orderId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: 'Error al crear orden' });
  } finally {
    client.release();
  }
};

// Editar orden
export const updateOrder = async (req, res) => {
  const { user_id, total, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE Orders SET user_id = COALESCE($1, user_id), total = COALESCE($2, total), status = COALESCE($3, status)
       WHERE id = $4 RETURNING *`,
      [user_id, total, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).send('Orden no encontrada');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ message: 'Error al actualizar orden' });
  }
};

// Eliminar orden
export const deleteOrder = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM Orders WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).send('Orden no encontrada');
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ message: 'Error al eliminar orden' });
  }
};

/* import orders from '../models/ordersDb.js'; // Simulando una base de datos de órdenes

// Obtener todas las órdenes
export const getAllOrders = (req, res) => {
  res.json(orders);
};

// Obtener orden por ID
export const getOrderById = (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).send('Orden no encontrada');
  res.json(order);
};

// Crear orden
export const createOrder = (req, res) => {
  const { userId, products, total, status } = req.body;
  const newOrder = {
    id: orders.length + 1,
    userId,
    products,
    total,
    status: status || 'pendiente',
    createdAt: new Date()
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
};

// Editar orden
export const updateOrder = (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).send('Orden no encontrada');

  const { userId, products, total, status } = req.body;
  order.userId = userId ?? order.userId;
  order.products = products ?? order.products;
  order.total = total ?? order.total;
  order.status = status ?? order.status;

  res.json(order);
};

// Eliminar orden
export const deleteOrder = (req, res) => {
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Orden no encontrada');
  orders.splice(index, 1);
  res.json({ message: 'Orden eliminada' });
}; */