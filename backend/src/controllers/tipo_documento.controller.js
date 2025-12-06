"use strict";
import {
  createTipoDocumentoService,
  getTipoDocumentoService,
  getTiposDocumentoService,
  updateTipoDocumentoService,
  deleteTipoDocumentoService,
} from "../services/tipo_documento.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { tipoDocumentoValidation } from "../validations/catalogo.validation.js";

export async function createTipoDocumento(req, res) {
  try {
    const { body } = req;

    const { error: validationError } = tipoDocumentoValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [tipoDocumento, error] = await createTipoDocumentoService(body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Tipo de documento creado exitosamente", tipoDocumento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getTipoDocumento(req, res) {
  try {
    const { id } = req.params;

    const [tipoDocumento, error] = await getTipoDocumentoService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Tipo de documento encontrado", tipoDocumento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getTiposDocumento(req, res) {
  try {
    const [tiposDocumento, error] = await getTiposDocumentoService();

    if (error) return handleErrorClient(res, 404, error);

    tiposDocumento.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Tipos de documento encontrados", tiposDocumento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateTipoDocumento(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: validationError } = tipoDocumentoValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [tipoDocumento, error] = await updateTipoDocumentoService(id, body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Tipo de documento actualizado correctamente", tipoDocumento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteTipoDocumento(req, res) {
  try {
    const { id } = req.params;

    const [tipoDocumento, error] = await deleteTipoDocumentoService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Tipo de documento eliminado correctamente", tipoDocumento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
