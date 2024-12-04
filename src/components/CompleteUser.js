import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Asegúrate de tener configurado Firebase correctamente
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './CompleteUser.css';

function CompleteUser() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [sede, setSede] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [userUid, setUserUid] = useState(''); // Estado para almacenar el UID
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const email = user.email;
      const uid = user.uid; // Obtener el UID del usuario
      setUserEmail(email);
      setUserUid(uid); // Guardar el UID en el estado

      // Determinar la institución según el correo
      const isInacap = email.includes('@inacapmail.cl') || email.includes('@inacap');
      setInstitutionName(isInacap ? 'INACAP' : 'Otra institución');

      // Obtener los datos del perfil desde Firestore si existen
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'admins', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNombre(userData.nombre || '');
          setApellido(userData.apellido || '');
          setSede(userData.sede || '');
        }
      };

      fetchUserData();
    } else {
      console.error('Usuario no autenticado');
      navigate('/login'); // Redirigir si no está autenticado
    }
  }, [navigate]);

  // Lista de sedes de INACAP
  const sedesInacap = [
    'Arica', 'Iquique', 'Calama', 'Antofagasta', 'Copiapó', 'La Serena',
    'Valparaíso', 'Apoquindo', 'Maipú', 'Renca', 'Ñuñoa', 'Santiago Centro',
    'Santiago Sur', 'La Granja', 'Puente Alto', 'Rancagua', 'Curicó',
    'Talca', 'Chillán', 'Concepción-Talcahuano', 'San Pedro de la Paz',
    'Los Angeles', 'Temuco', 'Valdivia', 'Osorno', 'Puerto Montt',
    'Coyhaique', 'Punta Arenas',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        console.error('Usuario no autenticado');
        alert('Por favor, inicia sesión nuevamente.');
        navigate('/login');
        return;
      }

      // Referencia al documento en Firestore
      const userDocRef = doc(db, 'admins', user.uid);

      // Verifica si ya existe el documento en Firestore
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        // Actualizar datos si el usuario ya tiene perfil
        await setDoc(userDocRef, {
          nombre,
          apellido,
          email: user.email,
          institution: institutionName,
          sede: institutionName === 'INACAP' ? sede : '',
          role: 'admin',
          uid: user.uid, // Asegurarse de que el UID esté actualizado
        }, { merge: true }); // Usar merge para no sobrescribir todo el documento

        alert('Perfil actualizado correctamente');
        navigate('/analytics'); // Redirigir al dashboard
        return;
      }

      // Si no existe el documento, lo crea
      await setDoc(userDocRef, {
        nombre,
        apellido,
        email: user.email,
        institution: institutionName,
        sede: institutionName === 'INACAP' ? sede : '',
        role: 'admin',
        uid: user.uid,
      });

      alert('Perfil completado correctamente');
      navigate('/analytics'); // Redirigir al dashboard

    } catch (error) {
      console.error('Error al completar el perfil:', error);
      alert('Hubo un error al completar el perfil. Verifica la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complete-user-container">
      <h1>Completa tu perfil</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo electrónico</label>
          <input type="text" value={userEmail} disabled />
        </div>
        <div>
          <label>UID del usuario</label>
          <input type="text" value={userUid} disabled />
        </div>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Institución</label>
          <input type="text" value={institutionName} disabled />
        </div>
        {institutionName === 'INACAP' && (
          <div>
            <label>Sede</label>
            <select
              value={sede}
              onChange={(e) => setSede(e.target.value)}
              required
            >
              <option value="">Selecciona tu sede</option>
              {sedesInacap.map((sede, index) => (
                <option key={index} value={sede}>
                  {sede}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Completar Perfil'}
        </button>
      </form>
    </div>
  );
}

export default CompleteUser;
