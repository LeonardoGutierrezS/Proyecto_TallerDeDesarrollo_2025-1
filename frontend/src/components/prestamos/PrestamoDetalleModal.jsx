import '@styles/modal.css';
import '@styles/prestamo-detalle.css';

const PrestamoDetalleModal = ({ show, onClose, prestamo }) => {
    if (!show || !prestamo) return null;

    // Estados del préstamo en orden
    const ESTADOS_ORDEN = [
        { nombre: 'Pendiente', icono: '⏳', color: '#ff9800' },
        { nombre: 'Aprobado', icono: '✅', color: '#4caf50' },
        { nombre: 'Rechazado', icono: '❌', color: '#f44336' },
        { nombre: 'Entregado', icono: '📦', color: '#2196f3' },
        { nombre: 'Devuelto', icono: '🔙', color: '#9c27b0' }
    ];

    // Formatear fecha y hora
    const formatFecha = (fecha) => {
        if (!fecha) return '-';
        try {
            const date = new Date(fecha);
            return date.toLocaleString('es-CL', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '-';
        }
    };

    const formatHora = (hora) => {
        if (!hora) return '';
        return ` a las ${hora}`;
    };

    // Determinar qué estados han sido completados
    const estadoActual = prestamo.estadoPrestamo?.Estado_Prestamo;
    const isRechazado = estadoActual === 'Rechazado';
    
    const getEstadoStatus = (nombreEstado) => {
        if (nombreEstado === 'Rechazado') {
            return isRechazado ? 'completado' : 'no-aplica';
        }
        
        if (isRechazado && nombreEstado !== 'Pendiente') {
            return 'no-aplica';
        }

        const orden = {
            'Pendiente': 1,
            'Aprobado': 2,
            'Entregado': 3,
            'Devuelto': 4
        };

        const ordenActual = orden[estadoActual] || 0;
        const ordenEstado = orden[nombreEstado] || 0;

        if (ordenActual >= ordenEstado) return 'completado';
        if (ordenActual + 1 === ordenEstado) return 'activo';
        return 'pendiente';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-detalle-prestamo" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📋 Detalles del Préstamo #{prestamo.ID_Prestamo}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {/* Información del Usuario */}
                    <div className="info-section">
                        <h3>👤 Información del Usuario</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Nombre:</span>
                                <span className="info-value">{prestamo.usuario?.Nombre} {prestamo.usuario?.Apellido}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{prestamo.usuario?.Email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Rol:</span>
                                <span className="info-value">{prestamo.usuario?.rol?.Rol}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Carrera:</span>
                                <span className="info-value">{prestamo.usuario?.carrera?.Carrera || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información del Equipo */}
                    <div className="info-section">
                        <h3>💻 Información del Equipo</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">N° Inventario:</span>
                                <span className="info-value">{prestamo.ID_Num_Inv}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Categoría:</span>
                                <span className="info-value">{prestamo.categoria?.Categoria}</span>
                            </div>
                            {prestamo.Retencion_documento && (
                                <div className="info-item">
                                    <span className="info-label">Documento Retenido:</span>
                                    <span className="info-value">{prestamo.Retencion_documento}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline del Préstamo */}
                    <div className="info-section">
                        <h3>📊 Historial del Préstamo</h3>
                        <div className="timeline">
                            {ESTADOS_ORDEN.map((estado, index) => {
                                const status = getEstadoStatus(estado.nombre);
                                if (status === 'no-aplica') return null;

                                return (
                                    <div key={estado.nombre} className={`timeline-item ${status}`}>
                                        <div className="timeline-marker" style={{ 
                                            backgroundColor: status === 'completado' ? estado.color : '#e0e0e0',
                                            borderColor: estado.color
                                        }}>
                                            <span className="timeline-icon">{estado.icono}</span>
                                        </div>
                                        <div className="timeline-content">
                                            <h4>{estado.nombre}</h4>
                                            {estado.nombre === 'Pendiente' && prestamo.Fecha_inicio_prestamo && (
                                                <p className="timeline-date">
                                                    {formatFecha(prestamo.Fecha_inicio_prestamo)}
                                                    {formatHora(prestamo.Hora_inicio_prestamo)}
                                                </p>
                                            )}
                                            {estado.nombre === 'Aprobado' && status === 'completado' && (
                                                <p className="timeline-date">
                                                    Fecha término programada: {formatFecha(prestamo.Fecha_ter_prestamo)}
                                                    {formatHora(prestamo.Hora_fin_prestamo)}
                                                </p>
                                            )}
                                            {estado.nombre === 'Rechazado' && status === 'completado' && (
                                                <div>
                                                    <p className="timeline-motivo">
                                                        <strong>Motivo:</strong> {prestamo.Motivo_Rechazo || 'No especificado'}
                                                    </p>
                                                </div>
                                            )}
                                            {estado.nombre === 'Devuelto' && prestamo.Fecha_devolucion && (
                                                <p className="timeline-date">
                                                    {formatFecha(prestamo.Fecha_devolucion)}
                                                    {formatHora(prestamo.Hora_devolucion)}
                                                </p>
                                            )}
                                        </div>
                                        {index < ESTADOS_ORDEN.length - 1 && status !== 'no-aplica' && (
                                            <div className={`timeline-connector ${status === 'completado' ? 'completado' : ''}`}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Observaciones */}
                    {prestamo.Observaciones && (
                        <div className="info-section">
                            <h3>📝 Observaciones</h3>
                            <p className="observaciones-text">{prestamo.Observaciones}</p>
                        </div>
                    )}

                    {/* Condiciones del Préstamo */}
                    {prestamo.Condiciones_Prestamo && (
                        <div className="info-section">
                            <h3>📜 Condiciones del Préstamo</h3>
                            <p className="condiciones-text">{prestamo.Condiciones_Prestamo}</p>
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cancel">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrestamoDetalleModal;
