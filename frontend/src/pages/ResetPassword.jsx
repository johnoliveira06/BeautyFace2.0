import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios"
import '../styles/resetPassword.css';


const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    senha: '',
    novaSenha: ''
  })

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (values.senha !== values.novaSenha) {
      alert('As senhas não coincidem');
      return;
    }
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const token = searchParams.get('token');

    axios.post(`http://localhost:8000/resetPassword/${id}/${token}`, values)
    .then(res => {
        if(res.data.Status === "Sucesso") {
            alert("Senha alterada com sucesso!")
            navigate('/login');
        }else{
            alert(res.data.Error);
        }
        })
    .then(err =>console.log(err));
      }

  return (
    <>
      <div className="formMenu">
        <div className="form">
          <form className="resetForm" onSubmit={handleResetPassword}>
            <p>Redefinir senha</p>
            <input
              type="password"
              placeholder="Digite sua senha"
              name='senha'
              onChange={ e => setValues({...values, senha: e.target.value})}
            />
            <input
              type="password"
              placeholder="Confirme sua senha"
              name='novaSenha'
              onChange={ e => setValues({...values, novaSenha: e.target.value})}
            />
            <button type="submit">Redefinir minha senha</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
