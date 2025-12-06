import '@styles/styles.css';
import '@styles/estado-solicitud.css';
import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { getMisPrestamos } from '@services/prestamo.service';
import { showErrorAlert } from '@helpers/sweetAlert';
import PrestamoDetalleModal from '@components/prestamos/PrestamoDetalleModal';

const EstadoSolicitud = () => {
    const { user } = useAuth();
    const [prestamos, setPrestamos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('en-curso'); // 'en-curso' o 'finalizadas'

    useEffect(() => {
        const fetchMisPrestamos = async () => {
            try {
                setLoading(true);
                const response = await getMisPrestamos();
                
                if (response.status === 'Success' && response.data) {
                    setPrestamos(response.data);
                } else {
                    setPrestamos([]);
                }
            } catch (error) {
                console.error('Error al obtener préstamos:', error);
                showErrorAlert('Error', 'No se pudieron cargar tus solicitudes');
                setPrestamos([]);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchMisPrestamos();
        }
    }, [user?.id]);

    // Filtrar préstamos en curso (estados 1-4)
    const prestamosEnCurso = prestamos.filter(p => 
        p.estadoPrestamo?.ID_Estado_Prestamo >= 1 && 
        p.estadoPrestamo?.ID_Estado_Prestamo <= 4
    );

    // Filtrar préstamos finalizados (estado 5: Devuelto)
    const prestamosFinalizados = prestamos.filter(p => 
        p.estadoPrestamo?.ID_Estado_Prestamo === 5
    );

    const handleVerDetalle = (prestamo) => {
        setSelectedPrestamo(prestamo);
        setShowModal(true);
    };

    const getEstadoBadgeClass = (estadoId) => {
        const clases = {
            1: 'badge-pendiente',
            2: 'badge-aprobado',
            3: 'badge-rechazado',
            4: 'badge-entregado',
            5: 'badge-devuelto'
        };
        return clases[estadoId] || 'badge-default';
    };

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

    const renderTablasPrestamos = (lista, tipo) => {
        return (
            <>
                <div className="section-header-with-button">
                    <h2>
                        {tipo === 'en-curso' ? '⏳ Solicitudes En Curso' : '✅ Solicitudes Finalizadas'}
                        <span className="count-badge">({lista.length})</span>
                    </h2>
                </div>

                <div className="solicitudes-table-container">
                    <table className="solicitudes-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Estado</th>
                                <th>Equipo</th>
                                <th>Categoría</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Término</th>
                                {tipo === 'finalizadas' && <th>Fecha Devolución</th>}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.length === 0 ? (
                                <tr>
                                    <td colSpan={tipo === 'finalizadas' ? 8 : 7} className="no-data">
                                        No tienes {tipo === 'en-curso' ? 'solicitudes en curso' : 'solicitudes finalizadas'}
                                    </td>
                                </tr>
                            ) : (
                                lista.map((prestamo) => (
                                    <tr key={prestamo.ID_Prestamo}>
                                        <td>{prestamo.ID_Prestamo}</td>
                                        <td>
                                            <span className={`estado-badge ${getEstadoBadgeClass(prestamo.estadoPrestamo?.ID_Estado_Prestamo)}`}>
                                                {prestamo.estadoPrestamo?.Estado_Prestamo || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <strong>{prestamo.ID_Num_Inv}</strong>
                                            <div className="equipo-modelo">{prestamo.equipos?.Modelo || 'N/A'}</div>
                                        </td>
                                        <td>{prestamo.categoria?.Categoria || 'N/A'}</td>
                                        <td>{formatFecha(prestamo.Fecha_inicio_prestamo)}</td>
                                        <td>{formatFecha(prestamo.Fecha_ter_prestamo)}</td>
                                        {tipo === 'finalizadas' && (
                                            <td>{formatFecha(prestamo.Fecha_devolucion)}</td>
                                        )}
                                        <td>
                                            <div className="actions-buttons">
                                                <button 
                                                    className="btn-detail"
                                                    title="Ver detalles"
                                                    onClick={() => handleVerDetalle(prestamo)}
                                                >
                                                    👁️
                                                </button>
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

    if (loading) {
        return (
            <div className="main-container">
                <div className="loading-message">
                    <p>Cargando tus solicitudes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <div className="solicitudes-header">
                <h1>Estado de Mis Solicitudes</h1>
            </div>

            <div className="tabs-container">
                <button 
                    className={`tab-button ${activeTab === 'en-curso' ? 'active' : ''}`}
                    onClick={() => setActiveTab('en-curso')}
                >
                    ⏳ En Curso
                </button>
                <button 
                    className={`tab-button ${activeTab === 'finalizadas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('finalizadas')}
                >
                    ✅ Finalizadas
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'en-curso' && renderTablasPrestamos(prestamosEnCurso, 'en-curso')}
                {activeTab === 'finalizadas' && renderTablasPrestamos(prestamosFinalizados, 'finalizadas')}
            </div>

            {showModal && selectedPrestamo && (
                <PrestamoDetalleModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedPrestamo(null);
                    }}
                    prestamo={selectedPrestamo}
                />
            )}
        </div>
    );
};

export default EstadoSolicitud;
