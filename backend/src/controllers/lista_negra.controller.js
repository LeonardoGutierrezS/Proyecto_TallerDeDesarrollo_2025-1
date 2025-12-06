"use strict";
import {
  createListaNegraService,
  getListaNegraService,
  getListaNegrasService,
  getListaNegrasActivasService,
  getListaNegraPorUsuarioService,
  verificarUsuarioEnListaNegraService,
  updateListaNegraService,
  levantarListaNegraService,
  deleteListaNegraService,
} from "../services/lista_negra.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import {
  listaNegraUpdateValidation,
  listaNegraValidation,
} from "../validations/lista_negra.validation.js";

export async function createListaNegra(req, res) {
  try {
    const { body } = req;

    const { error: validationError } = listaNegraValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [listaNegra, error] = await createListaNegraService(body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Usuario agregado a lista negra exitosamente", listaNegra);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getListaNegra(req, res) {
  try {
    const { id } = req.params;

    const [listaNegra, error] = await getListaNegraService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Registro de lista negra encontrado", listaNegra);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getListaNegras(req, res) {
  try {
    const [listasNegras, error] = await getListaNegrasService();

    if (error) return handleErrorClient(res, 404, error);

    listasNegras.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Registros de lista negra encontrados", listasNegras);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getListaNegrasActivas(req, res) {
  try {
    const [listasNegras, error] = await getListaNegrasActivasService();

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Listas negras activas encontradas", listasNegras);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getListaNegraPorUsuario(req, res) {
  try {
    const { usuarioId } = req.params;

    const [listasNegras, error] = await getListaNegraPorUsuarioService(usuarioId);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Historial de lista negra del usuario encontrado", listasNegras);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function verificarUsuarioEnListaNegra(req, res) {
  try {
    const { usuarioId } = req.params;

    const [resultado, error] = await verificarUsuarioEnListaNegraService(usuarioId);

    if (error) return handleErrorClient(res, 400, error);

    const mensaje = resultado.enListaNegra
      ? "El usuario está en lista negra"
      : "El usuario no está en lista negra";

    handleSuccess(res, 200, mensaje, resultado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateListaNegra(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: validationError } = listaNegraUpdateValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [listaNegra, error] = await updateListaNegraService(id, body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Registro de lista negra actualizado correctamente", listaNegra);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function levantarListaNegra(req, res) {
  try {
    const { id } = req.params;

    const [listaNegra, error] = await levantarListaNegraService(id);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Lista negra levantada correctamente", listaNegra);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteListaNegra(req, res) {
  try {
    const { id } = req.params;

    const [listaNegra, error] = await deleteListaNegraService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Registro de lista negra eliminado correctamente", listaNegra);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
