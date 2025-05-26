import orders from '../models/ordersDb.js'; // Simulando una base de datos de órdenes

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
};