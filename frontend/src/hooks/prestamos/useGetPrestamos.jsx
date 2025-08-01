import { useState, useEffect } from "react";
import { getPrestamosByEstadoService } from "../../services/prestamo.service.js";
import { showErrorAlert } from "../../helpers/sweetAlert.js";

export const useGetPrestamos = (estadoId = null) => {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      let result;
      
      if (estadoId) {
        result = await getPrestamosByEstadoService(estadoId);
      } else {
        // Si no se especifica estado, obtener pendientes por defecto
        result = await getPrestamosByEstadoService(1); // 1 = Pendiente
      }

      if (result.status === "Client error" || result.status === "Server error") {
        showErrorAlert("Error", result.message);
        setPrestamos([]);
      } else {
        setPrestamos(result.data || []);
      }
    } catch (error) {
      console.error("Error obteniendo préstamos:", error);
      showErrorAlert("Error", "Error al obtener las solicitudes");
      setPrestamos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrestamos();
  }, [estadoId]);

  return {
    prestamos,
    loading,
    fetchPrestamos,
  };
};
