import { deleteEquipo } from '@services/equipo.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteEquipo = (fetchEquipos, setDataEquipo) => {
    const handleDelete = async (dataEquipos) => {
        if (dataEquipos.length === 0) return;

        const isConfirmed = await deleteDataAlert();
        if (!isConfirmed) return;

        try {
            const equiposIds = dataEquipos.map(equipo => equipo.id);
            
            for (const id of equiposIds) {
                const response = await deleteEquipo(id);
                if (response.status === 'Client error') {
                    showErrorAlert('Error', response.details);
                    return;
                }
            }

            showSuccessAlert('¡Eliminado!', 'Los equipos han sido eliminados correctamente.');
            await fetchEquipos();
            setDataEquipo([]);
        } catch (error) {
            console.error('Error al eliminar equipos:', error);
            showErrorAlert('Error', 'Error al eliminar los equipos.');
        }
    };

    return { handleDelete };
};

export default useDeleteEquipo;
