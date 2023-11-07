import React from 'react';
import { useState, useEffect } from 'react';
import "../styles/login.css"

const Login = () => {

  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };


  return (
    <>
    <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form>
        <h1>{isSignUp ? 'Cadastrar' : 'Login'}</h1>
          <div className="social-icons">
            <span>Cadastrar com:</span>
            <a href="#" className="icons">
              <img
            src="../assets/icons/google.svg"
            alt="Google"
            className="google-icon"
          />
          </a>
          </div>
          <span>ou use seu email</span>
          <input type="text" placeholder="Nome"/>
          <input type="email" placeholder="Email"/>
          <input type="password" placeholder="Senha"/>
          <button>Criar conta</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form>
        <h1>{isSignUp ? 'Cadastrar' : 'Login'}</h1>
          <div className="social-icons">
          <span>Fazer login com:</span>
          <a href="#" className="icons">
          <img
            src="../assets/icons/google.svg"
            alt="Google"
            className="google-icon"
          />
            </a>
          </div>
          <span>ou use seu email</span>
          <input type="email" placeholder="Email"/>
          <input type="password" placeholder="Senha"/>
          <a href="#" className='forgot-password'>Esqueceu sua senha?</a>
          <button>Entrar</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Boas vindas de volta!</h1>
            <button onClick={toggleForm} className="hidden" id="login">Login</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Não tem uma conta?</h1>
            <button onClick={toggleForm} className="hidden" id="register">Cadastrar</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;