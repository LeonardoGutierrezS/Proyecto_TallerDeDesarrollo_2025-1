import '@styles/styles.css';
import '@styles/gestion-solicitudes.css';
import { useState, useEffect } from 'react';
import { 
  descargarReporteSolicitudesPDF,
  descargarReporteSolicitudesCSV,
  descargarReportePrestamosPDF,
  descargarReportePrestamosCSV,
  descargarReporteEquiposPDF,
  descargarReporteEquiposCSV,
  descargarReporteEstadisticasPDF,
  descargarReporteUsuariosPDF,
  descargarReporteUsuariosCSV,
  obtenerDatosGraficos
} from '@services/reportes.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileCsv, faCalendar, faDownload, faChartBar, faEye, faUsers } from '@fortawesome/free-solid-svg-icons';
import GraficosReportes from '@components/GraficosReportes';

const Reportes = () => {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoUsuarioFiltro, setTipoUsuarioFiltro] = useState('');
  const [loading, setLoading] = useState(false);
  const [datosGraficos, setDatosGraficos] = useState(null);
  const [mostrarGraficos, setMostrarGraficos] = useState(false);

  // Cargar datos de gráficos al montar
  useEffect(() => {
    cargarDatosGraficos();
  }, []);

  const cargarDatosGraficos = async () => {
    try {
      const datos = await obtenerDatosGraficos();
      setDatosGraficos(datos);
    } catch {
      console.error('Error al cargar datos de gráficos');
    }
  };

  // Función auxiliar para descargar archivo
  const descargarArchivo = (blob, nombreArchivo) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Función para previsualizar PDF en nueva pestaña
  const previsualizarPDF = (blob) => {
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  // Handlers para Solicitudes
  const handlePrevisualizarSolicitudesPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteSolicitudesPDF(fechaInicio, fechaFin);
      previsualizarPDF(blob);
      showSuccessAlert('Vista previa abierta', 'El reporte se ha abierto en una nueva pestaña');
    } catch {
      showErrorAlert('Error', 'No se pudo previsualizar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarSolicitudesPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteSolicitudesPDF(fechaInicio, fechaFin);
      descargarArchivo(blob, `reporte-solicitudes-${Date.now()}.pdf`);
      showSuccessAlert('Descarga exitosa', 'El reporte ha sido descargado');
    } catch {
      showErrorAlert('Error', 'No se pudo descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarSolicitudesCSV = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteSolicitudesCSV(fechaInicio, fechaFin);
      descargarArchivo(blob, `reporte-solicitudes-${Date.now()}.csv`);
      showSuccessAlert('Descarga exitosa', 'El reporte ha sido descargado');
    } catch {
      showErrorAlert('Error', 'No se pudo descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // Handlers para Préstamos
  const handlePrevisualizarPrestamosPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReportePrestamosPDF(fechaInicio, fechaFin);
      previsualizarPDF(blob);
      showSuccessAlert('Vista previa abierta', 'El reporte se ha abierto en una nueva pestaña');
    } catch {
      showErrorAlert('Error', 'No se pudo previsualizar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPrestamosPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReportePrestamosPDF(fechaInicio, fechaFin);
      descargarArchivo(blob, `reporte-prestamos-${Date.now()}.pdf`);
      showSuccessAlert('Descarga exitosa', 'El reporte ha sido descargado');
    } catch {
      showErrorAlert('Error', 'No se pudo descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPrestamosCSV = async () => {
    try {
      setLoading(true);
      const blob = await descargarReportePrestamosCSV(fechaInicio, fechaFin);
      descargarArchivo(blob, `reporte-prestamos-${Date.now()}.csv`);
      showSuccessAlert('Descarga exitosa', 'El reporte ha sido descargado');
    } catch {
      showErrorAlert('Error', 'No se pudo descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // Handlers para Equipos
  const handlePrevisualizarEquiposPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteEquiposPDF();
      previsualizarPDF(blob);
      showSuccessAlert('Vista previa abierta', 'El reporte se ha abierto en una nueva pestaña');
    } catch {
      showErrorAlert('Error', 'No se pudo previsualizar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarEquiposPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteEquiposPDF();
      descargarArchivo(blob, `reporte-equipos-${Date.now()}.pdf`);
      showSuccessAlert('Descarga exitosa', 'El reporte ha sido descargado');
    } catch {
      showErrorAlert('Error', 'No se pudo descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarEquiposCSV = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteEquiposCSV();
      descargarArchivo(blob, `reporte-equipos-${Date.now()}.csv`);
      showSuccessAlert('Descarga exitosa', 'El reporte ha sido descargado');
    } catch {
      showErrorAlert('Error', 'No se pudo descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // Handlers para Usuarios
  const handlePrevisualizarUsuariosPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteUsuariosPDF(tipoUsuarioFiltro);
      previsualizarPDF(blob);
      showSuccessAlert('Vista previa abierta', 'El reporte se ha abierto en una nueva pestaña');
    } catch {
      showErrorAlert('Error', 'No se pudo previsualizar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarUsuariosPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteUsuariosPDF(tipoUsuarioFiltro);
      descargarArchivo(blob, `reporte-usuarios-${Date.now()}.pdf`);
      showSuccessAlert('Descarga exitosa', 'El reporte ha sido descargado');
    } catch {
      showErrorAlert('Error', 'No se pudo descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarUsuariosCSV = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteUsuariosCSV(tipoUsuarioFiltro);
      descargarArchivo(blob, `reporte-usuarios-${Date.now()}.csv`);
      showSuccessAlert('Descarga exitosa', 'El reporte ha sido descargado');
    } catch {
      showErrorAlert('Error', 'No se pudo descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // Handlers para Estadísticas
  const handlePrevisualizarEstadisticasPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteEstadisticasPDF();
      previsualizarPDF(blob);
      showSuccessAlert('Vista previa abierta', 'El reporte se ha abierto en una nueva pestaña');
    } catch {
      showErrorAlert('Error', 'No se pudo previsualizar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarEstadisticasPDF = async () => {
    try {
      setLoading(true);
      const blob = await descargarReporteEstadisticasPDF();
      descargarArchivo(blob, `reporte-estadisticas-${Date.now()}.pdf`);
      showSuccessAlert('Descarga exitosa', 'El reporte ha sido descargado');
    } catch {
      showErrorAlert('Error', 'No se pudo descargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1 className="title-page">📊 Reportes del Sistema</h1>
      
      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'solicitudes' ? 'active' : ''}`}
          onClick={() => setActiveTab('solicitudes')}
        >
          📝 Solicitudes
        </button>
        <button 
          className={`tab-button ${activeTab === 'prestamos' ? 'active' : ''}`}
          onClick={() => setActiveTab('prestamos')}
        >
          📦 Préstamos
        </button>
        <button 
          className={`tab-button ${activeTab === 'equipos' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipos')}
        >
          💻 Equipos
        </button>
        <button 
          className={`tab-button ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          <FontAwesomeIcon icon={faUsers} /> Usuarios
        </button>
        <button 
          className={`tab-button ${activeTab === 'estadisticas' ? 'active' : ''}`}
          onClick={() => setActiveTab('estadisticas')}
        >
          <FontAwesomeIcon icon={faChartBar} /> Estadísticas
        </button>
      </div>

      {/* Contenido de pestañas */}
      <div className="tab-content">
        {/* Reporte de Solicitudes */}
        {activeTab === 'solicitudes' && (
          <div className="reporte-section">
            <div className="info-section">
              <h3>📝 Reporte de Solicitudes</h3>
              <p>Genera un informe completo de todas las solicitudes registradas en el sistema.</p>
              <ul className="info-list">
                <li>✓ Información de usuario y equipo solicitado</li>
                <li>✓ Estado actual de cada solicitud</li>
                <li>✓ Tipo de préstamo (diario/largo plazo)</li>
                <li>✓ Fechas y motivos de solicitud</li>
              </ul>
            </div>

            {/* Filtros */}
            <div className="filters-section">
              <div className="filter-group">
                <label><FontAwesomeIcon icon={faCalendar} /> Fecha Inicio:</label>
                <input 
                  type="date" 
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="filter-group">
                <label><FontAwesomeIcon icon={faCalendar} /> Fecha Fin:</label>
                <input 
                  type="date" 
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="date-input"
                />
              </div>
              {(fechaInicio || fechaFin) && (
                <button 
                  className="btn-clear"
                  onClick={() => {
                    setFechaInicio('');
                    setFechaFin('');
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="actions-section">
              <button 
                className="btn-action btn-preview"
                onClick={handlePrevisualizarSolicitudesPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faEye} /> Vista Previa
              </button>
              <button 
                className="btn-action btn-download-pdf"
                onClick={handleDescargarSolicitudesPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
              </button>
              <button 
                className="btn-action btn-download-csv"
                onClick={handleDescargarSolicitudesCSV}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFileCsv} /> Descargar CSV
              </button>
            </div>
          </div>
        )}

        {/* Reporte de Préstamos */}
        {activeTab === 'prestamos' && (
          <div className="reporte-section">
            <div className="info-section">
              <h3>📦 Reporte de Préstamos</h3>
              <p>Genera un historial completo de todos los préstamos realizados.</p>
              <ul className="info-list">
                <li>✓ Préstamos activos y finalizados</li>
                <li>✓ Información de usuarios y equipos prestados</li>
                <li>✓ Fechas de inicio y término del préstamo</li>
                <li>✓ Estados y condiciones de cada préstamo</li>
              </ul>
            </div>

            {/* Filtros */}
            <div className="filters-section">
              <div className="filter-group">
                <label><FontAwesomeIcon icon={faCalendar} /> Fecha Inicio:</label>
                <input 
                  type="date" 
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="filter-group">
                <label><FontAwesomeIcon icon={faCalendar} /> Fecha Fin:</label>
                <input 
                  type="date" 
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="date-input"
                />
              </div>
              {(fechaInicio || fechaFin) && (
                <button 
                  className="btn-clear"
                  onClick={() => {
                    setFechaInicio('');
                    setFechaFin('');
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="actions-section">
              <button 
                className="btn-action btn-preview"
                onClick={handlePrevisualizarPrestamosPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faEye} /> Vista Previa
              </button>
              <button 
                className="btn-action btn-download-pdf"
                onClick={handleDescargarPrestamosPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
              </button>
              <button 
                className="btn-action btn-download-csv"
                onClick={handleDescargarPrestamosCSV}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFileCsv} /> Descargar CSV
              </button>
            </div>
          </div>
        )}

        {/* Reporte de Equipos */}
        {activeTab === 'equipos' && (
          <div className="reporte-section">
            <div className="info-section">
              <h3>💻 Reporte de Equipos</h3>
              <p>Genera un inventario completo de todos los equipos del sistema.</p>
              <ul className="info-list">
                <li>✓ Listado de todos los equipos disponibles</li>
                <li>✓ Estado de disponibilidad y condición física</li>
                <li>✓ Categorías, marcas y modelos</li>
                <li>✓ Estadísticas de uso y disponibilidad</li>
              </ul>
            </div>

            <div className="actions-section">
              <button 
                className="btn-action btn-preview"
                onClick={handlePrevisualizarEquiposPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faEye} /> Vista Previa
              </button>
              <button 
                className="btn-action btn-download-pdf"
                onClick={handleDescargarEquiposPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
              </button>
              <button 
                className="btn-action btn-download-csv"
                onClick={handleDescargarEquiposCSV}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFileCsv} /> Descargar CSV
              </button>
            </div>
          </div>
        )}

        {/* Reporte de Usuarios */}
        {activeTab === 'usuarios' && (
          <div className="reporte-section">
            <div className="info-section">
              <h3><FontAwesomeIcon icon={faUsers} /> Reporte de Usuarios</h3>
              <p>Genera un listado completo de todos los usuarios registrados.</p>
              <ul className="info-list">
                <li>✓ Información completa de usuarios</li>
                <li>✓ Tipos de usuario (Alumnos, Profesores, Administradores)</li>
                <li>✓ Carreras y cargos asociados</li>
                <li>✓ Fechas de registro</li>
              </ul>
            </div>

            {/* Filtros */}
            <div className="filters-section">
              <div className="filter-group">
                <label>Tipo de Usuario:</label>
                <select 
                  value={tipoUsuarioFiltro}
                  onChange={(e) => setTipoUsuarioFiltro(e.target.value)}
                  className="date-input"
                >
                  <option value="">Todos</option>
                  <option value="Alumno">Alumnos</option>
                  <option value="Profesor">Profesores</option>
                  <option value="Administrador">Administradores</option>
                </select>
              </div>
              {tipoUsuarioFiltro && (
                <button 
                  className="btn-clear"
                  onClick={() => setTipoUsuarioFiltro('')}
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="actions-section">
              <button 
                className="btn-action btn-preview"
                onClick={handlePrevisualizarUsuariosPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faEye} /> Vista Previa
              </button>
              <button 
                className="btn-action btn-download-pdf"
                onClick={handleDescargarUsuariosPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
              </button>
              <button 
                className="btn-action btn-download-csv"
                onClick={handleDescargarUsuariosCSV}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFileCsv} /> Descargar CSV
              </button>
            </div>
          </div>
        )}

        {/* Reporte de Estadísticas con Gráficos */}
        {activeTab === 'estadisticas' && (
          <div className="reporte-section">
            <div className="info-section">
              <h3><FontAwesomeIcon icon={faChartBar} /> Estadísticas Generales</h3>
              <p>Visualiza estadísticas generales del sistema y genera reportes.</p>
              <ul className="info-list">
                <li>✓ Total de solicitudes y préstamos realizados</li>
                <li>✓ Equipos disponibles vs equipos en préstamo</li>
                <li>✓ Tasa de disponibilidad del inventario</li>
                <li>✓ Gráficos interactivos y visualización de datos</li>
              </ul>
            </div>

            {/* Botón para mostrar/ocultar gráficos */}
            <div className="actions-section" style={{ marginBottom: '20px' }}>
              <button 
                className="btn-action"
                onClick={() => setMostrarGraficos(!mostrarGraficos)}
                style={{ backgroundColor: '#667eea' }}
              >
                <FontAwesomeIcon icon={faChartBar} /> 
                {mostrarGraficos ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
              </button>
            </div>

            {/* Gráficos */}
            {mostrarGraficos && datosGraficos && (
              <GraficosReportes datosGraficos={datosGraficos} />
            )}

            <div className="actions-section">
              <button 
                className="btn-action btn-preview"
                onClick={handlePrevisualizarEstadisticasPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faEye} /> Vista Previa PDF
              </button>
              <button 
                className="btn-action btn-download-pdf"
                onClick={handleDescargarEstadisticasPDF}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="modal-overlay">
          <div className="loading-modal">
            <FontAwesomeIcon icon={faDownload} spin size="3x" className="loading-icon" />
            <p>Generando reporte...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
