"use strict";
import {
  asignarPenalizacion,
  getTienePenalizaciones,
  getPenalizacionesPorUsuario,
  getPenalizacionesActivas,
  finalizarPenalizacion,
} from "../services/tiene_penalizacion.service.js";
import {
  asignarPenalizacionValidation,
  finalizarPenalizacionValidation,
} from "../validations/tiene_penalizacion.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Asignar una penalización a un usuario
 */
export async function asignarPenalizacionController(req, res) {
  try {
    const { body } = req;

    const { error } = asignarPenalizacionValidation.validate(body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [tienePenalizacion, errorTienePenalizacion] = await asignarPenalizacion(body);

    if (errorTienePenalizacion) return handleErrorClient(res, 400, errorTienePenalizacion);

    handleSuccess(res, 201, "Penalización asignada correctamente", tienePenalizacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener todas las penalizaciones asignadas
 */
export async function getTienePenalizacionesController(req, res) {
  try {
    const [penalizaciones, errorPenalizaciones] = await getTienePenalizaciones();

    if (errorPenalizaciones) return handleErrorClient(res, 404, errorPenalizaciones);

    penalizaciones.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Penalizaciones asignadas encontradas", penalizaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener penalizaciones por usuario (RUT)
 */
export async function getPenalizacionesPorUsuarioController(req, res) {
  try {
    const { rut } = req.params;

    const [penalizaciones, errorPenalizaciones] = await getPenalizacionesPorUsuario(rut);

    if (errorPenalizaciones) return handleErrorClient(res, 404, errorPenalizaciones);

    penalizaciones.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Penalizaciones del usuario encontradas", penalizaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener penalizaciones activas de un usuario
 */
export async function getPenalizacionesActivasController(req, res) {
  try {
    const { rut } = req.params;

    const [penalizaciones, errorPenalizaciones] = await getPenalizacionesActivas(rut);

    if (errorPenalizaciones) return handleErrorClient(res, 404, errorPenalizaciones);

    penalizaciones.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Penalizaciones activas encontradas", penalizaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Finalizar una penalización asignada
 */
export async function finalizarPenalizacionController(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error } = finalizarPenalizacionValidation.validate(body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [penalizacion, errorPenalizacion] = await finalizarPenalizacion(id, body.Fecha_Fin);

    if (errorPenalizacion) return handleErrorClient(res, 400, errorPenalizacion);

    handleSuccess(res, 200, "Penalización finalizada correctamente", penalizacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
