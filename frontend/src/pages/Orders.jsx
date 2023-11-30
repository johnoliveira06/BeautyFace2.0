import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/orders', { withCredentials: true });
        const groupedOrders = groupBy(response.data, 'orderId');
        const ordersArray = Object.values(groupedOrders);

        setOrders(ordersArray);
      } catch (error) {
        console.error('Erro ao obter os pedidos:', error);
      }
    };

    fetchOrders();
  }, []);

  const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = item[key];

      if (!result[groupKey]) {
        result[groupKey] = [];
      }

      result[groupKey].push(item);

      return result;
    }, {});
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  return (
    <div className="orders-container">
      <h1>Meus pedidos</h1>
      {orders.map((orderGroup, index) => (
        <div key={index} className="order-group">
          <p className="order-info">Nº do pedido: {orderGroup[0].orderId}</p>
          <p className="order-info">Data: {formatDate(orderGroup[0].data)}</p>
          <ul>
            {orderGroup.map((order, orderIndex) => (
              <li key={orderIndex} className="order-item">
                <p>Quantidade: {order.quantidade}</p>
                <p>Nome do produto: {order.nomeProduto}</p> 
                <p>Valor unitário: {order.valorUnitario}</p>
                {orderIndex !== orderGroup.length - 1 && <hr />} {/* Adiciona hr se não for o último item */}
              </li>
            ))}
          </ul>
          <p className="order-total">Total: {orderGroup.reduce((total, order) => total + (order.valorUnitario * order.quantidade), 0)}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
