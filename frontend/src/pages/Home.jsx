import React from 'react';
import { useState, useEffect } from 'react';
import "../styles/home.css"

const Home = () => {

  const [products, setProducts] = useState([]);

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('nome');

    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUserName('');
    window.location.reload();
  };
  
  const handleClick = () => {
    if (userName) {
      logout();
    } else {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  return (
    <>
    <div>
    <header id="header">
    <img
            src="../assets/icons/logo.jpg"
            alt="Logo"
            className="header-img"
          />
		<h1 className='home-title'>Beauty Face</h1>
		<div className="user-details">
      <a href="#" onClick={handleClick}>
        <div className="custom-link-content">
          <img
            src="../assets/icons/user.svg"
            alt="Minha conta"
            className="custom-link-icon"
          />
          <div className="custom-link-text">
          <h6>{userName || 'Minha conta'}</h6>
                  {userName ? (
                    <span onClick={logout}>Fazer logout</span>
                  ) : (
                    <span>Entre ou cadastre-se</span>
                  )}
          </div>
        </div>
      </a>
		</div>
		<nav id="nav-bar">
			<ul>
				<li><a className="nav-link" href="#home">Home</a></li>
				<li><a className="nav-link" href="#about">Sobre nós</a></li>
				<li><a className="nav-link" href="#contact">Contato</a></li>
			</ul>
		</nav>
	</header>
  </div>
	<main> 
    <section className="banner">
      
      <img src="./assets/images/blackf2.png" alt="Banner" />
    </section>

      <section id='home'>
      <div className="products-info">
          <h2>PROMOÇÃO</h2>
          <p>9 produtos</p>
        </div>
      <div className="product-container">
      {products.map(product => (
        <div className="product-card">
        <img src={`./assets/images/${product.imagem}`} alt="Product Name" className="product-image"/>
        <h3 className="product-name">{product.nome}</h3>
        {/* <span className="original-price">$99.99</span> */}
        <span className="product-price">R$ {product.preco}</span>
        <button className="add-to-cart-button">Adicionar ao carrinho</button>
      </div>
          ))}
 </div>
      </section>

	</main>
    </>
  );
}

export default Home;