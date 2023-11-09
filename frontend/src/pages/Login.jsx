import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {auth, provider} from "../components/config"
import {signInWithPopup} from "firebase/auth"
import "../styles/login.css"

const Login = () => {
  
  const navigate = useNavigate()
  
  const [isSignUp, setIsSignUp] = useState(false);

  const [values, setValues] = useState({
    nome:'',
    email:'',
    senha:''
})

const [valuesLogin, setValuesLogin] = useState({
  email:'',
  senha:''
})

const [valuesGoogle, setValuesGoogle] = useState('')

const handleSignUp = (e) =>{
    e.preventDefault();
    axios.post('http://localhost:8000/register', values)
    .then(res => {
        if(res.data.Status === "Sucesso") {
            alert("Cadastro realizado com sucesso!")
            location.reload()
        }else{
            alert(res.data.Error);
        }
            
        })
    .then(err =>console.log(err));
}

const handleSignIn = (e) =>{
  e.preventDefault();
  axios.post('http://localhost:8000/login', valuesLogin)
  .then(res => {
      if(res.data.Status === "Sucesso") {
          alert("Login realizado com sucesso!")
          navigate('/')
      }else{
          alert(res.data.Error);
      }
          
      })
  .then(err =>console.log(err));
}

const handleGoogleLogin =  () =>{
  signInWithPopup(auth, provider).then((data)=>{
    setValuesGoogle({
      email: data.user.email,
      nome: data.user.displayName
    })
    localStorage.setItem("email", data.user.email)
    localStorage.setItem("nome", data.user.displayName);
    navigate("/")
  })
}

const toggleForm = () => {
  setIsSignUp(!isSignUp);
};

  return (
    <>
    <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSignUp}>
        <h1>{isSignUp ? 'Cadastrar' : 'Login'}</h1>
          <div className="social-icons">
            <span>Cadastrar com:</span>
            <a href="#" className="icons" onClick={handleGoogleLogin}>
              <img
            src="../assets/icons/google.svg"
            alt="Google"
            className="google-icon"
          />
          </a>
          </div>
          <span>ou use seu email</span>
          <input type="text" name='nome' placeholder="Nome" onChange={ e => setValues({...values, nome: e.target.value})}/>
          <input type="email" name='email' placeholder="Email" onChange={ e => setValues({...values, email: e.target.value})}/>
          <input type="password" name='senha' placeholder="Senha" onChange={ e => setValues({...values, senha: e.target.value})}/>
          <button type='submit'>Criar conta</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form onSubmit={handleSignIn}>
        <h1>{isSignUp ? 'Cadastrar' : 'Login'}</h1>
          <div className="social-icons">
          <span>Fazer login com:</span>
          <a href="#" className="icons" onClick={handleGoogleLogin}>
          <img
            src="../assets/icons/google.svg"
            alt="Google"
            className="google-icon"
          />
            </a>
          </div>
          <span>ou use seu email</span>
          <input type="email" name='email' placeholder="Email" onChange={ e => setValuesLogin({...valuesLogin, email: e.target.value})}/>
          <input type="password" name='senha' placeholder="Senha" onChange={ e => setValuesLogin({...valuesLogin, senha: e.target.value})}/>
          <a href="#" className='forgot-password'>Esqueceu sua senha?</a>
          <button type='submit'>Entrar</button>
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