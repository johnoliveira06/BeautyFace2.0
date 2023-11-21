import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios"
import "../styles/cart.css"

const Cart = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/cartProducts')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  const calculateSubtotal = () => {
    return products.reduce((total, product) => total + (parseFloat(product.preco) * (product.quantidade || 0)), 0).toFixed(2);
  };

  const calculateTotal = () => {
  const subtotal = products.reduce((total, product) => total + (parseFloat(product.preco) * (product.quantidade || 0)), 0);
  const shippingCost = 30.00; // Custo fixo de frete
  return (subtotal + shippingCost).toFixed(2);
};

const increaseQuantity = (index) => {
  const updatedProducts = [...products];
  updatedProducts[index].quantidade += 1;
  setProducts(updatedProducts);
};

const decreaseQuantity = (index) => {
  const updatedProducts = [...products];
  if (updatedProducts[index].quantidade > 1) {
    updatedProducts[index].quantidade -= 1;
    setProducts(updatedProducts);
  }
};

const removeProduct = async (index) => {
  const produtoId = products[index].id; 
  console.log(produtoId)  

  try {

    const response = await axios.delete(`http://localhost:8000/removeProduct/${produtoId}`);

    if (response.status === 200) {
      const updatedProducts = [...products];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
      alert("Produto removido com sucesso!")
    } else {
      console.error('Erro ao remover produto do banco de dados');
    }
  } catch (error) {
    console.error('Erro na solicitação de remoção do produto:', error);
  }
};

  return (
    <>
<main id="cart" style={{ maxWidth: '960px' }} className='cart-container'>
  <div className="back"><a href="/">Voltar</a></div>
  <h1>Meu carrinho</h1>
    <div className="all-information">
      <div className='cart-items'>
      {products.map((product, index) => (
        <div className='cart-item' key={index}>
        <div className='item-img'>
          <img className="w-100" src={`./assets/images/${product.imagem}`} alt="Product image"/>
        </div>
        <div className='item-details'>
          <h6>{product.nome}</h6>
        </div>
        <div className='item-quantity'>
        <a href="#" onClick={() => decreaseQuantity(index)}>-</a>
        <input name="resultado" id="resultado" value={product.quantidade || 0} readOnly />
        <a href="#" onClick={() => increaseQuantity(index)}>+</a>
        </div>
        <div className='item-price'>
          <p id="cartItem1Price">{product.preco}</p>
        </div>
        <div className='item-remove'>
          <button onClick={() => removeProduct(index)}>Remover</button>
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
            <p id="subtotal">R$ {calculateSubtotal()}</p>
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
            <p id="total">R$ {calculateTotal()}</p>
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
