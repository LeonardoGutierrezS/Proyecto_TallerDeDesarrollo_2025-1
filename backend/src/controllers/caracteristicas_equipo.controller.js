"use strict";
import {
  createCaracteristica,
  getCaracteristicasPorEquipo,
  updateCaracteristica,
  deleteCaracteristica,
} from "../services/caracteristicas_equipo.service.js";
import {
  caracteristicaEquipoValidation,
  updateCaracteristicaEquipoValidation,
} from "../validations/caracteristicas_equipo.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

/**
 * Crear una nueva característica de equipo
 */
export async function createCaracteristicaController(req, res) {
  try {
    const { body } = req;

    const { error } = caracteristicaEquipoValidation.validate(body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [caracteristica, errorCaracteristica] = await createCaracteristica(body);

    if (errorCaracteristica) return handleErrorClient(res, 400, errorCaracteristica);

    handleSuccess(res, 201, "Característica creada correctamente", caracteristica);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Obtener todas las características de un equipo
 */
export async function getCaracteristicasPorEquipoController(req, res) {
  try {
    const { idNumInv } = req.params;

    const [caracteristicas, errorCaracteristicas] = await getCaracteristicasPorEquipo(idNumInv);

    if (errorCaracteristicas) return handleErrorClient(res, 404, errorCaracteristicas);

    caracteristicas.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Características encontradas", caracteristicas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Actualizar una característica de equipo
 */
export async function updateCaracteristicaController(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error } = updateCaracteristicaEquipoValidation.validate(body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [caracteristica, errorCaracteristica] = await updateCaracteristica(id, body);

    if (errorCaracteristica) return handleErrorClient(res, 400, errorCaracteristica);

    handleSuccess(res, 200, "Característica actualizada correctamente", caracteristica);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Eliminar una característica de equipo
 */
export async function deleteCaracteristicaController(req, res) {
  try {
    const { id } = req.params;

    const [caracteristica, errorCaracteristica] = await deleteCaracteristica(id);

    if (errorCaracteristica) return handleErrorClient(res, 404, errorCaracteristica);

    handleSuccess(res, 200, "Característica eliminada correctamente", caracteristica);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
