import { formatFecha } from '@helpers/formatData.js';
import '@styles/solicitud-detail-modal.css';

const SolicitudDetailModal = ({ solicitud, isOpen, onClose }) => {
  if (!isOpen || !solicitud) return null;

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

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Detalle de Solicitud</h2>
          <button className='close-btn' onClick={onClose}>
            ×
          </button>
        </div>

        <div className='modal-body'>
          <div className='detail-section'>
            <h3>Información del Equipo</h3>
            <div className='detail-grid'>
              <div className='detail-item'>
                <span className='label'>Modelo:</span>
                <span className='value'>{solicitud.equipo?.modelo || 'No especificado'}</span>
              </div>
              <div className='detail-item'>
                <span className='label'>Marca:</span>
                <span className='value'>{solicitud.equipo?.marca?.nombre || 'No especificada'}</span>
              </div>
              <div className='detail-item'>
                <span className='label'>Número de Serie:</span>
                <span className='value'>{solicitud.equipo?.numeroDeSerie || 'No especificado'}</span>
              </div>
              <div className='detail-item'>
                <span className='label'>Categoría:</span>
                <span className='value'>{solicitud.equipo?.categoria?.nombre || 'No especificada'}</span>
              </div>
            </div>
          </div>

          <div className='detail-section'>
            <h3>Información de la Solicitud</h3>
            <div className='detail-grid'>
              <div className='detail-item'>
                <span className='label'>ID de Solicitud:</span>
                <span className='value solicitud-id-modal'>{solicitud.id}</span>
              </div>
              <div className='detail-item'>
                <span className='label'>Estado:</span>
                <span className={`value status-badge ${getStatusColor(solicitud.estadoPrestamo?.nombre)}`}>
                  {solicitud.estadoPrestamo?.nombre || 'Sin estado'}
                </span>
              </div>
              <div className='detail-item'>
                <span className='label'>Fecha de Inicio del Préstamo:</span>
                <span className='value'>{formatFecha(solicitud.fechaInicioPrestamo)}</span>
              </div>
              <div className='detail-item'>
                <span className='label'>Fecha de Fin del Préstamo:</span>
                <span className='value'>{formatFecha(solicitud.fechaFinPrestamo)}</span>
              </div>
              <div className='detail-item'>
                <span className='label'>Horario:</span>
                <span className='value'>{formatHorario(solicitud)}</span>
              </div>
            </div>
          </div>

          {solicitud.observaciones && (
            <div className='detail-section'>
              <h3>Observaciones</h3>
              <div className='observaciones-box'>
                {solicitud.observaciones}
              </div>
            </div>
          )}

          {solicitud.estadoPrestamo?.nombre?.toLowerCase() === 'rechazado' && solicitud.motivoRechazo && (
            <div className='detail-section'>
              <h3>Motivo de Rechazo</h3>
              <div className='observaciones-box rechazo-box'>
                {solicitud.motivoRechazo}
              </div>
            </div>
          )}

          {(solicitud.fechaAprobacion || solicitud.fechaEntrega || solicitud.fechaDevolucion) && (
            <div className='detail-section'>
              <h3>Fechas del Proceso</h3>
              <div className='detail-grid'>
                {solicitud.fechaAprobacion && (
                  <div className='detail-item'>
                    <span className='label'>Fecha de Aprobación:</span>
                    <span className='value'>{formatFecha(solicitud.fechaAprobacion)}</span>
                  </div>
                )}
                {solicitud.fechaEntrega && (
                  <div className='detail-item'>
                    <span className='label'>Fecha de Entrega:</span>
                    <span className='value'>{formatFecha(solicitud.fechaEntrega)}</span>
                  </div>
                )}
                {solicitud.fechaDevolucion && (
                  <div className='detail-item'>
                    <span className='label'>Fecha de Devolución:</span>
                    <span className='value'>{formatFecha(solicitud.fechaDevolucion)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className='modal-footer'>
          <button className='close-modal-btn' onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolicitudDetailModal;
