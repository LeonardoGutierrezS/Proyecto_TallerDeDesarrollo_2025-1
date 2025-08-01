"use strict";
import {
  createEstadoPrestamoService,
  deleteEstadoPrestamoService,
  getEstadoPrestamoService,
  getEstadosPrestamosService,
  updateEstadoPrestamoService,
} from "../services/estado-prestamo.service.js";
import {
  estadoPrestamoBodyValidation,
  estadoPrestamoQueryValidation,
} from "../validations/estado-prestamo.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getEstadoPrestamo(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error } = estadoPrestamoQueryValidation.validate({ id, nombre });

    if (error) return handleErrorClient(res, 400, error.message);

    const [estado, errorEstado] = await getEstadoPrestamoService({ id, nombre });

    if (errorEstado) return handleErrorClient(res, 404, errorEstado);

    handleSuccess(res, 200, "Estado del préstamo encontrado", estado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getEstadosPrestamos(req, res) {
  try {
    const [estados, errorEstados] = await getEstadosPrestamosService();

    if (errorEstados) return handleErrorClient(res, 404, errorEstados);

    estados.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Estados de préstamos encontrados", estados);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createEstadoPrestamo(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = estadoPrestamoBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [estado, errorEstado] = await createEstadoPrestamoService(body);

    if (errorEstado) return handleErrorClient(res, 400, "Error creando el estado del préstamo", errorEstado);

    handleSuccess(res, 201, "Estado del préstamo creado correctamente", estado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateEstadoPrestamo(req, res) {
  try {
    const { id, nombre } = req.query;
    const { body } = req;

    const { error: queryError } = estadoPrestamoQueryValidation.validate({
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

    const { error: bodyError } = estadoPrestamoBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [estado, errorEstado] = await updateEstadoPrestamoService({ id, nombre }, body);

    if (errorEstado) {
      return handleErrorClient(res, 400, "Error modificando el estado del préstamo", errorEstado);
    }

    handleSuccess(res, 200, "Estado del préstamo modificado correctamente", estado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteEstadoPrestamo(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error: queryError } = estadoPrestamoQueryValidation.validate({
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

    const [estadoDeleted, errorEstadoDeleted] = await deleteEstadoPrestamoService({
      id,
      nombre,
    });

    if (errorEstadoDeleted) {
      return handleErrorClient(res, 404, "Error eliminando el estado del préstamo", errorEstadoDeleted);
    }

    handleSuccess(res, 200, "Estado del préstamo eliminado correctamente", estadoDeleted);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
