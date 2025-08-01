"use strict";
import {
  createMarcaService,
  deleteMarcaService,
  getMarcaService,
  getMarcasService,
  updateMarcaService,
} from "../services/marca.service.js";
import {
  marcaBodyValidation,
  marcaQueryValidation,
} from "../validations/marca.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getMarca(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error } = marcaQueryValidation.validate({ id, nombre });

    if (error) return handleErrorClient(res, 400, error.message);

    const [marca, errorMarca] = await getMarcaService({ id, nombre });

    if (errorMarca) return handleErrorClient(res, 404, errorMarca);

    handleSuccess(res, 200, "Marca encontrada", marca);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getMarcas(req, res) {
  try {
    const [marcas, errorMarcas] = await getMarcasService();

    if (errorMarcas) return handleErrorClient(res, 404, errorMarcas);

    marcas.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Marcas encontradas", marcas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createMarca(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = marcaBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [marca, errorMarca] = await createMarcaService(body);

    if (errorMarca) return handleErrorClient(res, 400, "Error creando la marca", errorMarca);

    handleSuccess(res, 201, "Marca creada correctamente", marca);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateMarca(req, res) {
  try {
    const { id, nombre } = req.query;
    const { body } = req;

    const { error: queryError } = marcaQueryValidation.validate({
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

    const { error: bodyError } = marcaBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [marca, errorMarca] = await updateMarcaService({ id, nombre }, body);

    if (errorMarca) return handleErrorClient(res, 400, "Error modificando la marca", errorMarca);

    handleSuccess(res, 200, "Marca modificada correctamente", marca);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteMarca(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error: queryError } = marcaQueryValidation.validate({
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

    const [marcaDeleted, errorMarcaDeleted] = await deleteMarcaService({
      id,
      nombre,
    });

    if (errorMarcaDeleted) return handleErrorClient(res, 404, "Error eliminando la marca", errorMarcaDeleted);

    handleSuccess(res, 200, "Marca eliminada correctamente", marcaDeleted);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
