"use strict";
import {
  createSolicitud,
  getSolicitudes,
  getSolicitudesPorUsuario,
  getSolicitudesPendientes,
  getSolicitud,
  deleteSolicitud,
} from "../services/solicitud.service.js";
import { solicitudValidation } from "../validations/solicitud.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Crear una nueva solicitud de préstamo
 */
export async function createSolicitudController(req, res) {
  try {
    const { body } = req;

    const { error } = solicitudValidation.validate(body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [solicitud, errorSolicitud] = await createSolicitud(body);

    if (errorSolicitud) return handleErrorClient(res, 400, errorSolicitud);

    handleSuccess(res, 201, "Solicitud creada correctamente", solicitud);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener todas las solicitudes
 */
export async function getSolicitudesController(req, res) {
  try {
    const [solicitudes, errorSolicitudes] = await getSolicitudes();

    if (errorSolicitudes) return handleErrorClient(res, 404, errorSolicitudes);

    solicitudes.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Solicitudes encontradas", solicitudes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener solicitudes por usuario (RUT)
 */
export async function getSolicitudesPorUsuarioController(req, res) {
  try {
    const { rut } = req.params;

    const [solicitudes, errorSolicitudes] = await getSolicitudesPorUsuario(rut);

    if (errorSolicitudes) return handleErrorClient(res, 404, errorSolicitudes);

    solicitudes.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Solicitudes encontradas", solicitudes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener solicitudes pendientes (sin préstamo asignado)
 */
export async function getSolicitudesPendientesController(req, res) {
  try {
    const [solicitudes, errorSolicitudes] = await getSolicitudesPendientes();

    if (errorSolicitudes) return handleErrorClient(res, 404, errorSolicitudes);

    solicitudes.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Solicitudes pendientes encontradas", solicitudes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener una solicitud por ID
 */
export async function getSolicitudController(req, res) {
  try {
    const { id } = req.params;

    const [solicitud, errorSolicitud] = await getSolicitud(id);

    if (errorSolicitud) return handleErrorClient(res, 404, errorSolicitud);

    handleSuccess(res, 200, "Solicitud encontrada", solicitud);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Eliminar una solicitud
 */
export async function deleteSolicitudController(req, res) {
  try {
    const { id } = req.params;

    const [solicitud, errorSolicitud] = await deleteSolicitud(id);

    if (errorSolicitud) return handleErrorClient(res, 404, errorSolicitud);

    handleSuccess(res, 200, "Solicitud eliminada correctamente", solicitud);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
