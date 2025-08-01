import axios from "./root.service.js";

// Obtener todos los préstamos
export async function getPrestamosService() {
  try {
    const response = await axios.get("/prestamo/");
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
}

// Obtener préstamos por estado
export async function getPrestamosByEstadoService(estadoId) {
  try {
    const response = await axios.get(`/prestamo/estado/${estadoId}`);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
}

// Crear solicitud de préstamo
export async function createPrestamoService(prestamoData) {
  try {
    const response = await axios.post("/prestamo/", prestamoData);
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
}

// Aprobar préstamo
export async function aprobarPrestamoService(id) {
  try {
    const response = await axios.patch(`/prestamo/approve/`, { id });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
}

// Rechazar préstamo
export async function rechazarPrestamoService(id, motivoRechazo) {
  try {
    const response = await axios.patch(`/prestamo/reject/`, { 
      id, 
      motivoRechazo 
    });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
}

// Marcar como entregado
export async function entregarPrestamoService(id) {
  try {
    const response = await axios.patch(`/prestamo/deliver/`, { id });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
}

// Marcar como devuelto
export async function devolverPrestamoService(id) {
  try {
    const response = await axios.patch(`/prestamo/return/`, { id });
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
}
