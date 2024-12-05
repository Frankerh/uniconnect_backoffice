import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'; // Importar sendEmailVerification
import { doc, setDoc, collection } from 'firebase/firestore'; // Importa Firestore
import './Login.css';
import logo from '../assets/win.png';
import { db } from '../firebase';  // Asegúrate de importar db desde la configuración de Firebase
import { useNavigate } from 'react-router-dom'; // Para la redirección con React Router

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Usamos useNavigate para redirigir al login

  // Validar dominio del correo
  const validateEmailDomain = (email) => {
    const allowedDomains = ['@inacapmail.cl', '@inacap.cl'];
    return allowedDomains.some(domain => email.endsWith(domain));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!validateEmailDomain(email)) {
      alert("Solo los correos con dominios institucionales pueden registrarse.");
      return;
    }

    try {
      setLoading(true);
      // Crea el usuario con Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Enviar correo de verificación
      await sendEmailVerification(userCredential.user);

      // Guarda el correo en la colección 'admins' en Firestore (no guardar la contraseña)
      await setDoc(doc(collection(db, 'admins'), userCredential.user.uid), {
        email: email,
      });

      alert('Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.');

      // Redirigir al login después de un registro exitoso
      navigate('/login'); // Redirige a la página de login utilizando React Router
    } catch (error) {
      console.error('Error al registrarse', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-image">
          <img src={logo} alt="Uniconnect" className="img-fluid" />
        </div>
        <div className="login-form">
          <h1 className="login-title">Uniconnect</h1>
          <h2 className="login-subtitle">Crea una nueva cuenta</h2>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Cargando...' : 'REGISTRARSE'}
            </button>
          </form>

          <div className="login-links">
            <p>
              ¿Ya tienes una cuenta? <a href="/login" className="login-link">Inicia sesión aquí</a>
            </p>
            <p>
              Términos de uso. Política de privacidad.
            </p>
          </div>
        </div>
      </div>
      <footer className="login-footer">
        COPYRIGHT © 2024. TODOS LOS DERECHOS RESERVADOS.
      </footer>
    </div>
  );
}

export default Register;
