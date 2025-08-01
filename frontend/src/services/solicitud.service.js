import axios from './root.service.js';

// Servicios para solicitudes/préstamos
export const createSolicitud = async (solicitudData) => {
    try {
        const { data } = await axios.post('/prestamo', solicitudData);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getMisSolicitudes = async () => {
    try {
        const { data } = await axios.get('/prestamo/my-prestamos/');
        return data.data || [];
    } catch (error) {
        console.error('Error en getMisSolicitudes:', error);
        // Si es un 404, simplemente retorna un array vacío
        if (error.response?.status === 404) {
            return [];
        }
        // Para otros errores, lanza la excepción para que el hook la maneje
        throw error;
    }
}

export const getSolicitudById = async (id) => {
    try {
        const { data } = await axios.get(`/prestamo/detail/?id=${id}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const cancelarSolicitud = async (id) => {
    try {
        const { data } = await axios.delete(`/prestamo/detail/?id=${id}`);
        return data;
    } catch (error) {
        return error.response.data;
    }
}

// Servicios para obtener datos relacionados
export const getCategorias = async () => {
    try {
        const { data } = await axios.get('/categoria');
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getEquiposByCategoria = async (categoriaId) => {
    try {
        const { data } = await axios.get(`/equipo/categoria/?categoriaId=${categoriaId}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getHorasDisponiblesByEquipo = async (equipoId) => {
    try {
        const { data } = await axios.get(`/horas-disponibles/equipo/?equipoId=${equipoId}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getHorasRealmenteDisponiblesByEquipo = async (equipoId, fecha = null) => {
    try {
        const params = new URLSearchParams({ equipoId });
        if (fecha) params.append('fecha', fecha);
        
        const { data } = await axios.get(`/horas-disponibles/equipo/disponibles/?${params}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getRangosHorariosDisponibles = async (equipoId, fecha) => {
    try {
        const { data } = await axios.get(`/horas-disponibles/equipo/rangos/?equipoId=${equipoId}&fecha=${fecha}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getHorasDisponiblesByFecha = async (fecha) => {
    try {
        const { data } = await axios.get(`/horas-disponibles/fecha/?fecha=${fecha}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}