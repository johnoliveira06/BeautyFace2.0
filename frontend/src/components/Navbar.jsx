import React from 'react';
import "../styles/navbar.css"


const Navbar = () => {
  return (
  <header id="header2">
    <a href='/'>
  <div className="header-content">
    <img
      src="../assets/icons/logo.jpg"
      alt="Logo"
      id="header-img"
    />
    <h1 className='nav-title'>Beauty Face</h1>
  </div>
  </a>
</header>
);
}

export default Navbar;