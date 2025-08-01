import { useState } from 'react';
import { createEquipo } from '@services/equipo.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatEquipoData } from '@helpers/formatData.js';

const useCreateEquipo = (fetchEquipos) => {
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

    const handleClickCreate = () => {
        setIsCreatePopupOpen(true);
    };

    const handleCreate = async (equipoData) => {
        try {
            const response = await createEquipo(equipoData);
            
            if (response.status === 'Client error') {
                showErrorAlert('Error', response.details);
                return;
            }

            showSuccessAlert('¡Creado!', 'El equipo ha sido creado correctamente.');
            setIsCreatePopupOpen(false);
            await fetchEquipos();
        } catch (error) {
            console.error('Error al crear el equipo:', error);
            showErrorAlert('Error', 'Error al crear el equipo.');
        }
    };

    return {
        handleClickCreate,
        handleCreate,
        isCreatePopupOpen,
        setIsCreatePopupOpen
    };
};

export default useCreateEquipo;
