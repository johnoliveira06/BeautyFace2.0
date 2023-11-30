import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios"
import { jwtDecode } from "jwt-decode";
import "../styles/home.css"

const Home = () => {

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [userName, setUserName] = useState('');

  const [userNameGoogle, setUserNameGoogle] = useState('');

  const [auth, setAuth] = useState(false);

  const [message, setMessage] = useState(false)

  useEffect(()=>{
    axios.get('http://localhost:8000/')
    .then(res => {
        if(res.data.Status === "Sucesso") {
            setAuth(true)
            setUserName(res.data.name)
        }else{
            setAuth(false)
            setMessage(res.data.Error)
        }
            
    })
    .then(err =>console.log(err));
  }, [])

  useEffect(() => {
    const storedName = localStorage.getItem('nome');
  
    if (storedName) {
      setUserNameGoogle(storedName);
    }
  
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
  
    if (token) {

      const decodedToken = jwtDecode(token.split('=')[1]);
      setUserName(decodedToken.name);
    }
  }, []);

  const logout = () => {
    axios.get("http://localhost:8000/logout")
      .then(res => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
        
        localStorage.removeItem('nome');
        location.reload(true);
      })
      .catch(err => console.log(err));
  };

  const googleLogout = () => {
    localStorage.clear();
    window.location.reload();
    setUserNameGoogle('');
  }
  
  const handleClick = () => {
    if (userName) {
      logout();
    }
    else if(userNameGoogle){
      googleLogout();
    } 
    else {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  const addToCart = async (productId) => {
    try {
      let userId = null;
  
      if (auth || userName || userNameGoogle) {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (token) {
          const decodedToken = jwtDecode(token.split('=')[1]);
          console.log('oii', decodedToken)
          userId = decodedToken.id;
        }
      }

      if (!userId) {
        window.location.href = '/login';
        return;
      }
  

      const response = await axios.post('http://localhost:8000/insertProduct', {
        userId,
        produtoId: productId,
        quantidade: 1
      });
  
      if (response.status === 200) {
        console.log(response.data.Success);
        setCart((prevCart) => [...prevCart, productId]);
        alert("Produto inserido ao carrinho!");
      } else {
        console.error(response.data.Error);
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

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
      <div className="nav-links">
      <a href='/orders'>
      <img
            src="../assets/icons/order.svg"
            alt="Pedidos"
            className="custom-link-icon"
          />
      </a>
      <a href='/cart'>
      <img
            src="../assets/icons/cart2.svg"
            alt="Carrinho"
            className="custom-link-icon"
          />
      </a>
      <a href="#" onClick={handleClick}>
        <div className="custom-link-content">
          <img
            src="../assets/icons/user.svg"
            alt="Minha conta"
            className="custom-link-icon"
          />
          <div className="custom-link-text">
          <h6>{userNameGoogle || userName || 'Minha conta'}</h6>
                  {userName || userNameGoogle ? (
                    <span>Fazer logout</span>
                  ) : (
                    <span>Entre ou cadastre-se</span>
                  )}
          </div>
        </div>
      </a>
      </div>
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
        <button onClick={() => addToCart(product.id)} className="add-to-cart-button">Adicionar ao carrinho</button>
      </div>
          ))}
 </div>
      </section>

	</main>
    </>
  );
}

export default Home;