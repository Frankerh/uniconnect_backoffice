import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import SuspendModal from './SuspendModal';
import BanModal from './BanModal';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("name");
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Carga inicial de usuarios
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, 'Users'));
      const usersList = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  // Filtrar usuarios de forma eficiente usando useMemo
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users; // Si no hay búsqueda, devolver todos los usuarios

    return users.filter(user => {
      const fieldValue = user[filterField]?.toString().toLowerCase();
      return fieldValue?.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, filterField, users]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleFilterChange = (e) => setFilterField(e.target.value);

  const handleSuspendClick = (user) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const handleBanClick = (user) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const handleSuspend = async (userId, suspensionEndDate) => {
    const userRef = doc(db, 'Users', userId);
    await updateDoc(userRef, {
      status: 'Suspendido',
      suspensionEnd: suspensionEndDate,
    });
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: 'Suspendido', suspensionEnd: suspensionEndDate }
          : user
      )
    );
    setShowSuspendModal(false);
  };

  const handleBan = async (userId) => {
    const userRef = doc(db, 'Users', userId);
    await updateDoc(userRef, {
      status: 'Baneado',
    });
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: 'Baneado' }
          : user
      )
    );
    setShowBanModal(false);
  };

  const handleRemoveStatus = async (userId) => {
    const userRef = doc(db, 'Users', userId);
    await updateDoc(userRef, {
      status: 'Activo',
      suspensionEnd: null,
    });
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: 'Activo', suspensionEnd: null }
          : user
      )
    );
  };

  return (
    <div className="container">
      <h2 className="title">Gestión de Usuarios</h2>
      <div className="search-container">
        <input 
          type="text" 
          placeholder={`🔍 Buscar por ${filterField}`} 
          value={searchTerm} 
          onChange={handleSearchChange} 
          className="search-bar" 
        />
        <select 
          value={filterField} 
          onChange={handleFilterChange} 
          className="filter-select"
        >
          <option value="name">Nombre</option>
          <option value="email">Email</option>
          <option value="carrera">Carrera</option>
          <option value="sede">Sede</option>
          <option value="status">Estatus</option>
        </select>
      </div>
      <div className="user-list">
        {filteredUsers.map(user => (
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
          onClose={() => setShowSuspendModal(false)} 
          onSuspend={handleSuspend} 
        />
      }

      {showBanModal && 
        <BanModal 
          user={selectedUser} 
          onClose={() => setShowBanModal(false)} 
          onBan={handleBan} 
        />
      }
    </div>
  );
}

export default UserManagement;






