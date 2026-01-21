import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faBoxOpen,
  faLaptop,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "@styles/DashboardStats.css";

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
  Legend,
);

const GraficosReportes = ({ datosGraficos, mesesHistorial, setMesesHistorial }) => {
  if (!datosGraficos) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando gráficos...</p>
      </div>
    );
  }

  // Cálculos para KPIs
  // Excluir administradores de la cuenta de usuarios registrados para reportes
  const totalSolicitudes = Object.values(datosGraficos.solicitudesPorEstado || {}).reduce((a, b) => a + b, 0);
  const totalEquipos = Object.values(datosGraficos.equiposPorCategoria || {}).reduce((a, b) => a + b, 0);
  const totalUsuarios = (datosGraficos.usuariosPorTipo?.alumnos || 0) + (datosGraficos.usuariosPorTipo?.profesores || 0);
  const prestamosActivos = datosGraficos.solicitudesPorEstado?.entregados || 0;

  // Paleta de colores premium
  const colors = [
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 99, 132, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(201, 203, 207, 0.8)",
    "rgba(101, 143, 241, 0.8)",
    "rgba(241, 101, 160, 0.8)",
    "rgba(101, 241, 143, 0.8)"
  ];

  // Configuración de solicitudes por estado (Pie) - Ahora con números en labels
  const solicitudesPorEstadoData = {
    labels: [
      `Pendientes (${datosGraficos.solicitudesPorEstado.pendientes})`,
      `Listo para Entregar (${datosGraficos.solicitudesPorEstado.listoParaEntregar})`,
      `Listo para recepcionar (${datosGraficos.solicitudesPorEstado.entregados})`,
      `Devueltos (${datosGraficos.solicitudesPorEstado.devueltos})`,
      `Rechazados (${datosGraficos.solicitudesPorEstado.rechazados})`,
    ],
    datasets: [
      {
        data: [
          datosGraficos.solicitudesPorEstado.pendientes,
          datosGraficos.solicitudesPorEstado.listoParaEntregar,
          datosGraficos.solicitudesPorEstado.entregados,
          datosGraficos.solicitudesPorEstado.devueltos,
          datosGraficos.solicitudesPorEstado.rechazados,
        ],
        backgroundColor: colors.slice(0, 5),
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de Tipos de Préstamo (Pie)
  const solicitudesPorTipoData = {
    labels: [
      `Diarias (${datosGraficos.solicitudesPorTipo.diarias})`, 
      `Largo Plazo (${datosGraficos.solicitudesPorTipo.largoPlazo})`
    ],
    datasets: [
      {
        data: [
          datosGraficos.solicitudesPorTipo.diarias,
          datosGraficos.solicitudesPorTipo.largoPlazo,
        ],
        backgroundColor: [colors[0], colors[5]],
        borderWidth: 1,
      },
    ],
  };

  // Inventario por Categoría (Pie - Solicitado por el usuario)
  const categoriasLabels = Object.keys(datosGraficos.equiposPorCategoria || {});
  const categoriasValues = Object.values(datosGraficos.equiposPorCategoria || {});
  const equiposPorCategoriaData = {
    labels: categoriasLabels.map((l, i) => `${l} (${categoriasValues[i]})`),
    datasets: [
      {
        data: categoriasValues,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  // Solicitudes por Carrera (Bar - Nuevo)
  const carreraLabels = Object.keys(datosGraficos.solicitudesPorCarrera || {});
  const carreraValues = Object.values(datosGraficos.solicitudesPorCarrera || {});
  const solicitudesPorCarreraData = {
    labels: carreraLabels,
    datasets: [
      {
        label: "Solicitudes por Carrera",
        data: carreraValues,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  // Distribución de Usuarios (Pie) - Excluyendo Administradores
  const usuariosPorTipoData = {
    labels: [
      `Alumnos (${datosGraficos.usuariosPorTipo.alumnos || 0})`, 
      `Profesores (${datosGraficos.usuariosPorTipo.profesores || 0})`
    ],
    datasets: [
      {
        data: [
          datosGraficos.usuariosPorTipo.alumnos || 0,
          datosGraficos.usuariosPorTipo.profesores || 0
        ],
        backgroundColor: [colors[0], colors[2]],
        borderWidth: 1,
      },
    ],
  };

  // Tendencia de Solicitudes (Line)
  const solicitudesPorMesData = {
    labels: (datosGraficos.solicitudesPorMes || []).map((item) => {
      const fecha = new Date(item.mes);
      return fecha.toLocaleDateString("es-CL", { month: "short", year: "numeric" });
    }),
    datasets: [
      {
        label: "Solicitudes Mensuales",
        data: (datosGraficos.solicitudesPorMes || []).map((item) => parseInt(item.cantidad)),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 1)",
        tension: 0.4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(59, 130, 246, 1)",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { family: "'Inter', sans-serif", size: 11 },
        },
      },
    },
    layout: { padding: 5 },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Barras horizontales para que se lean mejor las carreras
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, grid: { color: "#f1f5f9" } },
      y: { grid: { display: false } },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", align: "end" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="graficos-container">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper" style={{ backgroundColor: "#eff6ff", color: "#3b82f6" }}>
            <FontAwesomeIcon icon={faClipboardList} />
          </div>
          <div className="kpi-content">
            <h4>Total Solicitudes</h4>
            <p className="kpi-value">{totalSolicitudes}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper" style={{ backgroundColor: "#f0fdf4", color: "#10b981" }}>
            <FontAwesomeIcon icon={faBoxOpen} />
          </div>
          <div className="kpi-content">
            <h4>Préstamos Activos</h4>
            <p className="kpi-value">{prestamosActivos}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper" style={{ backgroundColor: "#fff7ed", color: "#f97316" }}>
            <FontAwesomeIcon icon={faLaptop} />
          </div>
          <div className="kpi-content">
            <h4>Total Equipos</h4>
            <p className="kpi-value">{totalEquipos}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper" style={{ backgroundColor: "#f5f3ff", color: "#8b5cf6" }}>
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="kpi-content">
            <h4>Usuarios Registrados</h4>
            <p className="kpi-value">{totalUsuarios}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="grafico-card grafico-wide">
          <div className="card-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Tendencia de Solicitudes</h4>
            <div className="trend-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Periodo:</label>
              <select 
                value={mesesHistorial} 
                onChange={(e) => setMesesHistorial(parseInt(e.target.value))}
                style={{ 
                  padding: '4px 8px', 
                  borderRadius: '6px', 
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer'
                }}
              >
                <option value={3}>3 meses</option>
                <option value={6}>6 meses</option>
                <option value={12}>12 meses</option>
              </select>
            </div>
          </div>
          <div className="chart-wrapper">
            <Line data={solicitudesPorMesData} options={lineOptions} />
          </div>
        </div>

        <div className="grafico-card">
          <h4>Estado de Solicitudes</h4>
          <div className="chart-wrapper">
            <Pie data={solicitudesPorEstadoData} options={pieOptions} />
          </div>
        </div>

        <div className="grafico-card">
          <h4>Tipos de Préstamo</h4>
          <div className="chart-wrapper">
            <Pie data={solicitudesPorTipoData} options={pieOptions} />
          </div>
        </div>

        <div className="grafico-card">
          <h4>Inventario por Categoría</h4>
          <div className="chart-wrapper">
            <Pie data={equiposPorCategoriaData} options={pieOptions} />
          </div>
        </div>

        <div className="grafico-card">
          <h4>Distribución de Usuarios</h4>
          <div className="chart-wrapper">
            <Pie data={usuariosPorTipoData} options={pieOptions} />
          </div>
        </div>

        <div className="grafico-card grafico-wide">
          <h4>Solicitudes por Carrera</h4>
          <div className="chart-wrapper" style={{ height: "300px" }}>
            <Bar data={solicitudesPorCarreraData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficosReportes;
