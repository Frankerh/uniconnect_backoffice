import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase'; // Asegúrate de tener configurado tu Firebase en este archivo

function Reportes() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos de Firestore
  const fetchReports = async () => {
    try {
      const reportsCollection = collection(db, "reportes");
      const snapshot = await getDocs(reportsCollection);
      const fetchedReports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(fetchedReports);
    } catch (error) {
      console.error("Error al obtener los reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h1>Página de Reportes</h1>
      <p>Esta es la página donde se gestionan los reportes.</p>

      {loading ? (
        <p>Cargando reportes...</p>
      ) : reports.length === 0 ? (
        <p>No hay reportes disponibles.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Post ID</th>
              <th>Razón</th>
              <th>Reportado Por</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={report.id}>
                <td>{index + 1}</td>
                <td>{report.postId || "N/A"}</td>
                <td>{report.reason || "Sin razón"}</td>
                <td>{report.reportedBy || "Anónimo"}</td>
                <td>
                  {report.timestamp
                    ? new Date(report.timestamp.seconds * 1000).toLocaleString()
                    : "Sin fecha"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#4CAF50",
    color: "white",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
};

export default Reportes;
