import axios from './root.service.js';

// Servicios para gestión de horas disponibles (ADMIN)
export const createHoraDisponible = async (horaData) => {
    try {
        const { data } = await axios.post('/horas-disponibles', horaData);
        return data;
    } catch (error) {
        throw error;
    }
}

export const getHorasDisponibles = async () => {
    try {
        const { data } = await axios.get('/horas-disponibles');
        return data.data || [];
    } catch (error) {
        console.error('Error en getHorasDisponibles:', error);
        if (error.response?.status === 404) {
            return [];
        }
        throw error;
    }
}

export const updateHoraDisponible = async (id, horaData) => {
    try {
        const { data } = await axios.put(`/horas-disponibles/detail/?id=${id}`, horaData);
        return data;
    } catch (error) {
        throw error;
    }
}

export const deleteHoraDisponible = async (id) => {
    try {
        const { data } = await axios.delete(`/horas-disponibles/detail/?id=${id}`);
        return data;
    } catch (error) {
        throw error;
    }
}

export const getHoraDisponibleById = async (id) => {
    try {
        const { data } = await axios.get(`/horas-disponibles/detail/?id=${id}`);
        return data.data;
    } catch (error) {
        throw error;
    }
}

export const getHorasDisponiblesByEquipo = async (equipoId) => {
    try {
        const { data } = await axios.get(`/horas-disponibles/equipo/?equipoId=${equipoId}`);
        return data.data || [];
    } catch (error) {
        console.error('Error en getHorasDisponiblesByEquipo:', error);
        if (error.response?.status === 404) {
            return [];
        }
        throw error;
    }
}

export const getHorasDisponiblesByFecha = async (fecha) => {
    try {
        const { data } = await axios.get(`/horas-disponibles/fecha/?fecha=${fecha}`);
        return data.data || [];
    } catch (error) {
        console.error('Error en getHorasDisponiblesByFecha:', error);
        if (error.response?.status === 404) {
            return [];
        }
        throw error;
    }
}

// Función para generar horas automáticamente
export const generarHorasDisponibles = async (generacionData) => {
    try {
        const { data } = await axios.post('/horas-disponibles/generar', generacionData);
        return data;
    } catch (error) {
        throw error;
    }
}
