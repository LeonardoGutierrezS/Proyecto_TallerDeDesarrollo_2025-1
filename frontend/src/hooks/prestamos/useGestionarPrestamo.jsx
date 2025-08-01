import { useState } from "react";
import { aprobarPrestamoService, rechazarPrestamoService, entregarPrestamoService, devolverPrestamoService } from "../../services/prestamo.service.js";
import { showErrorAlert, showSuccessAlert } from "../../helpers/sweetAlert.js";

export const useGestionarPrestamo = () => {
  const [loading, setLoading] = useState(false);

  const aprobarPrestamo = async (id, onSuccess) => {
    try {
      setLoading(true);
      const result = await aprobarPrestamoService(id);

      if (result.status === "Client error" || result.status === "Server error") {
        showErrorAlert("Error", result.message);
        return false;
      } else {
        showSuccessAlert("¡Solicitud Aprobada!", "La solicitud ha sido aprobada exitosamente. El usuario será notificado y podrá retirar el equipo.");
        if (onSuccess) onSuccess();
        return true;
      }
    } catch (error) {
      console.error("Error aprobando préstamo:", error);
      showErrorAlert("Error", "Error al aprobar la solicitud");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rechazarPrestamo = async (id, motivoRechazo, onSuccess) => {
    try {
      setLoading(true);
      const result = await rechazarPrestamoService(id, motivoRechazo);

      if (result.status === "Client error" || result.status === "Server error") {
        showErrorAlert("Error", result.message);
        return false;
      } else {
        showSuccessAlert("¡Solicitud Rechazada!", "La solicitud ha sido rechazada. El usuario recibirá una notificación con el motivo especificado.");
        if (onSuccess) onSuccess();
        return true;
      }
    } catch (error) {
      console.error("Error rechazando préstamo:", error);
      showErrorAlert("Error", "Error al rechazar la solicitud");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const entregarPrestamo = async (id, onSuccess) => {
    try {
      setLoading(true);
      const result = await entregarPrestamoService(id);

      if (result.status === "Client error" || result.status === "Server error") {
        showErrorAlert("Error", result.message);
        return false;
      } else {
        showSuccessAlert("¡Equipo Entregado!", "El préstamo ha sido marcado como entregado exitosamente. El equipo está oficialmente en posesión del usuario.");
        if (onSuccess) onSuccess();
        return true;
      }
    } catch (error) {
      console.error("Error marcando préstamo como entregado:", error);
      showErrorAlert("Error", "Error al marcar como entregado");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const devolverPrestamo = async (id, onSuccess) => {
    try {
      setLoading(true);
      const result = await devolverPrestamoService(id);

      if (result.status === "Client error" || result.status === "Server error") {
        showErrorAlert("Error", result.message);
        return false;
      } else {
        showSuccessAlert("¡Equipo Devuelto!", "El préstamo ha sido marcado como devuelto exitosamente. El equipo está de vuelta en el inventario disponible.");
        if (onSuccess) onSuccess();
        return true;
      }
    } catch (error) {
      console.error("Error marcando préstamo como devuelto:", error);
      showErrorAlert("Error", "Error al marcar como devuelto");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    aprobarPrestamo,
    rechazarPrestamo,
    entregarPrestamo,
    devolverPrestamo,
  };
};
