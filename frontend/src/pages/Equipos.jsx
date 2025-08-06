import Table from '@components/Table';
import useGetEquipos from '@hooks/equipos/useGetEquipos.jsx';
import useEditEquipo from '@hooks/equipos/useEditEquipo.jsx';
import useDeleteEquipo from '@hooks/equipos/useDeleteEquipo.jsx';
import useCreateEquipo from '@hooks/equipos/useCreateEquipo.jsx';
import Search from '../components/Search';
import Popup from '../components/Popup';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/equipos.css';

const Equipos = () => {
  const { equipos, fetchEquipos, setEquipos } = useGetEquipos();
  const [filterSerie, setFilterSerie] = useState('');

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataEquipo,
    setDataEquipo
  } = useEditEquipo(setEquipos);

  const {
    handleClickCreate,
    handleCreate,
    isCreatePopupOpen,
    setIsCreatePopupOpen
  } = useCreateEquipo(fetchEquipos);

  const { handleDelete } = useDeleteEquipo(fetchEquipos, setDataEquipo);

  const handleSerieFilterChange = (e) => {
    setFilterSerie(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedEquipos) => {
    setDataEquipo(selectedEquipos);
  }, [setDataEquipo]);

  const columns = [
    { title: "Marca", field: "marca", width: 150, responsive: 2 },
    { title: "Modelo", field: "modelo", width: 200, responsive: 0 },
    { title: "N° Serie", field: "numeroDeSerie", width: 150, responsive: 1 },
    { title: "Categoría", field: "categoria", width: 150, responsive: 2 },
    { title: "Estado", field: "estadoAltaBaja", width: 150, responsive: 3 },
    { title: "Fecha Alta", field: "fechaAltaLab", width: 120, responsive: 3 },
    { title: "Fecha Baja", field: "fechaBajaLab", width: 120, responsive: 3 }
  ];

  return (
    <div className='equipos-main-container'>
      <div className='equipos-table-container'>
        <div className='equipos-top-table'>
          <h1 className='equipos-title-table'>Gestión de Equipos</h1>
          <div className='equipos-filter-actions'>
            <Search 
              value={filterSerie} 
              onChange={handleSerieFilterChange} 
              placeholder={'Filtrar por número de serie'} 
            />
            <button 
              className='equipos-add-button'
              onClick={handleClickCreate}
              title="Agregar equipo"
            >
              + AGREGAR
            </button>
            <button 
              className='equipos-action-button'
              onClick={handleClickUpdate} 
              disabled={dataEquipo.length === 0}
              title="Editar equipo"
            >
              {dataEquipo.length === 0 ? (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              ) : (
                <img src={UpdateIcon} alt="edit" />
              )}
            </button>
            <button 
              className='equipos-action-button' 
              disabled={dataEquipo.length === 0} 
              onClick={() => handleDelete(dataEquipo)}
              title="Eliminar equipo"
            >
              {dataEquipo.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>
        <div className='equipos-table-wrapper'>
          <Table
            data={equipos}
            columns={columns}
            filter={filterSerie}
            dataToFilter={'numeroDeSerie'}
            initialSortName={'modelo'}
            onSelectionChange={handleSelectionChange}
          />
        </div>
      </div>
      
      {/* Popup para editar equipo */}
      <Popup 
        show={isPopupOpen} 
        setShow={setIsPopupOpen} 
        data={dataEquipo} 
        action={handleUpdate}
        type="equipo"
      />
      
      {/* Popup para crear equipo */}
      <Popup 
        show={isCreatePopupOpen} 
        setShow={setIsCreatePopupOpen} 
        data={[]} 
        action={handleCreate}
        type="equipo"
        isCreate={true}
      />
    </div>
  );
};

export default Equipos;
