import '@styles/styles.css';
import '@styles/gestion-equipos.css';
import { useState } from 'react';
import { useGetEquipos } from '@hooks/equipos/useGetEquipos';
import Search from '@components/Search';
import MarcasSection from '@components/equipos/MarcasSection';
import CategoriasSection from '@components/equipos/CategoriasSection';
import EstadosSection from '@components/equipos/EstadosSection';
import CreateEquipoModal from '@components/equipos/CreateEquipoModal';

const GestionEquipos = () => {
    const [activeTab, setActiveTab] = useState('equipos');
    const { equipos, loading, error, refetch } = useGetEquipos();
    const [searchText, setSearchText] = useState('');
    const [filterMarca, setFilterMarca] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');
    const [filterDisponible, setFilterDisponible] = useState('');
    const [showCreateEquipoModal, setShowCreateEquipoModal] = useState(false);

    // Filtrar equipos según los filtros aplicados
    const filteredEquipos = equipos.filter((equipo) => {
        const matchesSearch = searchText === '' || 
            equipo.ID_Num_Inv?.toLowerCase().includes(searchText.toLowerCase()) ||
            equipo.Modelo?.toLowerCase().includes(searchText.toLowerCase()) ||
            equipo.Numero_Serie?.toLowerCase().includes(searchText.toLowerCase());

        const matchesMarca = filterMarca === '' || 
            equipo.marca?.Marca === filterMarca;

        const matchesCategoria = filterCategoria === '' || 
            equipo.categoria?.Categoria === filterCategoria;

        const matchesDisponible = filterDisponible === '' || 
            (filterDisponible === 'Disponible' ? equipo.Disponible === true : equipo.Disponible === false);

        return matchesSearch && matchesMarca && matchesCategoria && matchesDisponible;
    });

    // Obtener valores únicos para los filtros
    const marcas = [...new Set(equipos.map(e => e.marca?.Marca).filter(Boolean))];
    const categorias = [...new Set(equipos.map(e => e.categoria?.Categoria).filter(Boolean))];

    // Renderizar tabs
    const renderTabContent = () => {
        switch (activeTab) {
            case 'equipos':
                return renderEquiposSection();
            case 'marcas':
                return <MarcasSection />;
            case 'categorias':
                return <CategoriasSection />;
            case 'estados':
                return <EstadosSection />;
            default:
                return renderEquiposSection();
        }
    };

    const handleCreateEquipoSuccess = () => {
        refetch();
    };

    const renderEquiposSection = () => {
        if (loading) return <div className="loading-message"><p>Cargando equipos...</p></div>;
        if (error) return <div className="error-message"><p>{error}</p></div>;

        return (
            <>
                <CreateEquipoModal 
                    show={showCreateEquipoModal}
                    onClose={() => setShowCreateEquipoModal(false)}
                    onSuccess={handleCreateEquipoSuccess}
                />

                <div className="section-header-with-button">
                    <h2>Gestión de Equipos</h2>
                    <button className="btn-create" onClick={() => setShowCreateEquipoModal(true)}>
                        ➕ Crear Equipo
                    </button>
                </div>

                <div className="filters-section">
                    <Search 
                        value={searchText}
                        onChange={setSearchText}
                        placeholder="Buscar por N° Inv, Modelo o N° Serie..."
                    />

                    <div className="filters-row">
                        <select 
                            value={filterMarca}
                            onChange={(e) => setFilterMarca(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todas las marcas</option>
                            {marcas.map((marca) => (
                                <option key={marca} value={marca}>{marca}</option>
                            ))}
                        </select>

                        <select 
                            value={filterCategoria}
                            onChange={(e) => setFilterCategoria(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map((categoria) => (
                                <option key={categoria} value={categoria}>{categoria}</option>
                            ))}
                        </select>

                        <select 
                            value={filterDisponible}
                            onChange={(e) => setFilterDisponible(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todos los estados</option>
                            <option value="Disponible">Disponible</option>
                            <option value="No Disponible">No Disponible</option>
                        </select>
                    </div>
                </div>

                <div className="equipos-table-container">
                    <table className="equipos-table">
                        <thead>
                            <tr>
                                <th>N° Inventario</th>
                                <th>Modelo</th>
                                <th>N° Serie</th>
                                <th>Marca</th>
                                <th>Categoría</th>
                                <th>Estado</th>
                                <th>Disponible</th>
                                <th>Comentarios</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipos.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="no-data">No hay equipos que mostrar</td>
                                </tr>
                            ) : (
                                filteredEquipos.map((equipo) => (
                                    <tr key={equipo.ID_Num_Inv}>
                                        <td>{equipo.ID_Num_Inv}</td>
                                        <td>{equipo.Modelo}</td>
                                        <td>{equipo.Numero_Serie}</td>
                                        <td>{equipo.marca?.Marca || 'N/A'}</td>
                                        <td>{equipo.categoria?.Categoria || 'N/A'}</td>
                                        <td>{equipo.estado?.Estado || 'N/A'}</td>
                                        <td>
                                            <span className={`disponible-badge ${equipo.Disponible ? 'disponible' : 'no-disponible'}`}>
                                                {equipo.Disponible ? 'Sí' : 'No'}
                                            </span>
                                        </td>
                                        <td className="comentarios-cell">
                                            {equipo.Comentarios || '-'}
                                        </td>
                                        <td>
                                            <div className="actions-buttons">
                                                <button 
                                                    className="btn-edit"
                                                    title="Editar equipo"
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    title="Eliminar equipo"
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

    return (
        <div className="main-container">
            <div className="equipos-header">
                <h1>Gestión de Equipos</h1>
            </div>

            <div className="tabs-container">
                <button 
                    className={`tab-button ${activeTab === 'equipos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('equipos')}
                >
                    Equipos
                </button>
                <button 
                    className={`tab-button ${activeTab === 'marcas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('marcas')}
                >
                    Marcas
                </button>
                <button 
                    className={`tab-button ${activeTab === 'categorias' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categorias')}
                >
                    Categorías
                </button>
                <button 
                    className={`tab-button ${activeTab === 'estados' ? 'active' : ''}`}
                    onClick={() => setActiveTab('estados')}
                >
                    Estados
                </button>
            </div>

            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default GestionEquipos;
