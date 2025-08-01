import { useState, useEffect } from 'react';
import { getEquipos } from '@services/equipo.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useGetEquipos = () => {
    const [equipos, setEquipos] = useState([]);

    const fetchEquipos = async () => {
        try {
            const response = await getEquipos();
            const formattedData = response.map(equipo => ({
                ...equipo,
                marca: equipo.marca?.nombre || 'Sin marca',
                categoria: equipo.categoria?.nombre || 'Sin categoría',
                estadoAltaBaja: equipo.estadoAltaBaja?.nombre || 'Sin estado',
                fechaAltaLab: equipo.fechaAltaLab ? new Date(equipo.fechaAltaLab).toLocaleDateString() : 'No definida',
                fechaBajaLab: equipo.fechaBajaLab ? new Date(equipo.fechaBajaLab).toLocaleDateString() : 'Activo'
            }));
            setEquipos(formattedData);
        } catch (error) {
            console.error("Error: ", error);
            showErrorAlert('Error', 'Error al obtener los equipos');
        }
    };

    useEffect(() => {
        fetchEquipos();
    }, []);

    return { equipos, fetchEquipos, setEquipos };
};

export default useGetEquipos;
