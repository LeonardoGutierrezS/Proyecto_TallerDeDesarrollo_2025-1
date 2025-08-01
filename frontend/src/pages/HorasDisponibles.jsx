import { useState } from 'react';
import { useHorasDisponibles } from '@hooks/horas/useHorasDisponibles.jsx';
import { getEquipos, getCategorias } from '@services/equipo.service.js';
import { deleteDataAlert, showConfirmAlert } from '@helpers/sweetAlert.js';
import HoraDisponibleModal from '@components/HoraDisponibleModal.jsx';
import GenerarHorasModal from '@components/GenerarHorasModal.jsx';
import CustomTable from '@components/CustomTable.jsx';
import '@styles/horas-disponibles.css';

const HorasDisponibles = () => {
  const { horas, loading, createHora, updateHora, deleteHora, generarHoras, refreshHoras } = useHorasDisponibles();
  const [selectedHora, setSelectedHora] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerarModalOpen, setIsGenerarModalOpen] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEquipo, setFiltroEquipo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useState(() => {
    const fetchData = async () => {
      try {
        const [equiposData, categoriasData] = await Promise.all([
          getEquipos(),
          getCategorias()
        ]);
        console.log('Equipos cargados:', equiposData);
        console.log('Categorías cargadas:', categoriasData);
        setEquipos(Array.isArray(equiposData) ? equiposData : []);
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    try {
      // Crear la fecha sin conversión de zona horaria
      const fechaLocal = new Date(fecha + 'T00:00:00');
      return fechaLocal.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const formatHora = (hora) => {
    if (!hora.hora) return 'No especificada';
    // Formatear la hora del formato HH:MM:SS a HH:MM
    return hora.hora.substring(0, 5);
  };

  // Función helper para obtener equipos filtrados por categoría
  const getEquiposFiltrados = () => {
    if (!filtroCategoria || filtroCategoria === '') {
      console.log('Sin filtro de categoría, devolviendo todos los equipos:', equipos.length);
      return equipos;
    }
    
    const equiposFiltrados = equipos.filter(equipo => {
      const equipoCategoriaId = equipo.categoria?.id;
      const filtroId = parseInt(filtroCategoria);
      const coincide = equipoCategoriaId === filtroId;
      
      if (!coincide) {
        console.log(`Equipo ${equipo.modelo} filtrado: categoría=${equipoCategoriaId}, filtro=${filtroId}`);
      }
      
      return coincide;
    });
    
    console.log(`Equipos filtrados por categoría ${filtroCategoria}:`, equiposFiltrados);
    return equiposFiltrados;
  };

  // Configuración de columnas para la tabla
  const columns = [
    {
      header: 'ID',
      key: 'id',
      sortable: true,
      width: '80px'
    },
    {
      header: 'Equipo',
      key: 'equipo',
      sortable: true,
      render: (hora) => (
        <div style={{ fontWeight: '600', color: '#003366' }}>
          {hora.equipo ? `${hora.equipo.modelo} - ${hora.equipo.marca?.nombre}` : 'Sin equipo'}
        </div>
      )
    },
    {
      header: 'Fecha',
      key: 'fecha',
      sortable: true,
      render: (hora) => (
        <div style={{ fontWeight: '500' }}>
          {formatFecha(hora.fecha)}
        </div>
      )
    },
    {
      header: 'Hora',
      key: 'hora',
      sortable: true,
      render: (hora) => (
        <div style={{ fontWeight: '600', fontSize: '16px', color: '#004d99' }}>
          {formatHora(hora)}
        </div>
      ),
      width: '100px'
    },
    {
      header: 'Estado',
      key: 'disponible',
      sortable: true,
      render: (hora) => (
        <span className={`custom-status-badge ${hora.disponible ? 'disponible' : 'ocupado'}`}>
          {hora.disponible ? 'Disponible' : 'Ocupado'}
        </span>
      ),
      width: '120px'
    },
    {
      header: 'Acciones',
      key: 'acciones',
      render: (hora) => (
        <div className='custom-table-actions'>
          <button 
            onClick={() => handleEditHora(hora)} 
            className='custom-edit-btn'
            disabled={loading}
            title='Editar horario'
          >
            ✏️
          </button>
          <button 
            onClick={() => handleDeleteHora(hora)} 
            className='custom-delete-btn'
            disabled={loading}
            title='Eliminar horario'
          >
            🗑️
          </button>
        </div>
      ),
      width: '120px'
    }
  ];

  const horasFiltradas = horas.filter(hora => {
    // Debug: Log de la estructura de datos
    if (horas.length > 0 && horas.indexOf(hora) === 0) {
      console.log('Estructura de hora:', {
        hora: hora,
        equipo: hora.equipo,
        categoria: hora.equipo?.categoria,
        categoriaId: hora.equipo?.categoria?.id,
        equipoId: hora.equipo?.id
      });
      console.log('Filtros activos:', {
        filtroCategoria,
        filtroEquipo,
        filtroFecha
      });
    }

    // Filtro por categoría
    let coincideCategoria = true;
    if (filtroCategoria && filtroCategoria !== '') {
      coincideCategoria = hora.equipo?.categoria?.id?.toString() === filtroCategoria.toString();
    }

    // Filtro por equipo
    let coincideEquipo = true;
    if (filtroEquipo && filtroEquipo !== '') {
      coincideEquipo = hora.equipo?.id?.toString() === filtroEquipo.toString();
    }
    
    // Filtro por fecha
    let coincideFecha = true;
    if (filtroFecha && filtroFecha !== '') {
      try {
        // Crear fechas sin conversión de zona horaria para comparación exacta
        const fechaHora = new Date(hora.fecha + 'T00:00:00');
        const fechaFiltro = new Date(filtroFecha + 'T00:00:00');
        coincideFecha = fechaHora.toDateString() === fechaFiltro.toDateString();
      } catch (error) {
        console.error('Error al comparar fechas:', error);
        coincideFecha = false;
      }
    }

    const resultado = coincideCategoria && coincideEquipo && coincideFecha;
    
    // Debug: Log del resultado del filtro para la primera hora
    if (horas.length > 0 && horas.indexOf(hora) === 0) {
      console.log('Resultado del filtro:', {
        coincideCategoria,
        coincideEquipo,
        coincideFecha,
        resultado
      });
    }
    
    return resultado;
  });

  const handleCreateHora = () => {
    setSelectedHora(null);
    setIsModalOpen(true);
  };

  const handleEditHora = (hora) => {
    setSelectedHora(hora);
    setIsModalOpen(true);
  };

  const handleDeleteHora = async (hora) => {
    const result = await deleteDataAlert();
    if (result.isConfirmed) {
      await deleteHora(hora.id);
    }
  };

  const handleSubmitHora = async (horaData) => {
    let success;
    if (selectedHora) {
      success = await updateHora(selectedHora.id, horaData);
    } else {
      success = await createHora(horaData);
    }
    
    if (success) {
      setIsModalOpen(false);
      setSelectedHora(null);
    }
  };

  const handleGenerarHoras = async (generacionData) => {
    const success = await generarHoras(generacionData);
    if (success) {
      setIsGenerarModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHora(null);
  };

  const getEstadisticas = () => {
    const total = horas.length;
    const porEquipo = {};
    const porFecha = {};
    
    horas.forEach(hora => {
      const equipoNombre = hora.equipo?.modelo || 'Sin equipo';
      // Crear fecha sin conversión de zona horaria
      const fechaLocal = new Date(hora.fecha + 'T00:00:00');
      const fecha = fechaLocal.toDateString();
      
      porEquipo[equipoNombre] = (porEquipo[equipoNombre] || 0) + 1;
      porFecha[fecha] = (porFecha[fecha] || 0) + 1;
    });

    return { total, porEquipo, porFecha };
  };

  const stats = getEstadisticas();

  if (loading && horas.length === 0) {
    return (
      <div className='horas-disponibles-main-container'>
        <div className='horas-loading-section'>
          <div className='horas-loading-spinner'></div>
          <h3>Cargando horas disponibles...</h3>
          <p>Por favor espera mientras cargan los datos</p>
        </div>
      </div>
    );
  }

  return (
    <div className='horas-disponibles-main-container'>
      {/* Hero Section */}
      <div className='horas-hero-section'>
        <div className='horas-hero-content'>
          <h1 className='horas-hero-title'>
            Gestión de Horas Disponibles
          </h1>
          <p className='horas-hero-subtitle'>
            Administra la disponibilidad de horarios para cada equipo del laboratorio
          </p>
          <div className='horas-hero-stats'>
            <div className='horas-hero-stat'>
              <span className='stat-number'>{stats.total}</span>
              <span className='stat-label'>Horarios Totales</span>
            </div>
            <div className='horas-hero-stat'>
              <span className='stat-number'>{Object.keys(stats.porEquipo).length}</span>
              <span className='stat-label'>Equipos con Horarios</span>
            </div>
            <div className='horas-hero-stat'>
              <span className='stat-number'>{Object.keys(stats.porFecha).length}</span>
              <span className='stat-label'>Fechas Disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className='horas-controls-section'>
        <div className='horas-controls-card'>
          <div className='horas-controls-header'>
            <h3>Filtros y Acciones</h3>
            <p>Utiliza los filtros para encontrar horarios específicos</p>
          </div>
          
          <div className='horas-controls-content'>
            <div className='horas-filters-group'>
              <div className='horas-filter-item'>
                <label htmlFor='filter-categoria'>Filtrar por Categoría</label>
                <select 
                  id='filter-categoria'
                  value={filtroCategoria} 
                  onChange={(e) => {
                    const nuevaCategoria = e.target.value;
                    console.log('Cambiando categoría a:', nuevaCategoria);
                    console.log('Categorías disponibles:', categorias);
                    setFiltroCategoria(nuevaCategoria);
                    setFiltroEquipo(''); // Resetear filtro de equipo cuando cambia categoría
                  }}
                  className='horas-filter-select'
                >
                  <option value=''>Todas las categorías</option>
                  {categorias.map(categoria => {
                    console.log('Renderizando categoría:', categoria);
                    return (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className='horas-filter-item'>
                <label htmlFor='filter-equipo'>
                  Filtrar por Equipo 
                  <span style={{ color: '#059669', fontSize: '12px', marginLeft: '8px' }}>
                    ({getEquiposFiltrados().length} disponibles)
                  </span>
                </label>
                <select 
                  id='filter-equipo'
                  value={filtroEquipo} 
                  onChange={(e) => {
                    const nuevoEquipo = e.target.value;
                    console.log('Cambiando equipo a:', nuevoEquipo);
                    setFiltroEquipo(nuevoEquipo);
                  }}
                  className='horas-filter-select'
                >
                  <option value=''>Todos los equipos</option>
                  {getEquiposFiltrados().map(equipo => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.modelo} - {equipo.marca?.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className='horas-filter-item'>
                <label htmlFor='filter-fecha'>Filtrar por Fecha</label>
                <input
                  id='filter-fecha'
                  type='date'
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  className='horas-filter-date'
                />
              </div>

              <div className='horas-filter-item'>
                <label>&nbsp;</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={refreshHoras} className='horas-refresh-btn'>
                    🔄 Actualizar
                  </button>
                  <button 
                    onClick={() => {
                      setFiltroCategoria('');
                      setFiltroEquipo('');
                      setFiltroFecha('');
                      console.log('Filtros limpiados');
                    }} 
                    className='horas-refresh-btn'
                    style={{ backgroundColor: '#dc2626', color: 'white', borderColor: '#dc2626' }}
                  >
                    🗑️ Limpiar
                  </button>
                </div>
              </div>
            </div>

            <div className='horas-actions-group'>
              <button 
                onClick={() => setIsGenerarModalOpen(true)} 
                className='horas-action-btn horas-generate-btn'
              >
                ⚡ Generar Horarios
              </button>
              <button 
                onClick={handleCreateHora} 
                className='horas-action-btn horas-create-btn'
              >
                ➕ Crear Horario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className='horas-table-section'>
        <div style={{ 
          marginBottom: '20px', 
          textAlign: 'center', 
          color: '#003366', 
          fontWeight: '600',
          fontSize: '16px'
        }}>
          Mostrando {horasFiltradas.length} de {horas.length} horarios
          {(filtroCategoria || filtroEquipo || filtroFecha) && (
            <span style={{ color: '#059669', marginLeft: '10px' }}>
              (Filtros aplicados ✓)
            </span>
          )}
        </div>
        <CustomTable
          data={horasFiltradas}
          columns={columns}
          title=""
          subtitle=""
          showSearch={false}
          showPagination={true}
          pageSize={15}
          loading={loading && horas.length === 0}
        />
      </div>

      {/* Modales */}
      <HoraDisponibleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitHora}
        horaInicial={selectedHora}
        equipos={equipos}
        loading={loading}
      />

      <GenerarHorasModal
        isOpen={isGenerarModalOpen}
        onClose={() => setIsGenerarModalOpen(false)}
        onSubmit={handleGenerarHoras}
        equipos={equipos}
        loading={loading}
      />
    </div>
  );
};

export default HorasDisponibles;
