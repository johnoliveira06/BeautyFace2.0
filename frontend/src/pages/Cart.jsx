import React from 'react';
import { useState, useEffect } from 'react';
import "../styles/cart.css"

const Cart = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/cartProducts')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  return (
    <>
<main id="cart" style={{ maxWidth: '960px' }} className='cart-container'>
  <div className="back"><a href="#">Voltar</a></div>
  <h1>Meu carrinho</h1>
    <div className="all-information">
      <div className='cart-items'>
      {products.map(product => (
        <div className='cart-item'>
        <div className='item-img'>
          <img className="w-100" src={`./assets/images/${product.imagem}`} alt="Product image"/>
        </div>
        <div className='item-details'>
          <h6>{product.nome}</h6>
        </div>
        <div className='item-quantity'>
          <p className="cartItemQuantity">1</p>
        </div>
        <div className='item-price'>
          <p id="cartItem1Price">{product.preco}</p>
        </div>
      </div>
          ))}
      </div>
      <div className='cart-summary'>
        <div className='cart-summary-item'>
          <div >
            <h6>Subtotal</h6>
          </div>
          <div >
            <p id="subtotal">R$40.00</p>
          </div>
        </div>
        <div className='cart-summary-item taxes'>
          <div >
            <h6>Taxa de frete</h6>
          </div>
          <div >
            <p id="tax">R$30.00</p>
          </div>
        </div>
        <hr/>
        <div className='cart-summary-item total'>
          <div >
            <h5>Total</h5>
          </div>
          <div>
            <p id="total">R$70.00</p>
          </div>
        </div>
        <a href="#"><button className="btn-buy-now">Comprar</button></a>
      </div>
  </div>
</main>
    </>
  );
};

export default Cart;
