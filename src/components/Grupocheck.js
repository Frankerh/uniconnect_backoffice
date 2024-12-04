import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Importa tu configuración de Firebase
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Grupocheck.css'; // Importa tu archivo de estilos

const Grupocheck = () => {
  const [groups, setGroups] = useState([]);

  // Obtener los grupos desde Firestore
  const fetchGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'groups'));
      const groupsData = [];
      querySnapshot.forEach((doc) => {
        groupsData.push({ id: doc.id, ...doc.data() });
      });
      setGroups(groupsData);
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
    }
  };

  // Cambiar el estado de un grupo (Aprobado / Rechazado)
  const handleApprove = async (groupId, status) => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        status: status,
      });
      fetchGroups(); // Actualizar la lista de grupos después de la acción
    } catch (error) {
      console.error("Error al actualizar el estado del grupo:", error);
    }
  };

  // Cargar los grupos al montar el componente
  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="grupocheck-container">
      <h1>Gestión de Grupos</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre del Grupo</th>
            <th>Descripción</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td>{group.name}</td>
              <td>{group.description}</td>
              <td>{group.motivo}</td>
              <td>{group.status}</td>
              <td>
                {group.status === 'Pendiente' ? (
                  <>
                    <button onClick={() => handleApprove(group.id, 'Aprobado')}>Aprobar</button>
                    <button onClick={() => handleApprove(group.id, 'Rechazado')}>Rechazar</button>
                  </>
                ) : (
                  <button disabled>Estado Finalizado</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grupocheck;
