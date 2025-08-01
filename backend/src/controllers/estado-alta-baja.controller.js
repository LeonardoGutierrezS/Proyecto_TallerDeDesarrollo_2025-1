"use strict";
import {
  createEstadoAltaBajaService,
  deleteEstadoAltaBajaService,
  getEstadoAltaBajaService,
  getEstadosAltaBajaService,
  updateEstadoAltaBajaService,
} from "../services/estado-alta-baja.service.js";
import {
  estadoAltaBajaBodyValidation,
  estadoAltaBajaQueryValidation,
} from "../validations/estado-alta-baja.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getEstadoAltaBaja(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error } = estadoAltaBajaQueryValidation.validate({ id, nombre });

    if (error) return handleErrorClient(res, 400, error.message);

    const [estado, errorEstado] = await getEstadoAltaBajaService({ id, nombre });

    if (errorEstado) return handleErrorClient(res, 404, errorEstado);

    handleSuccess(res, 200, "Estado encontrado", estado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getEstadosAltaBaja(req, res) {
  try {
    const [estados, errorEstados] = await getEstadosAltaBajaService();

    if (errorEstados) return handleErrorClient(res, 404, errorEstados);

    estados.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Estados encontrados", estados);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createEstadoAltaBaja(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = estadoAltaBajaBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [estado, errorEstado] = await createEstadoAltaBajaService(body);

    if (errorEstado) return handleErrorClient(res, 400, "Error creando el estado", errorEstado);

    handleSuccess(res, 201, "Estado creado correctamente", estado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateEstadoAltaBaja(req, res) {
  try {
    const { id, nombre } = req.query;
    const { body } = req;

    const { error: queryError } = estadoAltaBajaQueryValidation.validate({
      id,
      nombre,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = estadoAltaBajaBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [estado, errorEstado] = await updateEstadoAltaBajaService({ id, nombre }, body);

    if (errorEstado) return handleErrorClient(res, 400, "Error modificando el estado", errorEstado);

    handleSuccess(res, 200, "Estado modificado correctamente", estado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteEstadoAltaBaja(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error: queryError } = estadoAltaBajaQueryValidation.validate({
      id,
      nombre,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [estadoDeleted, errorEstadoDeleted] = await deleteEstadoAltaBajaService({
      id,
      nombre,
    });

    if (errorEstadoDeleted) {
      return handleErrorClient(res, 404, "Error eliminando el estado", errorEstadoDeleted);
    }

    handleSuccess(res, 200, "Estado eliminado correctamente", estadoDeleted);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
