import { useState, useEffect } from 'react';
import { getMisSolicitudes } from '@services/solicitud.service.js';
import { showErrorAlert } from '@helpers/sweetAlert.js';
import { formatFecha, formatFechaHora } from '@helpers/formatData.js';
import SolicitudDetailModal from '@components/SolicitudDetailModal.jsx';
import '@styles/mis-solicitudes.css';

const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMisSolicitudes();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching solicitudes:', err);
      if (err.response?.status !== 404) {
        setError('Error al cargar las solicitudes');
        showErrorAlert('Error', 'No se pudieron cargar las solicitudes');
      }
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshSolicitudes = () => {
    fetchSolicitudes();
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'status-pendiente';
      case 'aprobado':
        return 'status-aprobado';
      case 'rechazado':
        return 'status-rechazado';
      case 'entregado':
        return 'status-entregado';
      case 'devuelto':
        return 'status-devuelto';
      default:
        return 'status-default';
    }
  };

  const formatHorario = (solicitud) => {
    if (solicitud.horaInicioPrestamo && solicitud.horaFinPrestamo) {
      // Formatear a HH:MM
      const formatHora = (hora) => {
        if (!hora) return '';
        // Si ya está en formato HH:MM, devolverlo tal como está
        if (hora.includes(':') && hora.length === 5) return hora;
        // Si tiene segundos, quitar los segundos
        if (hora.includes(':') && hora.length === 8) return hora.substring(0, 5);
        return hora;
      };
      
      const horaInicio = formatHora(solicitud.horaInicioPrestamo);
      const horaFin = formatHora(solicitud.horaFinPrestamo);
      return `${horaInicio} - ${horaFin}`;
    }
    return 'No especificado';
  };

  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    if (filtroEstado === 'todas') return true;
    return solicitud.estadoPrestamo?.nombre?.toLowerCase() === filtroEstado;
  });

  const handleVerDetalle = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSolicitud(null);
  };

  if (loading) {
    return (
      <div className='mis-solicitudes-container'>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mis-solicitudes-container'>
        <div className='error-container'>
          <h2>Error al cargar solicitudes</h2>
          <p>{error}</p>
          <button onClick={refreshSolicitudes} className='retry-btn'>
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='mis-solicitudes-container'>
      <div className='solicitudes-header'>
        <h1>Mis Solicitudes</h1>
        <p>Gestiona y revisa el estado de tus solicitudes de equipos</p>
      </div>

      {/* Filtros */}
      <div className='filters-container'>
        <div className='filter-group'>
          <label htmlFor='filtro-estado'>Filtrar por estado:</label>
          <select 
            id='filtro-estado'
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className='filter-select'
          >
            <option value='todas'>Todas las solicitudes</option>
            <option value='pendiente'>Pendientes</option>
            <option value='aprobado'>Aprobadas</option>
            <option value='rechazado'>Rechazadas</option>
            <option value='entregado'>Entregadas</option>
            <option value='devuelto'>Devueltas</option>
          </select>
        </div>
        
        <button onClick={refreshSolicitudes} className='refresh-btn' disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Lista de Solicitudes */}
      {solicitudesFiltradas.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>📋</div>
          <h3>No tienes solicitudes</h3>
          <p>
            {filtroEstado === 'todas' 
              ? 'Aún no has realizado ninguna solicitud de equipo.'
              : `No tienes solicitudes con estado "${filtroEstado}".`
            }
          </p>
          {filtroEstado === 'todas' && (
            <p>Puedes crear una nueva solicitud desde el menú "Solicitar Equipo".</p>
          )}
        </div>
      ) : (
        <div className='solicitudes-list'>
          {solicitudesFiltradas.map((solicitud) => (
            <div key={solicitud.id} className='solicitud-card'>
              <div className='solicitud-header'>
                <div className='solicitud-info'>
                  <h3>{solicitud.equipo?.modelo || 'Equipo no especificado'}</h3>
                  <p className='marca-info'>
                    <strong>Marca:</strong> {solicitud.equipo?.marca?.nombre || 'No especificada'}
                  </p>
                  <p className='categoria-info'>
                    <strong>Categoría:</strong> {solicitud.equipo?.categoria?.nombre || 'No especificada'}
                  </p>
                </div>
                <div className={`status-badge ${getStatusColor(solicitud.estadoPrestamo?.nombre)}`}>
                  {solicitud.estadoPrestamo?.nombre || 'Sin estado'}
                </div>
              </div>

              <div className='solicitud-details'>
                <div className='detail-row'>
                  <span className='detail-label'>�️ Fecha de inicio del préstamo:</span>
                  <span className='detail-value'>{formatFecha(solicitud.fechaInicioPrestamo)}</span>
                </div>
                
                <div className='detail-row'>
                  <span className='detail-label'>� Fecha de fin del préstamo:</span>
                  <span className='detail-value'>{formatFecha(solicitud.fechaFinPrestamo)}</span>
                </div>
                
                <div className='detail-row'>
                  <span className='detail-label'>⏰ Horario:</span>
                  <span className='detail-value'>{formatHorario(solicitud)}</span>
                </div>

                {solicitud.observaciones && (
                  <div className='detail-row'>
                    <span className='detail-label'>📝 Observaciones:</span>
                    <span className='detail-value'>{solicitud.observaciones}</span>
                  </div>
                )}

                {solicitud.fechaAprobacion && (
                  <div className='detail-row'>
                    <span className='detail-label'>✅ Fecha de aprobación:</span>
                    <span className='detail-value'>{formatFechaHora(solicitud.fechaAprobacion)}</span>
                  </div>
                )}

                {solicitud.estadoPrestamo?.nombre?.toLowerCase() === 'rechazado' && solicitud.motivoRechazo && (
                  <div className='detail-row'>
                    <span className='detail-label'>❌ Motivo de rechazo:</span>
                    <span className='detail-value'>{solicitud.motivoRechazo}</span>
                  </div>
                )}

                {solicitud.fechaEntrega && (
                  <div className='detail-row'>
                    <span className='detail-label'>📦 Fecha de entrega:</span>
                    <span className='detail-value'>{formatFechaHora(solicitud.fechaEntrega)}</span>
                  </div>
                )}

                {solicitud.fechaDevolucion && (
                  <div className='detail-row'>
                    <span className='detail-label'>↩️ Fecha de devolución:</span>
                    <span className='detail-value'>{formatFechaHora(solicitud.fechaDevolucion)}</span>
                  </div>
                )}
              </div>

              <div className='solicitud-actions'>
                <span className='solicitud-id'>ID: {solicitud.id}</span>
                <div className='actions-right'>
                  <button 
                    className='detail-btn'
                    onClick={() => handleVerDetalle(solicitud)}
                  >
                    Ver Detalle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalle */}
      <SolicitudDetailModal
        solicitud={selectedSolicitud}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default MisSolicitudes;
