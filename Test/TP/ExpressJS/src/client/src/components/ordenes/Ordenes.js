import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get('/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Mis Órdenes</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <h2>Orden #{order.id}</h2>
            <p>Total: ${order.total}</p>
            <p>Fecha: {new Date(order.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;