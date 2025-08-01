import { useState, useEffect } from 'react';
import { getMisSolicitudes, getSolicitudById, cancelarSolicitud } from '@services/solicitud.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

export const useMisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMisSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching mis solicitudes...');
      const data = await getMisSolicitudes();
      console.log('Solicitudes recibidas:', data);
      // Asegurar que siempre sea un array
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener mis solicitudes:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      // Solo mostrar error si no es un 404 (no hay solicitudes)
      if (err.response?.status !== 404) {
        setError('Error al cargar las solicitudes');
        showErrorAlert('Error', 'No se pudieron cargar las solicitudes');
      } else {
        console.log('No hay solicitudes (404), estableciendo array vacío');
        setError(null);
      }
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMisSolicitudes();
  }, []);

  const refreshSolicitudes = () => {
    fetchMisSolicitudes();
  };

  const cancelarSolicitudById = async (id) => {
    try {
      setLoading(true);
      const result = await cancelarSolicitud(id);
      if (result.state === 'Success') {
        showSuccessAlert('¡Éxito!', 'Solicitud cancelada correctamente');
        await fetchMisSolicitudes(); // Refrescar la lista
        return true;
      } else {
        showErrorAlert('Error', result.message || 'Error al cancelar la solicitud');
        return false;
      }
    } catch (err) {
      console.error('Error al cancelar solicitud:', err);
      showErrorAlert('Error', 'No se pudo cancelar la solicitud');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    solicitudes,
    loading,
    error,
    refreshSolicitudes,
    cancelarSolicitudById
  };
};

export const useSolicitudDetail = (solicitudId) => {
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSolicitudDetail = async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getSolicitudById(id);
      setSolicitud(data);
    } catch (err) {
      console.error('Error al obtener detalle de solicitud:', err);
      setError('Error al cargar el detalle');
      showErrorAlert('Error', 'No se pudo cargar el detalle de la solicitud');
      setSolicitud(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (solicitudId) {
      fetchSolicitudDetail(solicitudId);
    }
  }, [solicitudId]);

  return {
    solicitud,
    loading,
    error,
    refetch: () => fetchSolicitudDetail(solicitudId)
  };
};
