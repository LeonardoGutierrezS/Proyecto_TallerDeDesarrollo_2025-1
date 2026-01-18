import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const GraficosReportes = ({ datosGraficos }) => {
  if (!datosGraficos) {
    return <p>Cargando gráficos...</p>;
  }

  // Configuración de gráfico de solicitudes por estado
  const solicitudesPorEstadoData = {
    labels: ['Pendientes', 'Listo para Entregar', 'Entregados', 'Devueltos', 'Rechazados'],
    datasets: [
      {
        label: 'Solicitudes',
        data: [
          datosGraficos.solicitudesPorEstado.pendientes,
          datosGraficos.solicitudesPorEstado.listoParaEntregar,
          datosGraficos.solicitudesPorEstado.entregados,
          datosGraficos.solicitudesPorEstado.devueltos,
          datosGraficos.solicitudesPorEstado.rechazados
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Configuración de gráfico de solicitudes por tipo
  const solicitudesPorTipoData = {
    labels: ['Diarias', 'Largo Plazo'],
    datasets: [
      {
        label: 'Solicitudes',
        data: [
          datosGraficos.solicitudesPorTipo.diarias,
          datosGraficos.solicitudesPorTipo.largoPlazo
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Configuración de gráfico de equipos por categoría
  const categoriasLabels = Object.keys(datosGraficos.equiposPorCategoria || {});
  const categoriasValues = Object.values(datosGraficos.equiposPorCategoria || {});

  const equiposPorCategoriaData = {
    labels: categoriasLabels,
    datasets: [
      {
        label: 'Equipos',
        data: categoriasValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2
      }
    ]
  };

  // Configuración de gráfico de usuarios por tipo
  const usuariosPorTipoData = {
    labels: ['Alumnos', 'Profesores', 'Administradores'],
    datasets: [
      {
        label: 'Usuarios',
        data: [
          datosGraficos.usuariosPorTipo.alumnos,
          datosGraficos.usuariosPorTipo.profesores,
          datosGraficos.usuariosPorTipo.administradores
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Configuración de gráfico de solicitudes por mes
  const solicitudesPorMesData = {
    labels: (datosGraficos.solicitudesPorMes || []).map(item => {
      const fecha = new Date(item.mes);
      return fecha.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Solicitudes',
        data: (datosGraficos.solicitudesPorMes || []).map(item => parseInt(item.cantidad)),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="graficos-container">
      <div className="grafico-card">
        <h4>Solicitudes por Estado</h4>
        <div className="chart-wrapper">
          <Pie data={solicitudesPorEstadoData} options={chartOptions} />
        </div>
      </div>

      <div className="grafico-card">
        <h4>Solicitudes por Tipo</h4>
        <div className="chart-wrapper">
          <Pie data={solicitudesPorTipoData} options={chartOptions} />
        </div>
      </div>

      <div className="grafico-card">
        <h4>Equipos por Categoría</h4>
        <div className="chart-wrapper">
          <Bar data={equiposPorCategoriaData} options={chartOptions} />
        </div>
      </div>

      <div className="grafico-card">
        <h4>Usuarios por Tipo</h4>
        <div className="chart-wrapper">
          <Pie data={usuariosPorTipoData} options={chartOptions} />
        </div>
      </div>

      <div className="grafico-card grafico-wide">
        <h4>Solicitudes por Mes (Últimos 6 Meses)</h4>
        <div className="chart-wrapper">
          <Line data={solicitudesPorMesData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default GraficosReportes;
