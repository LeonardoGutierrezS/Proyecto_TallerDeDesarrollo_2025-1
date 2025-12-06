import '@styles/styles.css';
import '@styles/gestion-solicitudes.css';
import { useState } from 'react';
import { useGetPrestamos } from '@hooks/prestamos/useGetPrestamos';
import Search from '@components/Search';
import PrestamoDetalleModal from '@components/prestamos/PrestamoDetalleModal';

const GestionSolicitudes = () => {
    const [activeTab, setActiveTab] = useState('pendientes');
    const { prestamos, loading, error } = useGetPrestamos();
    const [searchText, setSearchText] = useState('');
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);

    // Estados de préstamo
    const ESTADOS = {
        PENDIENTE: 'Pendiente',
        APROBADO: 'Aprobado',
        RECHAZADO: 'Rechazado',
        ENTREGADO: 'Entregado',
        DEVUELTO: 'Devuelto'
    };

    // Filtrar préstamos por estado
    const filterByEstado = (estado) => {
        return prestamos.filter(p => 
            p.estadoPrestamo?.Estado_Prestamo === estado
        );
    };

    // Filtrar por búsqueda
    const filterBySearch = (prestamosList) => {
        if (!searchText) return prestamosList;
        
        return prestamosList.filter(prestamo => {
            const searchLower = searchText.toLowerCase();
            return (
                prestamo.usuario?.Nombre?.toLowerCase().includes(searchLower) ||
                prestamo.usuario?.Apellido?.toLowerCase().includes(searchLower) ||
                prestamo.usuario?.Email?.toLowerCase().includes(searchLower) ||
                prestamo.ID_Num_Inv?.toLowerCase().includes(searchLower) ||
                prestamo.categoria?.Categoria?.toLowerCase().includes(searchLower)
            );
        });
    };

    // Obtener préstamos según la pestaña activa
    const getFilteredPrestamos = () => {
        let filtered = [];
        switch (activeTab) {
            case 'pendientes':
                filtered = filterByEstado(ESTADOS.PENDIENTE);
                break;
            case 'aprobados':
                filtered = filterByEstado(ESTADOS.APROBADO);
                break;
            case 'rechazados':
                filtered = filterByEstado(ESTADOS.RECHAZADO);
                break;
            case 'entregados':
                filtered = filterByEstado(ESTADOS.ENTREGADO);
                break;
            case 'devueltos':
                filtered = filterByEstado(ESTADOS.DEVUELTO);
                break;
            default:
                filtered = prestamos;
        }
        return filterBySearch(filtered);
    };

    const filteredPrestamos = getFilteredPrestamos();

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

    // Manejar clic en botón de detalle
    const handleVerDetalle = (prestamo) => {
        setSelectedPrestamo(prestamo);
        setShowDetalleModal(true);
    };

    // Renderizar contenido de cada pestaña
    const renderTabContent = () => {
        if (loading) return <div className="loading-message"><p>Cargando solicitudes...</p></div>;
        if (error) return <div className="error-message"><p>{error}</p></div>;

        return (
            <>
                <div className="section-header-with-button">
                    <h2>
                        {activeTab === 'pendientes' && '⏳ Solicitudes Pendientes'}
                        {activeTab === 'aprobados' && '✅ Solicitudes Aprobadas'}
                        {activeTab === 'rechazados' && '❌ Solicitudes Rechazadas'}
                        {activeTab === 'entregados' && '📦 Equipos Entregados'}
                        {activeTab === 'devueltos' && '🔙 Equipos Devueltos'}
                        <span className="count-badge">({filteredPrestamos.length})</span>
                    </h2>
                </div>

                <div className="filters-section">
                    <Search 
                        value={searchText}
                        onChange={setSearchText}
                        placeholder="Buscar por usuario, email, equipo o categoría..."
                    />
                </div>

                <div className="solicitudes-table-container">
                    <table className="solicitudes-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Equipo</th>
                                <th>Categoría</th>
                                <th>Fecha Solicitud</th>
                                {activeTab === 'aprobados' && <th>Fecha Término</th>}
                                {activeTab === 'rechazados' && <th>Motivo Rechazo</th>}
                                {activeTab === 'entregados' && <th>Documento</th>}
                                {activeTab === 'devueltos' && <th>Fecha Devolución</th>}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPrestamos.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="no-data">
                                        No hay solicitudes {activeTab === 'pendientes' ? 'pendientes' : 
                                                           activeTab === 'aprobados' ? 'aprobadas' :
                                                           activeTab === 'rechazados' ? 'rechazadas' :
                                                           activeTab === 'entregados' ? 'entregadas' : 'devueltas'}
                                    </td>
                                </tr>
                            ) : (
                                filteredPrestamos.map((prestamo) => (
                                    <tr key={prestamo.ID_Prestamo}>
                                        <td>{prestamo.ID_Prestamo}</td>
                                        <td>{prestamo.usuario?.Nombre} {prestamo.usuario?.Apellido}</td>
                                        <td>{prestamo.usuario?.Email}</td>
                                        <td>{prestamo.ID_Num_Inv}</td>
                                        <td>{prestamo.categoria?.Categoria}</td>
                                        <td>{formatFecha(prestamo.Fecha_inicio_prestamo)}</td>
                                        
                                        {activeTab === 'aprobados' && (
                                            <td>{formatFecha(prestamo.Fecha_ter_prestamo)}</td>
                                        )}
                                        
                                        {activeTab === 'rechazados' && (
                                            <td className="motivo-cell">
                                                {prestamo.Motivo_Rechazo || '-'}
                                            </td>
                                        )}
                                        
                                        {activeTab === 'entregados' && (
                                            <td>{prestamo.Retencion_documento || '-'}</td>
                                        )}
                                        
                                        {activeTab === 'devueltos' && (
                                            <td>{formatFecha(prestamo.Fecha_devolucion)}</td>
                                        )}
                                        
                                        <td>
                                            <div className="actions-buttons">
                                                {activeTab === 'pendientes' && (
                                                    <>
                                                        <button 
                                                            className="btn-approve"
                                                            title="Aprobar solicitud"
                                                        >
                                                            ✅
                                                        </button>
                                                        <button 
                                                            className="btn-reject"
                                                            title="Rechazar solicitud"
                                                        >
                                                            ❌
                                                        </button>
                                                    </>
                                                )}
                                                {activeTab === 'aprobados' && (
                                                    <button 
                                                        className="btn-deliver"
                                                        title="Marcar como entregado"
                                                    >
                                                        📦
                                                    </button>
                                                )}
                                                {activeTab === 'entregados' && (
                                                    <button 
                                                        className="btn-return"
                                                        title="Registrar devolución"
                                                    >
                                                        🔙
                                                    </button>
                                                )}
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

    return (
        <div className="main-container">
            <PrestamoDetalleModal 
                show={showDetalleModal}
                onClose={() => setShowDetalleModal(false)}
                prestamo={selectedPrestamo}
            />

            <div className="solicitudes-header">
                <h1>Gestión de Solicitudes de Préstamo</h1>
            </div>

            <div className="tabs-container">
                <button 
                    className={`tab-button ${activeTab === 'pendientes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pendientes')}
                >
                    ⏳ Pendientes
                </button>
                <button 
                    className={`tab-button ${activeTab === 'aprobados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('aprobados')}
                >
                    ✅ Aprobados
                </button>
                <button 
                    className={`tab-button ${activeTab === 'rechazados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rechazados')}
                >
                    ❌ Rechazados
                </button>
                <button 
                    className={`tab-button ${activeTab === 'entregados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('entregados')}
                >
                    📦 Entregados
                </button>
                <button 
                    className={`tab-button ${activeTab === 'devueltos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('devueltos')}
                >
                    🔙 Devueltos
                </button>
            </div>

            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default GestionSolicitudes;
