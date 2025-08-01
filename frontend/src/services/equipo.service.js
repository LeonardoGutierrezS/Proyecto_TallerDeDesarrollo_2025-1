import axios from './root.service.js';

export const getEquipos = async () => {
    try {
        const { data } = await axios.get('/equipo');
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getEquipoById = async (id) => {
    try {
        const { data } = await axios.get(`/equipo/${id}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const createEquipo = async (equipoData) => {
    try {
        const { data } = await axios.post('/equipo', equipoData);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const updateEquipo = async (id, equipoData) => {
    try {
        const { data } = await axios.put(`/equipo/${id}`, equipoData);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const deleteEquipo = async (id) => {
    try {
        const { data } = await axios.delete(`/equipo/${id}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

// Servicios para obtener datos relacionados
export const getMarcas = async () => {
    try {
        const { data } = await axios.get('/marca');
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getCategorias = async () => {
    try {
        const { data } = await axios.get('/categoria');
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getEstadosAltaBaja = async () => {
    try {
        const { data } = await axios.get('/estado-alta-baja');
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}
