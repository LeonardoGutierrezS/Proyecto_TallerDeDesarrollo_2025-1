"use strict";
import {
  createEstadoPrestamoService,
  getEstadoPrestamoService,
  getEstadosPrestamosService,
  updateEstadoPrestamoService,
  deleteEstadoPrestamoService,
} from "../services/estado_prestamo.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { estadoPrestamoValidation } from "../validations/catalogo.validation.js";

export async function createEstadoPrestamo(req, res) {
  try {
    const { body } = req;

    const { error: validationError } = estadoPrestamoValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [estadoPrestamo, error] = await createEstadoPrestamoService(body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Estado de préstamo creado exitosamente", estadoPrestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getEstadoPrestamo(req, res) {
  try {
    const { id } = req.params;

    const [estadoPrestamo, error] = await getEstadoPrestamoService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Estado de préstamo encontrado", estadoPrestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getEstadosPrestamos(req, res) {
  try {
    const [estadosPrestamos, error] = await getEstadosPrestamosService();

    if (error) return handleErrorClient(res, 404, error);

    estadosPrestamos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Estados de préstamo encontrados", estadosPrestamos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateEstadoPrestamo(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: validationError } = estadoPrestamoValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [estadoPrestamo, error] = await updateEstadoPrestamoService(id, body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Estado de préstamo actualizado correctamente", estadoPrestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteEstadoPrestamo(req, res) {
  try {
    const { id } = req.params;

    const [estadoPrestamo, error] = await deleteEstadoPrestamoService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Estado de préstamo eliminado correctamente", estadoPrestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
