import '@styles/styles.css';
import '@styles/gestion-solicitudes.css';
import { useState, useEffect } from 'react';
import { getSolicitudes, descargarPDFAutorizacion, entregarPrestamo, devolverPrestamo } from '@services/solicitud.service';
import { aprobarSolicitud, rechazarSolicitud } from '@services/autorizacion.service';
import { registrarDevolucion } from '@services/devolucion.service';
import { showErrorAlert, showSuccessAlert, showConfirmAlert } from '@helpers/sweetAlert';
import { useAuth } from '@context/AuthContext';
import Search from '@components/Search';
import Swal from 'sweetalert2';
import PrestamoDetalleModal from '@components/prestamos/PrestamoDetalleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const GestionSolicitudes = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('pendientes');
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('diaria'); // 'diaria' o 'largo_plazo'
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Verificar si el usuario es director de escuela o administrador
    const esDirectorEscuela = user?.esDirectorEscuela || false;
    const isAdmin = user?.tipoUsuario === 'Administrador';

    // Determinar tipo de solicitud basado en fechas
    const getTipoSolicitud = (solicitud) => {
        // Si tiene fechas de inicio y término, es largo plazo
        if (solicitud.Fecha_inicio_sol && solicitud.Fecha_termino_sol) {
            return 'largo_plazo';
        }
        return 'diaria';
    };

    // Obtener estado de una solicitud basado en su préstamo y relaciones
    const getEstadoSolicitud = (solicitud) => {
        if (!solicitud.ID_Prestamo || !solicitud.prestamo) {
            return 'Pendiente';
        }

        const prestamo = solicitud.prestamo;
        
        // Si tiene devolución, está devuelto
        if (prestamo.devolucion) {
            return 'Devuelto';
        }

        // Verificar estados en tieneEstados (ordenar por más reciente)
        if (prestamo.tieneEstados && prestamo.tieneEstados.length > 0) {
            const estadoMasReciente = prestamo.tieneEstados
                .sort((a, b) => new Date(b.Fecha_Estado) - new Date(a.Fecha_Estado))[0];
            
            if (estadoMasReciente.estadoPrestamo) {
                const codEstado = estadoMasReciente.Cod_Estado;
                // Mapear estados por código
                if (codEstado === 1) return 'Pendiente';
                if (codEstado === 2) return 'Listo para Entregar';
                if (codEstado === 3) return 'Listo para recepcionar';
                if (codEstado === 4) return 'Devuelto';
                if (codEstado === 5) return 'Rechazado';
                
                // Fallback a descripción si existe
                const descripcion = estadoMasReciente.estadoPrestamo.Descripcion;
                if (descripcion === 'Listo para Entregar') return 'Listo para Entregar';
                if (descripcion === 'Entregado') return 'Listo para recepcionar';
                if (descripcion === 'Devuelto') return 'Devuelto';
                if (descripcion === 'Rechazado') return 'Rechazado';
                return descripcion || 'Desconocido';
            }
        }

        // Si tiene autorización, verificar si fue aprobado o rechazado
        if (prestamo.autorizacion) {
            // Si la observación menciona rechazo
            if (prestamo.autorizacion.Obs_Aut && prestamo.autorizacion.Obs_Aut.toLowerCase().includes('rechaz')) {
                return 'Rechazado';
            }
            return 'Listo para Entregar'; // Por defecto, si tiene autorización está lista
        }

        return 'Procesando';
    };

    // Cargar solicitudes
    const fetchSolicitudes = async () => {
        try {
            setLoading(true);
            const response = await getSolicitudes();
            
            if (response.status === 'Success' && response.data) {
                setSolicitudes(response.data);
            } else {
                setSolicitudes([]);
            }
        } catch (error) {
            console.error('Error al obtener solicitudes:', error);
            showErrorAlert('Error', 'No se pudieron cargar las solicitudes');
            setSolicitudes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    // Filtrar solicitudes por estado
    const filterByEstado = (estado) => {
        return solicitudes.filter(s => getEstadoSolicitud(s) === estado);
    };

    // Filtrar por búsqueda
    const filterBySearch = (solicitudesList) => {
        if (!searchText) return solicitudesList;
        
        return solicitudesList.filter(solicitud => {
            const searchLower = searchText.toLowerCase();
            return (
                solicitud.usuario?.Nombre?.toLowerCase().includes(searchLower) ||
                solicitud.usuario?.Apellido?.toLowerCase().includes(searchLower) ||
                solicitud.usuario?.Email?.toLowerCase().includes(searchLower) ||
                solicitud.ID_Num_Inv?.toLowerCase().includes(searchLower) ||
                solicitud.equipo?.categoria?.Descripcion?.toLowerCase().includes(searchLower) ||
                solicitud.Motivo_Sol?.toLowerCase().includes(searchLower)
            );
        });
    };

    // Obtener solicitudes según la pestaña activa
    const getFilteredSolicitudes = () => {
        let filtered = [];
        switch (activeTab) {
            case 'pendientes':
                filtered = filterByEstado('Pendiente');
                break;
            case 'listo-entregar':
                filtered = filterByEstado('Listo para Entregar');
                break;
            case 'entregados':
                filtered = filterByEstado('Listo para recepcionar');
                break;
            case 'devueltos':
                filtered = filterByEstado('Devuelto');
                break;
            case 'rechazados':
                filtered = filterByEstado('Rechazado');
                break;
            default:
                filtered = solicitudes;
        }

        // Filtrar por tipo de solicitud según el rol
        if (esDirectorEscuela) {
            // Director solo ve solicitudes a largo plazo en pendientes
            filtered = filtered.filter(s => getTipoSolicitud(s) === 'largo_plazo');
        } else if (isAdmin) {
            // Admin: en pendientes filtra por tipo selector, en otras pestañas ve todas
            if (activeTab === 'pendientes') {
                filtered = filtered.filter(s => getTipoSolicitud(s) === tipoFiltro);
            }
            // En las demás pestañas (listo-entregar, entregados, devueltos, rechazados)
            // el admin ve TODAS las solicitudes sin filtrar por tipo
        }

        return filterBySearch(filtered);
    };

    const filteredSolicitudes = getFilteredSolicitudes();

    // Handler para ver detalles
    const handleVerDetalle = (solicitud) => {
        setSelectedSolicitud(solicitud);
        setShowModal(true);
    };

    // Formatear fecha
    const formatFecha = (fecha) => {
        if (!fecha) return '-';
        try {
            const date = new Date(fecha);
            return date.toLocaleString('es-CL', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '-';
        }
    };

    // Handler para aprobar solicitud
    const handleAprobar = async (solicitud) => {
        console.log('Solicitud completa:', JSON.stringify(solicitud, null, 2));
        console.log('Usuario Nombre:', solicitud.usuario?.Nombre);
        console.log('Usuario Apellido:', solicitud.usuario?.Apellido);
        console.log('Todas las propiedades de usuario:', Object.keys(solicitud.usuario || {}));
        
        // Formatear fechas para mostrar
        const formatFechaDisplay = (fecha) => {
            if (!fecha) return '';
            try {
                const date = new Date(fecha);
                return date.toLocaleDateString('es-CL', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                });
            } catch {
                return fecha;
            }
        };

        const result = await Swal.fire({
            title: 'Aprobar Solicitud',
            html: `
                <div style="text-align: left;">
                    <p><strong>Usuario:</strong> ${solicitud.usuario?.Nombre || ''} ${solicitud.usuario?.Apellido || ''}</p>
                    <p><strong>RUT:</strong> ${solicitud.Rut || ''}</p>
                    <p><strong>Equipo:</strong> ${solicitud.ID_Num_Inv}</p>
                    <p><strong>Motivo:</strong> ${solicitud.Motivo_Sol}</p>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #4a90e2;">
                        <p style="margin: 5px 0;"><strong>📅 Período del Préstamo:</strong></p>
                        <p style="margin: 5px 0; padding-left: 10px;">
                            <strong>Desde:</strong> ${formatFechaDisplay(solicitud.Fecha_inicio_sol)}
                        </p>
                        <p style="margin: 5px 0; padding-left: 10px;">
                            <strong>Hasta:</strong> ${formatFechaDisplay(solicitud.Fecha_termino_sol)}
                        </p>
                    </div>

                    <div style="margin-top: 15px; padding: 15px; background-color: #e8f4fd; border-radius: 8px; border-left: 4px solid #2196F3;">
                        <p style="margin: 5px 0;"><strong>✓ Condiciones de Aprobación:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px; text-align: left; font-size: 14px;">
                            <li>El estudiante debe estar vigente en el sistema</li>
                            <li>No debe tener penalizaciones activas</li>
                            <li>El equipo debe ser devuelto en la fecha indicada</li>
                            <li>El estudiante será responsable del equipo durante el período de préstamo</li>
                        </ul>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Aprobar',
            cancelButtonText: 'Cancelar',
            width: '600px'
        });

        if (result.isConfirmed) {
            try {
                const now = new Date();
                const horaActual = now.toTimeString().split(' ')[0];

                // Condiciones estándar de préstamo (para el PDF y documento)
                const condicionesEstandar = 
                    "• El equipo debe ser usado exclusivamente para fines académicos\n" +
                    "• El usuario es responsable del cuidado y correcto uso del equipo\n" +
                    "• Cualquier daño o pérdida debe ser reportado inmediatamente\n" +
                    "• El equipo debe ser devuelto en la fecha indicada y en las mismas condiciones";

                const data = {
                    ID_Solicitud: solicitud.ID_Solicitud,
                    Rut_Autorizador: user.rut,
                    ID_Num_Inv: solicitud.ID_Num_Inv,
                    // Usar las fechas de la solicitud
                    Fecha_inicio_prestamo: solicitud.Fecha_inicio_sol,
                    Hora_inicio_prestamo: horaActual,
                    Fecha_fin_prestamo: solicitud.Fecha_termino_sol,
                    Hora_fin_prestamo: horaActual,
                    Tipo_documento: null, // No aplica para director de escuela
                    Condiciones_Prestamo: condicionesEstandar,
                    Fecha_Aut: new Date().toISOString(),
                    Hora_Aut: horaActual,
                    Obs_Aut: 'Solicitud aprobada'
                };

                const response = await aprobarSolicitud(data);

                if (response.status === 'Success') {
                    showSuccessAlert('¡Solicitud Aprobada!', 'El préstamo ha sido creado exitosamente');
                    fetchSolicitudes();
                } else {
                    showErrorAlert('Error', response.message || 'No se pudo aprobar la solicitud');
                }
            } catch (error) {
                console.error('Error al aprobar:', error);
                showErrorAlert('Error', 'Ocurrió un error al aprobar la solicitud');
            }
        }
    };

    // Handler para rechazar solicitud
    const handleRechazar = async (solicitud) => {
        const result = await Swal.fire({
            title: 'Rechazar Solicitud',
            html: `
                <div style="text-align: left;">
                    <p><strong>Usuario:</strong> ${solicitud.usuario.Nombre} ${solicitud.usuario.Apellido}</p>
                    <p><strong>Equipo:</strong> ${solicitud.ID_Num_Inv}</p>
                    <p><strong>Motivo:</strong> ${solicitud.Motivo_Sol}</p>
                </div>
                <div style="margin-top: 15px;">
                    <label for="motivo-rechazo" style="display: block; text-align: left; margin-bottom: 5px;">
                        <strong>Motivo del Rechazo:</strong>
                    </label>
                    <textarea id="motivo-rechazo" class="swal2-textarea" placeholder="Explica por qué se rechaza la solicitud" required style="margin: 0;"></textarea>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Rechazar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            preConfirm: () => {
                const motivoRechazo = document.getElementById('motivo-rechazo').value;

                if (!motivoRechazo || motivoRechazo.trim() === '') {
                    Swal.showValidationMessage('Debes especificar el motivo del rechazo');
                    return false;
                }

                return { motivoRechazo };
            }
        });

        if (result.isConfirmed) {
            try {
                const now = new Date();
                const horaActual = now.toTimeString().split(' ')[0];

                const data = {
                    ID_Solicitud: solicitud.ID_Solicitud,
                    Rut_Autorizador: user.rut,
                    ID_Num_Inv: solicitud.ID_Num_Inv,
                    Fecha_Aut: new Date().toISOString(),
                    Hora_Aut: horaActual,
                    Motivo_Rechazo: result.value.motivoRechazo
                };

                const response = await rechazarSolicitud(data);

                if (response.status === 'Success') {
                    showSuccessAlert('Solicitud Rechazada', 'La solicitud ha sido rechazada');
                    fetchSolicitudes();
                } else {
                    showErrorAlert('Error', response.message || 'No se pudo rechazar la solicitud');
                }
            } catch (error) {
                console.error('Error al rechazar:', error);
                showErrorAlert('Error', 'Ocurrió un error al rechazar la solicitud');
            }
        }
    };

    // Handler para descargar PDF de autorización
    const handleDescargarPDF = async (solicitud) => {
        try {
            await descargarPDFAutorizacion(solicitud.ID_Solicitud);
            showSuccessAlert('PDF Descargado', 'El documento de autorización se ha descargado correctamente');
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            showErrorAlert('Error', 'No se pudo descargar el PDF de autorización');
        }
    };

    // Handler para marcar como entregado (Admin entrega equipo al alumno)
    const handleEntregar = async (solicitud) => {
        const confirmed = await showConfirmAlert(
            'Entregar Equipo',
            `¿Confirmas que entregas el equipo ${solicitud.ID_Num_Inv} a ${solicitud.usuario.Nombre_Completo}?`,
            'Sí, entregar'
        );

        if (confirmed) {
            try {
                const response = await entregarPrestamo(solicitud.prestamo.ID_Prestamo);
                
                if (response.status === 'Success') {
                    showSuccessAlert('Equipo Entregado', 'El equipo ha sido marcado como entregado');
                    fetchSolicitudes();
                } else {
                    showErrorAlert('Error', response.message || 'No se pudo marcar como entregado');
                }
            } catch (error) {
                console.error('Error al entregar:', error);
                showErrorAlert('Error', 'Ocurrió un error al entregar el equipo');
            }
        }
    };

    // Handler para registrar devolución (Admin recibe equipo del alumno)
    const handleDevolver = async (solicitud) => {
        const result = await Swal.fire({
            title: 'Registrar Devolución',
            html: `
                <div style="text-align: left;">
                    <p><strong>Usuario:</strong> ${solicitud.usuario.Nombre_Completo}</p>
                    <p><strong>Equipo:</strong> ${solicitud.ID_Num_Inv}</p>
                </div>
                <div style="margin-top: 15px;">
                    <label for="estado-equipo" style="display: block; text-align: left; margin-bottom: 5px;">
                        <strong>Estado del Equipo:</strong>
                    </label>
                    <select id="estado-equipo" class="swal2-select" style="margin: 0; width: 100%;">
                        <option value="En buen estado">En buen estado</option>
                        <option value="Con daños leves">Con daños leves</option>
                        <option value="Con daños graves">Con daños graves</option>
                        <option value="Requiere reparación">Requiere reparación</option>
                    </select>
                </div>
                <div style="margin-top: 15px;">
                    <label for="observaciones" style="display: block; text-align: left; margin-bottom: 5px;">
                        <strong>Observaciones (opcional):</strong>
                    </label>
                    <textarea id="observaciones" class="swal2-textarea" placeholder="Comentarios adicionales..." style="margin: 0;"></textarea>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Registrar Devolución',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const estadoEquipo = document.getElementById('estado-equipo').value;
                const observaciones = document.getElementById('observaciones').value;
                return { estadoEquipo, observaciones };
            }
        });

        if (result.isConfirmed) {
            try {
                const now = new Date();
                const horaActual = now.toTimeString().split(' ')[0];

                const data = {
                    Estado_Equipo_Devolucion: result.value.estadoEquipo,
                    Obs_Dev: result.value.observaciones || null,
                    Fecha_Dev: now.toISOString(),
                    Hora_Dev: horaActual
                };

                const response = await devolverPrestamo(solicitud.prestamo.ID_Prestamo, data);
                
                if (response.status === 'Success') {
                    showSuccessAlert('Devolución Registrada', 'La devolución ha sido registrada correctamente');
                    fetchSolicitudes();
                } else {
                    showErrorAlert('Error', response.message || 'No se pudo registrar la devolución');
                }
            } catch (error) {
                console.error('Error al devolver:', error);
                showErrorAlert('Error', 'Ocurrió un error al registrar la devolución');
            }
        }
    };

    // Renderizar contenido de la pestaña activa
    const renderTabContent = () => {
        return (
            <>
                <div className="section-header-with-button">
                    <h2>
                        {activeTab === 'pendientes' && '⏳ Solicitudes Pendientes'}
                        {activeTab === 'listo-entregar' && '✅ Listo para Entregar'}
                        {activeTab === 'entregados' && '📦 Listo para recepcionar'}
                        {activeTab === 'devueltos' && '🔙 Equipos Devueltos'}
                        {activeTab === 'rechazados' && '❌ Solicitudes Rechazadas'}
                        <span className="count-badge">({filteredSolicitudes.length})</span>
                    </h2>
                    
                    {/* Selector de tipo de solicitud solo para admin en pestaña pendientes */}
                    {isAdmin && !esDirectorEscuela && activeTab === 'pendientes' && (
                        <div className="tipo-solicitud-filter" style={{marginLeft: '20px'}}>
                            <select 
                                value={tipoFiltro} 
                                onChange={(e) => setTipoFiltro(e.target.value)}
                                className="tipo-filter-select"
                            >
                                <option value="diaria">📅 Solicitudes Diarias</option>
                                <option value="largo_plazo">📆 Solicitudes Largo Plazo</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="filters-section">
                    <Search 
                        value={searchText}
                        onChange={setSearchText}
                        placeholder="Buscar por usuario, email, equipo, categoría o motivo..."
                    />
                </div>

                <div className="solicitudes-table-container">
                    <table className="solicitudes-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Usuario</th>
                                <th>Equipo</th>
                                <th>Categoría</th>
                                <th>Fecha Solicitud</th>
                                {(tipoFiltro === 'largo_plazo' || esDirectorEscuela) && <th>Período Solicitado</th>}
                                <th>Motivo</th>
                                {activeTab === 'listo-entregar' && <th>Documento</th>}
                                {activeTab === 'rechazados' && <th>Motivo Rechazo</th>}
                                {activeTab === 'entregados' && <th>Documento</th>}
                                {activeTab === 'devueltos' && <th>Fecha Devolución</th>}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSolicitudes.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="no-data">
                                        No hay solicitudes {activeTab === 'pendientes' ? 'pendientes' : 
                                                           activeTab === 'listo-entregar' ? 'listas para entregar' :
                                                           activeTab === 'rechazados' ? 'rechazadas' :
                                                           activeTab === 'entregados' ? 'listas para recepcionar' : 'devueltas'}
                                    </td>
                                </tr>
                            ) : (
                                filteredSolicitudes.map((solicitud) => (
                                    <tr key={solicitud.ID_Solicitud}>
                                        <td>{solicitud.ID_Solicitud}</td>
                                        <td>
                                            <span className={`tipo-badge ${getTipoSolicitud(solicitud) === 'diaria' ? 'tipo-diaria' : 'tipo-largo'}`}>
                                                {getTipoSolicitud(solicitud) === 'diaria' ? '📅 Diaria' : '📆 Largo Plazo'}
                                            </span>
                                        </td>
                                        <td>{solicitud.usuario?.Nombre_Completo || `${solicitud.usuario?.Nombre || ''} ${solicitud.usuario?.Apellido || ''}`.trim() || 'N/A'}</td>
                                        <td>{solicitud.ID_Num_Inv}</td>
                                        <td>{solicitud.equipo?.categoria?.Descripcion || 'N/A'}</td>
                                        <td>{formatFecha(solicitud.Fecha_Sol)}</td>
                                        {(tipoFiltro === 'largo_plazo' || esDirectorEscuela) && (
                                            <td>
                                                {solicitud.Fecha_inicio_sol && solicitud.Fecha_termino_sol ? (
                                                    <div style={{fontSize: '12px'}}>
                                                        <div>📅 {new Date(solicitud.Fecha_inicio_sol).toLocaleDateString('es-CL')}</div>
                                                        <div>📅 {new Date(solicitud.Fecha_termino_sol).toLocaleDateString('es-CL')}</div>
                                                    </div>
                                                ) : '-'}
                                            </td>
                                        )}
                                        <td className="motivo-cell">{solicitud.Motivo_Sol || '-'}</td>
                                        
                                        {activeTab === 'rechazados' && (
                                            <td className="motivo-cell">
                                                {solicitud.prestamo?.autorizacion?.Obs_Aut || '-'}
                                            </td>
                                        )}
                                        
                                        {activeTab === 'entregados' && (
                                            <td>{solicitud.prestamo?.Tipo_documento || '-'}</td>
                                        )}
                                        
                                        {activeTab === 'devueltos' && (
                                            <td>{formatFecha(solicitud.prestamo?.devolucion?.Fecha_Dev)}</td>
                                        )}
                                        
                                        <td>
                                            <div className="actions-buttons">
                                                {/* Botón Ver Detalles - Siempre visible */}
                                                <button 
                                                    className="btn-detail"
                                                    title="Ver detalles"
                                                    onClick={() => handleVerDetalle(solicitud)}
                                                >
                                                    📋
                                                </button>
                                                
                                                {/* PENDIENTES: Aprobar/Rechazar (Admin=diaria, Director=largo plazo) */}
                                                {activeTab === 'pendientes' && (
                                                    <>
                                                        {((isAdmin && getTipoSolicitud(solicitud) === 'diaria') || 
                                                          (esDirectorEscuela && getTipoSolicitud(solicitud) === 'largo_plazo')) ? (
                                                            <>
                                                                <button 
                                                                    className="btn-approve"
                                                                    title="Aprobar solicitud"
                                                                    onClick={() => handleAprobar(solicitud)}
                                                                >
                                                                    ✅
                                                                </button>
                                                                <button 
                                                                    className="btn-reject"
                                                                    title="Rechazar solicitud"
                                                                    onClick={() => handleRechazar(solicitud)}
                                                                >
                                                                    ❌
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="info-badge" style={{fontSize: '12px', color: '#666'}}>
                                                                {isAdmin ? '⏳ Requiere aprobación del Director' : '👁️ Solo lectura'}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                                
                                                {/* LISTO PARA ENTREGAR: Descargar PDF (solo largo plazo) + Entregar (solo Admin) */}
                                                {activeTab === 'listo-entregar' && (
                                                    <>
                                                        {getTipoSolicitud(solicitud) === 'largo_plazo' && (
                                                            <button 
                                                                className="btn-download"
                                                                title="Descargar PDF de autorización"
                                                                onClick={() => handleDescargarPDF(solicitud)}
                                                            >
                                                                <FontAwesomeIcon icon={faFilePdf} />
                                                            </button>
                                                        )}
                                                        {isAdmin && (
                                                            <button 
                                                                className="btn-deliver"
                                                                title="Marcar como entregado"
                                                                onClick={() => handleEntregar(solicitud)}
                                                            >
                                                                📦
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                
                                                {/* ENTREGADOS: Registrar devolución (solo Admin) */}
                                                {activeTab === 'entregados' && isAdmin && (
                                                    <button 
                                                        className="btn-return"
                                                        title="Registrar devolución"
                                                        onClick={() => handleDevolver(solicitud)}
                                                    >
                                                        🔙
                                                    </button>
                                                )}
                                                
                                                {/* DEVUELTOS y RECHAZADOS: Sin acciones */}
                                                {(activeTab === 'devueltos' || activeTab === 'rechazados') && (
                                                    <span className="info-badge" style={{fontSize: '12px', color: '#666'}}>
                                                        ✓ Finalizado
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    return (
        <div className="main-container">
            <div className="solicitudes-header">
                <h1>
                    {esDirectorEscuela ? '📆 Gestión de Solicitudes a Largo Plazo' : 'Gestión de Solicitudes de Préstamo'}
                </h1>
                {esDirectorEscuela && (
                    <p style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>
                        Como Director de Escuela, puedes aprobar o rechazar solicitudes de préstamos a largo plazo
                    </p>
                )}
            </div>

            <div className="tabs-container">
                <button 
                    className={`tab-button ${activeTab === 'pendientes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pendientes')}
                >
                    ⏳ Pendientes
                </button>
                <button 
                    className={`tab-button ${activeTab === 'listo-entregar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('listo-entregar')}
                >
                    ✅ Listo para Entregar
                </button>
                <button 
                    className={`tab-button ${activeTab === 'entregados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('entregados')}
                >
                    📦 Listo para recepcionar
                </button>
                <button 
                    className={`tab-button ${activeTab === 'devueltos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('devueltos')}
                >
                    🔙 Devueltos
                </button>
                <button 
                    className={`tab-button ${activeTab === 'rechazados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rechazados')}
                >
                    ❌ Rechazados
                </button>
            </div>

            <div className="tab-content">
                {renderTabContent()}
            </div>

            {showModal && selectedSolicitud && (
                <PrestamoDetalleModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedSolicitud(null);
                    }}
                    prestamo={selectedSolicitud}
                />
            )}
        </div>
    );
};

export default GestionSolicitudes;
