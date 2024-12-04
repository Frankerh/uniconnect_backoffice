import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc, FieldValue } from "firebase/firestore";
import SuspendModal from './SuspendModal';  // Importar el modal para la suspensión
import BanModal from './BanModal';  // Importar el modal para el baneo
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, 'Users'));
      const usersList = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleSuspendClick = (user) => {
    setSelectedUser(user);
    setShowSuspendModal(true); // Mostrar el modal de suspensión
  };

  const handleBanClick = (user) => {
    setSelectedUser(user);
    setShowBanModal(true); // Mostrar el modal de baneo
  };

  const handleSuspend = async (userId, suspensionEndDate) => {
    const userRef = doc(db, 'Users', userId);
    await updateDoc(userRef, {
      status: 'Suspendido',
      suspensionEnd: suspensionEndDate, // Guardar la fecha de finalización
    });
    
    // Actualizamos el estado localmente
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: 'Suspendido', suspensionEnd: suspensionEndDate } 
          : user
      )
    );
    
    setShowSuspendModal(false); // Cerrar modal después de suspender
  };

  const handleBan = async (userId) => {
    const userRef = doc(db, 'Users', userId);
    await updateDoc(userRef, {
      status: 'Baneado',
    });
    
    // Actualizamos el estado localmente
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: 'Baneado' } 
          : user
      )
    );
    
    setShowBanModal(false); // Cerrar modal después de banear
  };

  const handleRemoveStatus = async (userId) => {
    const userRef = doc(db, 'Users', userId);
    await updateDoc(userRef, {
      status: 'Activo', // Cambiar el estado a "Activo"
      suspensionEnd: null, // Establecer el valor de suspensionEnd en null (eliminarlo)
    });
  
    // Actualizamos el estado localmente
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: 'Activo', suspensionEnd: null }
          : user
      )
    );
  };
  

  const handleCloseModal = () => {
    setShowSuspendModal(false);
    setShowBanModal(false);
  };

  return (
    <div className="container">
      <h2>Gestión de Usuarios</h2>
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <img src={user.profileImageUrl} alt="Profile" className="profile-picture" />
            <div className="user-info">
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Carrera:</strong> {user.carrera}</p>
              <p><strong>Sede:</strong> {user.sede}</p>
              <p><strong>Estatus:</strong> {user.status || 'Activo'}</p>

              <div className="actions">
                {user.status === 'Suspendido' ? (
                  <button className="action-button" onClick={() => handleRemoveStatus(user.id)}>
                    Quitar Suspensión
                  </button>
                ) : user.status === 'Baneado' ? (
                  <button className="action-button" onClick={() => handleRemoveStatus(user.id)}>
                    Quitar Baneo
                  </button>
                ) : (
                  <>
                    <button className="action-button" onClick={() => handleSuspendClick(user)}>
                      Suspender
                    </button>
                    <button className="action-button" onClick={() => handleBanClick(user)}>
                      Banear
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSuspendModal && 
        <SuspendModal 
          user={selectedUser} 
          onClose={handleCloseModal} 
          onSuspend={handleSuspend} 
        />
      }

      {showBanModal && 
        <BanModal 
          user={selectedUser} 
          onClose={handleCloseModal} 
          onBan={handleBan} 
        />
      }
    </div>
  );
}

export default UserManagement;
