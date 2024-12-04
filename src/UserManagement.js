import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, 'Users'));
      const usersList = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Gestión de Usuarios</h2>
      <p style={styles.counter}>Total de Usuarios: {users.length}</p>
      <div style={styles.userList}>
        {users.map(user => (
          <div key={user.id} style={styles.userCard}>
            <img src={user.profileImageUrl} alt="Profile" style={styles.profilePicture} />
            <div style={styles.userInfo}>
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Descripción:</strong> {user.descripcion}</p>
              <p><strong>Carrera:</strong> {user.carrera}</p>
              <p><strong>Sede:</strong> {user.sede}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
  },
  counter: {
    fontSize: '1.5rem',
    margin: '1rem 0',
  },
  userList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  userCard: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '1rem',
    margin: '1rem',
    width: '300px',
    textAlign: 'center',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    transition: '0.3s',
  },
  profilePicture: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userInfo: {
    textAlign: 'left',
    marginTop: '1rem',
  },
};

export default UserManagement;
