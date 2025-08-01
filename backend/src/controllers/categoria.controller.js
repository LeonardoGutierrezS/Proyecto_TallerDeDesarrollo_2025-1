"use strict";
import {
  createCategoriaService,
  deleteCategoriaService,
  getCategoriaService,
  getCategoriasService,
  updateCategoriaService,
} from "../services/categoria.service.js";
import {
  categoriaBodyValidation,
  categoriaQueryValidation,
} from "../validations/categoria.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getCategoria(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error } = categoriaQueryValidation.validate({ id, nombre });

    if (error) return handleErrorClient(res, 400, error.message);

    const [categoria, errorCategoria] = await getCategoriaService({ id, nombre });

    if (errorCategoria) return handleErrorClient(res, 404, errorCategoria);

    handleSuccess(res, 200, "Categoría encontrada", categoria);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getCategorias(req, res) {
  try {
    const [categorias, errorCategorias] = await getCategoriasService();

    if (errorCategorias) return handleErrorClient(res, 404, errorCategorias);

    categorias.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Categorías encontradas", categorias);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createCategoria(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = categoriaBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [categoria, errorCategoria] = await createCategoriaService(body);

    if (errorCategoria) return handleErrorClient(res, 400, "Error creando la categoría", errorCategoria);

    handleSuccess(res, 201, "Categoría creada correctamente", categoria);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateCategoria(req, res) {
  try {
    const { id, nombre } = req.query;
    const { body } = req;

    const { error: queryError } = categoriaQueryValidation.validate({
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

    const { error: bodyError } = categoriaBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [categoria, errorCategoria] = await updateCategoriaService({ id, nombre }, body);

    if (errorCategoria) return handleErrorClient(res, 400, "Error modificando la categoría", errorCategoria);

    handleSuccess(res, 200, "Categoría modificada correctamente", categoria);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteCategoria(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error: queryError } = categoriaQueryValidation.validate({
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

    const [categoriaDeleted, errorCategoriaDeleted] = await deleteCategoriaService({
      id,
      nombre,
    });

    if (errorCategoriaDeleted) {
      return handleErrorClient(res, 404, "Error eliminando la categoría", errorCategoriaDeleted);
    }

    handleSuccess(res, 200, "Categoría eliminada correctamente", categoriaDeleted);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
