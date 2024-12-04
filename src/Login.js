import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import './Login.css'; // Asegúrate de crear este archivo CSS

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirigir al dashboard después de iniciar sesión
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-image">
          <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" alt="Inacap" className="img-fluid" />
        </div>
        <div className="login-form">
          <h1 className="login-title">INACAP +</h1>
          <h2 className="login-subtitle">Sign into your account</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">LOGIN</button>
          </form>
          <div className="login-links">
            <a href="#!" className="login-link">Forgot password?</a>
            <p>
              Don't have an account? <a href="#!" className="login-link">Register here</a>
            </p>
            <p>
              Terms of use. Privacy policy
            </p>
          </div>
        </div>
      </div>
      <footer className="login-footer">
        COPYRIGHT © 2024. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}

export default Login;
