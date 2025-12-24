import { useState, useEffect } from 'react';
import { getEstados } from '@services/catalogo.service';
import Search from '@components/Search';
import CreateEstadoModal from './CreateEstadoModal';

const EstadosSection = () => {
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchEstados();
    }, []);

    const fetchEstados = async () => {
        try {
            setLoading(true);
            const response = await getEstados();
            if (Array.isArray(response)) {
                setEstados(response);
            } else if (response.data && Array.isArray(response.data)) {
                setEstados(response.data);
            }
        } catch (error) {
            console.error('Error al cargar estados:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEstados = estados.filter((estado) =>
        searchText === '' || estado.Descripcion?.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleCreateSuccess = () => {
        fetchEstados();
    };

    if (loading) return <div className="loading-message"><p>Cargando estados...</p></div>;

    return (
        <>
            <CreateEstadoModal 
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            <div className="section-header-with-button">
                <h2>Gestión de Estados <span className="count-badge">({filteredEstados.length})</span></h2>
                <button className="btn-create" onClick={() => setShowCreateModal(true)}>
                    ➕ Crear Estado
                </button>
            </div>

            <div className="filters-section">
                <Search 
                    value={searchText}
                    onChange={setSearchText}
                    placeholder="Buscar estado..."
                />
            </div>

            <div className="equipos-table-container">
                <table className="equipos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEstados.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="no-data">No hay estados que mostrar</td>
                            </tr>
                        ) : (
                            filteredEstados.map((estado) => (
                                <tr key={estado.Cod_Estado}>
                                    <td>
                                        <span className="id-badge">{estado.Cod_Estado}</span>
                                    </td>
                                    <td>
                                        <div className="estado-name">
                                            <span className="estado-icon">🔧</span>
                                            <span className="estado-text">{estado.Descripcion}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="actions-buttons">
                                            <button 
                                                className="btn-edit"
                                                title="Editar estado"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                title="Eliminar estado"
                                            >
                                                🗑️
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

export default EstadosSection;
