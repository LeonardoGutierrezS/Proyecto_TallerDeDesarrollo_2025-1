"use strict";
import {
  createTipoDocumentoService,
  deleteTipoDocumentoService,
  getTipoDocumentoService,
  getTiposDocumentosService,
  updateTipoDocumentoService,
} from "../services/tipo-documento.service.js";
import {
  tipoDocumentoBodyValidation,
  tipoDocumentoQueryValidation,
} from "../validations/tipo-documento.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getTipoDocumento(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error } = tipoDocumentoQueryValidation.validate({ id, nombre });

    if (error) return handleErrorClient(res, 400, error.message);

    const [tipo, errorTipo] = await getTipoDocumentoService({ id, nombre });

    if (errorTipo) return handleErrorClient(res, 404, errorTipo);

    handleSuccess(res, 200, "Tipo de documento encontrado", tipo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getTiposDocumentos(req, res) {
  try {
    const [tipos, errorTipos] = await getTiposDocumentosService();

    if (errorTipos) return handleErrorClient(res, 404, errorTipos);

    tipos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Tipos de documentos encontrados", tipos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createTipoDocumento(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = tipoDocumentoBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [tipo, errorTipo] = await createTipoDocumentoService(body);

    if (errorTipo) return handleErrorClient(res, 400, "Error creando el tipo de documento", errorTipo);

    handleSuccess(res, 201, "Tipo de documento creado correctamente", tipo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateTipoDocumento(req, res) {
  try {
    const { id, nombre } = req.query;
    const { body } = req;

    const { error: queryError } = tipoDocumentoQueryValidation.validate({
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

    const { error: bodyError } = tipoDocumentoBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [tipo, errorTipo] = await updateTipoDocumentoService({ id, nombre }, body);

    if (errorTipo) {
      return handleErrorClient(res, 400, "Error modificando el tipo de documento", errorTipo);
    }

    handleSuccess(res, 200, "Tipo de documento modificado correctamente", tipo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteTipoDocumento(req, res) {
  try {
    const { id, nombre } = req.query;

    const { error: queryError } = tipoDocumentoQueryValidation.validate({
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

    const [tipoDeleted, errorTipoDeleted] = await deleteTipoDocumentoService({
      id,
      nombre,
    });

    if (errorTipoDeleted) {
      return handleErrorClient(res, 404, "Error eliminando el tipo de documento", errorTipoDeleted);
    }

    handleSuccess(res, 200, "Tipo de documento eliminado correctamente", tipoDeleted);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
