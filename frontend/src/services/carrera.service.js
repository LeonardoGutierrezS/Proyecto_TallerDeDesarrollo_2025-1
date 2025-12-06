import axios from './root.service.js';

/**
 * Obtiene todas las carreras disponibles para el registro
 */
export async function getCarreras() {
    try {
        const response = await axios.get('/carrera');
        // El backend retorna { status: 'Success', data: [...carreras] }
        return response.data.data || response.data || [];
    } catch (error) {
        console.error('Error al obtener carreras:', error);
        return [];
    }
}
