import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/win.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Autenticación con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;  // Obtén el objeto completo del usuario
  
      // Verificar si el email del usuario está en la colección "admins"
      const userDocRef = doc(db, 'admins', user.uid); // Usar user.uid directamente
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const { email: userEmail, nombre, apellido, sede, institution, role } = userData;
  
        // Verificar si el correo es de INACAP
        const institutionName = userEmail.includes('@inacapmail.cl') || userEmail.includes('@inacap') ? 'INACAP' : 'Otra institución';
  
        // Verificar si falta información del perfil (excepto UID)
        if (!nombre || !apellido || !sede || !institution || !role) {
          navigate('/complete'); // Redirigir a completar perfil si faltan datos
        } else {
          navigate('/analytics'); // Redirigir a Analytics si los datos están completos
        }
      } else {
        navigate('/complete'); // Redirigir si no existe el documento
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Correo o contraseña incorrectos.');
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
          <h2 className="login-subtitle">Inicia sesión en tu cuenta</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Cargando...' : 'INICIAR SESIÓN'}
            </button>
          </form>
          <div className="login-links">
            <a href="#!" className="login-link">¿Olvidaste tu contraseña?</a>
            <p>
              ¿No tienes una cuenta? <a href="/register" className="login-link">Regístrate aquí</a>
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

export default Login;
