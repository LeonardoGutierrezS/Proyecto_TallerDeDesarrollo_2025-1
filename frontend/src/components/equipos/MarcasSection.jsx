import { useState, useEffect } from 'react';
import { getMarcas } from '@services/catalogo.service';
import Search from '@components/Search';
import CreateMarcaModal from './CreateMarcaModal';

const MarcasSection = () => {
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchMarcas();
    }, []);

    const fetchMarcas = async () => {
        try {
            setLoading(true);
            const response = await getMarcas();
            if (Array.isArray(response)) {
                setMarcas(response);
            } else if (response.data && Array.isArray(response.data)) {
                setMarcas(response.data);
            }
        } catch (error) {
            console.error('Error al cargar marcas:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMarcas = marcas.filter((marca) =>
        searchText === '' || marca.Marca?.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleCreateSuccess = () => {
        fetchMarcas();
    };

    if (loading) return <div className="loading-message"><p>Cargando marcas...</p></div>;

    return (
        <>
            <CreateMarcaModal 
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            <div className="section-header-with-button">
                <h2>Gestión de Marcas <span className="count-badge">({filteredMarcas.length})</span></h2>
                <button className="btn-create" onClick={() => setShowCreateModal(true)}>
                    ➕ Crear Marca
                </button>
            </div>

            <div className="filters-section">
                <Search 
                    value={searchText}
                    onChange={setSearchText}
                    placeholder="Buscar marca..."
                />
            </div>

            <div className="catalog-table-container">
                <table className="catalog-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Marca</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMarcas.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="no-data">No hay marcas que mostrar</td>
                            </tr>
                        ) : (
                            filteredMarcas.map((marca) => (
                                <tr key={marca.ID_Marca}>
                                    <td>
                                        <span className="catalog-id-badge">{marca.ID_Marca}</span>
                                    </td>
                                    <td>
                                        <div className="catalog-name">
                                            <span className="catalog-name-icon">🏷️</span>
                                            <span>{marca.Marca}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="actions-buttons">
                                            <button 
                                                className="btn-edit"
                                                title="Editar marca"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                title="Eliminar marca"
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

export default MarcasSection;
