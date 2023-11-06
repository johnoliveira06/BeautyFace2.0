import React from 'react';
import "../styles/home.css"

const Home = () => {
  return (
    <>
    <div>
    <header id="header">
    <img
            src="../assets/icons/logo.jpg"
            alt="Logo"
            id="header-img"
          />
		<h1 className='home-title'>Beauty Face</h1>
		<div class="user-details">
      <a href="/login">
        <div className="custom-link-content">
          <img
            src="../assets/icons/user.svg"
            alt="Minha conta"
            className="custom-link-icon"
          />
          <div className="custom-link-text">
            <h6>Minha conta</h6>
            <span>Entre ou cadastre-se</span>
          </div>
        </div>
      </a>
		</div>
		<nav id="nav-bar">
			<ul>
				<li><a class="nav-link" href="#home">Home</a></li>
				<li><a class="nav-link" href="#about">Sobre nós</a></li>
				<li><a class="nav-link" href="#contact">Contato</a></li>
			</ul>
		</nav>
	</header>
  </div>
	<main> 
    <section class="banner">
      
      <img src="./assets/images/blackf2.png" alt="Banner" />
    </section>

	</main>

  //Renderizar produtos aqui
    </>
  );
}

export default Home;