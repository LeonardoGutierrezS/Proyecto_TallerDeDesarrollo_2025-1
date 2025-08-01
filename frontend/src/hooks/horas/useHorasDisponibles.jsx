import { useState, useEffect } from 'react';
import {
  getHorasDisponibles,
  createHoraDisponible,
  updateHoraDisponible,
  deleteHoraDisponible,
  getHorasDisponiblesByEquipo,
  generarHorasDisponibles
} from '@services/horasDisponibles.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

export const useHorasDisponibles = () => {
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHoras = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHorasDisponibles();
      setHoras(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener horas disponibles:', err);
      setError('Error al cargar las horas disponibles');
      if (err.response?.status !== 404) {
        showErrorAlert('Error', 'No se pudieron cargar las horas disponibles');
      }
      setHoras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoras();
  }, []);

  const createHora = async (horaData) => {
    try {
      setLoading(true);
      const result = await createHoraDisponible(horaData);
      if (result.status === 'Success') {
        showSuccessAlert('¡Éxito!', 'Hora disponible creada correctamente');
        await fetchHoras();
        return true;
      } else {
        showErrorAlert('Error', result.message || 'Error al crear la hora disponible');
        return false;
      }
    } catch (err) {
      console.error('Error al crear hora:', err);
      showErrorAlert('Error', 'No se pudo crear la hora disponible');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateHora = async (id, horaData) => {
    try {
      setLoading(true);
      const result = await updateHoraDisponible(id, horaData);
      if (result.status === 'Success') {
        showSuccessAlert('¡Éxito!', 'Hora disponible actualizada correctamente');
        await fetchHoras();
        return true;
      } else {
        showErrorAlert('Error', result.message || 'Error al actualizar la hora disponible');
        return false;
      }
    } catch (err) {
      console.error('Error al actualizar hora:', err);
      showErrorAlert('Error', 'No se pudo actualizar la hora disponible');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteHora = async (id) => {
    try {
      setLoading(true);
      const result = await deleteHoraDisponible(id);
      if (result.status === 'Success') {
        showSuccessAlert('¡Éxito!', 'Hora disponible eliminada correctamente');
        await fetchHoras();
        return true;
      } else {
        showErrorAlert('Error', result.message || 'Error al eliminar la hora disponible');
        return false;
      }
    } catch (err) {
      console.error('Error al eliminar hora:', err);
      showErrorAlert('Error', 'No se pudo eliminar la hora disponible');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generarHoras = async (generacionData) => {
    try {
      setLoading(true);
      const result = await generarHorasDisponibles(generacionData);
      
      // Verificar que la respuesta sea exitosa (backend devuelve status: "Success")
      if (result.status === 'Success') {
        showSuccessAlert('¡Éxito!', result.message || `Se generaron ${result.data?.horasCreadas || 0} horas disponibles`);
        await fetchHoras();
        return true;
      } else {
        showErrorAlert('Error', result.message || 'Error al generar las horas disponibles');
        return false;
      }
    } catch (err) {
      console.error('Error al generar horas:', err);
      
      // Verificar si el error tiene respuesta del servidor
      if (err.response?.data) {
        const errorData = err.response.data;
        showErrorAlert('Error', errorData.message || 'Error al generar las horas disponibles');
      } else {
        showErrorAlert('Error', 'No se pudieron generar las horas disponibles');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshHoras = () => {
    fetchHoras();
  };

  return {
    horas,
    loading,
    error,
    createHora,
    updateHora,
    deleteHora,
    generarHoras,
    refreshHoras
  };
};

export const useHorasPorEquipo = (equipoId) => {
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHorasPorEquipo = async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getHorasDisponiblesByEquipo(id);
      setHoras(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener horas por equipo:', err);
      setError('Error al cargar las horas del equipo');
      setHoras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (equipoId) {
      fetchHorasPorEquipo(equipoId);
    }
  }, [equipoId]);

  return {
    horas,
    loading,
    error,
    refetch: () => fetchHorasPorEquipo(equipoId)
  };
};
