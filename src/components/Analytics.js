import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Analytics.css';

Chart.register(...registerables, ChartDataLabels);

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function Analytics() {
  const [userData, setUserData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [daysData, setDaysData] = useState({});

  const adminInstitution = 'INACAP'; // Ejemplo de institución del admin, esto lo podrías sacar del estado del admin
  const adminSede = 'Maipú'; // Ejemplo de sede del admin, igual que arriba

  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = await getDocs(collection(db, 'Users'));
      const users = usersCollection.docs.map(doc => doc.data());

      // Filtrar los usuarios por institución y sede del administrador
      const filteredUsers = users.filter(user => 
        user.institucion === adminInstitution && user.sede === adminSede
      );

      setUserData(filteredUsers);

      // Obtener los años disponibles de los usuarios filtrados
      const yearsSet = new Set(filteredUsers
        .map(user => user.fecha ? new Date(user.fecha.seconds * 1000).getFullYear() : null)
        .filter(year => year !== null)
      );
      setYears(Array.from(yearsSet).sort((a, b) => a - b));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userData && userData.length > 0) {
      const monthsSet = new Set(userData
        .filter(user => user.fecha && new Date(user.fecha.seconds * 1000).getFullYear() === selectedYear)
        .map(user => new Date(user.fecha.seconds * 1000).getMonth() + 1)
      );
      setMonths(Array.from(monthsSet).sort((a, b) => a - b));
      setSelectedMonth(null); // Reset month when year changes
    }
  }, [selectedYear, userData]);

  useEffect(() => {
    if (selectedMonth && userData && userData.length > 0) {
      const registrationsPerDay = {};
      userData.forEach(user => {
        if (user.fecha) {
          const registrationDate = new Date(user.fecha.seconds * 1000);
          const year = registrationDate.getFullYear();
          const month = registrationDate.getMonth() + 1;
          if (year === selectedYear && month === selectedMonth) {
            const day = registrationDate.getDate();
            registrationsPerDay[day] = (registrationsPerDay[day] || 0) + 1;
          }
        }
      });

      setDaysData({
        labels: Array.from({ length: new Date(selectedYear, selectedMonth, 0).getDate() }, (_, i) => i + 1),
        datasets: [{
          label: `Usuarios Registrados en ${monthNames[selectedMonth - 1]} ${selectedYear}`,
          data: Array.from({ length: new Date(selectedYear, selectedMonth, 0).getDate() }, (_, i) => registrationsPerDay[i + 1] || 0),
          fill: false,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgba(75, 192, 192, 0.2)',
        }],
      });
    }
  }, [selectedMonth, selectedYear, userData]);

  const registrationsPerMonth = {};
  const participationByCampus = {};
  const participationByCareer = {};

  if (userData && userData.length > 0) {
    userData.forEach(user => {
      if (user.fecha) {
        const registrationDate = new Date(user.fecha.seconds * 1000);
        const year = registrationDate.getFullYear();
        if (year === selectedYear) {
          const month = registrationDate.getMonth() + 1;
          registrationsPerMonth[month] = (registrationsPerMonth[month] || 0) + 1;
        }
      }

      participationByCampus[user.sede] = (participationByCampus[user.sede] || 0) + 1;
      participationByCareer[user.carrera] = (participationByCareer[user.carrera] || 0) + 1;
    });
  }

  const lineChartData = {
    labels: monthNames,
    datasets: [{
      label: `Usuarios Registrados en ${selectedYear}`,
      data: monthNames.map((_, i) => registrationsPerMonth[i + 1] || 0),
      fill: false,
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgba(75, 192, 192, 0.2)',
    }],
  };

  const lineChartOptions = {
    plugins: {
      datalabels: {
        display: (context) => context.dataset.data[context.dataIndex] > 0,
        align: 'end',
        anchor: 'end',
        color: 'black'
      }
    }
  };

  const barChartData = {
    labels: Object.keys(participationByCampus),
    datasets: [{
      label: 'Participación por Sede',
      data: Object.values(participationByCampus),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const barChartOptions = {
    plugins: {
      datalabels: {
        display: (context) => context.dataset.data[context.dataIndex] > 0,
        align: 'end',
        anchor: 'end',
        color: 'black'
      }
    }
  };

  const pieChartData = {
    labels: Object.keys(participationByCareer),
    datasets: [{
      label: 'Participación por Carrera',
      data: Object.values(participationByCareer),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const pieChartOptions = {
    plugins: {
      datalabels: {
        display: (context) => context.dataset.data[context.dataIndex] > 0,
        align: 'center',
        color: 'black'
      }
    }
  };

  return (
    <div className="analytics-container">
      <h2>Analytics</h2>
      <div className="filters">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="year-select"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          value={selectedMonth || ""}
          onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
          className="month-select"
          disabled={!selectedYear}
        >
          <option value="">Todos los meses</option>
          {months.map(month => (
            <option key={month} value={month}>{monthNames[month - 1]}</option>
          ))}
        </select>
      </div>
  
      {/* Contenedor para los gráficos */}
      <div className="charts-grid">
        <div className="chart-item">
          <h3>Usuarios Registrados</h3>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
        <div className="chart-item">
          <h3>Participación por Sede</h3>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        <div className="chart-item">
          <h3>Participación por Carrera</h3>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
  
}

export default Analytics;
