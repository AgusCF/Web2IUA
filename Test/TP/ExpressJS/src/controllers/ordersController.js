import Order from '../models/Orders.js';
import OrderItem from '../models/OrderItems.js';
import Product from '../models/Products.js';

export const createOrder = async (req, res) => {
  const { userId, items } = req.body; // items: [{ productId, quantity }]
  try {
    const order = await Order.create({ user_id: userId });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: 'Producto no disponible o stock insuficiente' });
      }

      await OrderItem.create({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    res.json({ message: 'Orden creada exitosamente', orderId: order.id });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: 'Error al crear orden' });
  }
};

export const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [{ model: OrderItem, include: [Product] }],
    });
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error al obtener órdenes' });
  }
};