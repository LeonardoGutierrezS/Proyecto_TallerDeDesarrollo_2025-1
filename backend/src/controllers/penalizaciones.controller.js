"use strict";
import {
  createPenalizacion,
  getPenalizaciones,
  getPenalizacion,
  updatePenalizacion,
  deletePenalizacion,
} from "../services/penalizaciones.service.js";
import {
  penalizacionValidation,
  updatePenalizacionValidation,
} from "../validations/penalizaciones.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Crear una nueva penalización
 */
export async function createPenalizacionController(req, res) {
  try {
    const { body } = req;

    const { error } = penalizacionValidation.validate(body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [penalizacion, errorPenalizacion] = await createPenalizacion(body);

    if (errorPenalizacion) return handleErrorClient(res, 400, errorPenalizacion);

    handleSuccess(res, 201, "Penalización creada correctamente", penalizacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener todas las penalizaciones
 */
export async function getPenalizacionesController(req, res) {
  try {
    const [penalizaciones, errorPenalizaciones] = await getPenalizaciones();

    if (errorPenalizaciones) return handleErrorClient(res, 404, errorPenalizaciones);

    penalizaciones.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Penalizaciones encontradas", penalizaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener una penalización por ID
 */
export async function getPenalizacionController(req, res) {
  try {
    const { id } = req.params;

    const [penalizacion, errorPenalizacion] = await getPenalizacion(id);

    if (errorPenalizacion) return handleErrorClient(res, 404, errorPenalizacion);

    handleSuccess(res, 200, "Penalización encontrada", penalizacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Actualizar una penalización
 */
export async function updatePenalizacionController(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error } = updatePenalizacionValidation.validate(body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [penalizacion, errorPenalizacion] = await updatePenalizacion(id, body);

    if (errorPenalizacion) return handleErrorClient(res, 400, errorPenalizacion);

    handleSuccess(res, 200, "Penalización actualizada correctamente", penalizacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Eliminar una penalización
 */
export async function deletePenalizacionController(req, res) {
  try {
    const { id } = req.params;

    const [penalizacion, errorPenalizacion] = await deletePenalizacion(id);

    if (errorPenalizacion) return handleErrorClient(res, 404, errorPenalizacion);

    handleSuccess(res, 200, "Penalización eliminada correctamente", penalizacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
