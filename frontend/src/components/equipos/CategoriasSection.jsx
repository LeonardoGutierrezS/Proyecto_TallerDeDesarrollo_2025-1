import { useState, useEffect } from 'react';
import { getCategorias } from '@services/catalogo.service';
import Search from '@components/Search';
import CreateCategoriaModal from './CreateCategoriaModal';

const CategoriasSection = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const response = await getCategorias();
            if (Array.isArray(response)) {
                setCategorias(response);
            } else if (response.data && Array.isArray(response.data)) {
                setCategorias(response.data);
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCategorias = categorias.filter((categoria) =>
        searchText === '' || categoria.Categoria?.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleCreateSuccess = () => {
        fetchCategorias();
    };

    if (loading) return <div className="loading-message"><p>Cargando categorías...</p></div>;

    return (
        <>
            <CreateCategoriaModal 
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />

            <div className="section-header-with-button">
                <h2>Gestión de Categorías <span className="count-badge">({filteredCategorias.length})</span></h2>
                <button className="btn-create" onClick={() => setShowCreateModal(true)}>
                    ➕ Crear Categoría
                </button>
            </div>

            <div className="filters-section">
                <Search 
                    value={searchText}
                    onChange={setSearchText}
                    placeholder="Buscar categoría..."
                />
            </div>

            <div className="catalog-table-container">
                <table className="catalog-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategorias.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="no-data">No hay categorías que mostrar</td>
                            </tr>
                        ) : (
                            filteredCategorias.map((categoria) => (
                                <tr key={categoria.ID_Categoria}>
                                    <td>
                                        <span className="catalog-id-badge">{categoria.ID_Categoria}</span>
                                    </td>
                                    <td>
                                        <div className="catalog-name">
                                            <span className="catalog-name-icon">📦</span>
                                            <span>{categoria.Categoria}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="actions-buttons">
                                            <button 
                                                className="btn-edit"
                                                title="Editar categoría"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                title="Eliminar categoría"
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

export default CategoriasSection;
