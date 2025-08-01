import { useState } from 'react';
import { updateEquipo } from '@services/equipo.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatEquipoData } from '@helpers/formatData.js';

const useEditEquipo = (setEquipos) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataEquipo, setDataEquipo] = useState([]);

    const handleClickUpdate = () => {
        if (dataEquipo.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedEquipoData) => {
        if (dataEquipo.length > 0) {
            try {
                const equipoToUpdate = dataEquipo[0];
                const response = await updateEquipo(equipoToUpdate.id, updatedEquipoData);
                
                if (response.status === 'Client error') {
                    showErrorAlert('Error', response.details);
                    return;
                }

                showSuccessAlert('¡Actualizado!', 'El equipo ha sido actualizado correctamente.');
                setIsPopupOpen(false);
                setDataEquipo([]);
                
                setEquipos(prevEquipos => prevEquipos.map(equipo => 
                    equipo.id === equipoToUpdate.id 
                        ? { ...equipo, ...formatEquipoData(response) }
                        : equipo
                ));
            } catch (error) {
                console.error('Error al actualizar el equipo:', error);
                showErrorAlert('Error', 'Error al actualizar el equipo.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataEquipo,
        setDataEquipo
    };
};

export default useEditEquipo;
