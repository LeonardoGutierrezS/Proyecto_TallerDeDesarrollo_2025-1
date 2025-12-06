"use strict";
import {
  createMotivoService,
  getMotivoService,
  getMotivosService,
  updateMotivoService,
  deleteMotivoService,
} from "../services/motivo.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { motivoValidation } from "../validations/catalogo.validation.js";

export async function createMotivo(req, res) {
  try {
    const { body } = req;

    const { error: validationError } = motivoValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [motivo, error] = await createMotivoService(body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Motivo creado exitosamente", motivo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getMotivo(req, res) {
  try {
    const { id } = req.params;

    const [motivo, error] = await getMotivoService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Motivo encontrado", motivo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getMotivos(req, res) {
  try {
    const [motivos, error] = await getMotivosService();

    if (error) return handleErrorClient(res, 404, error);

    motivos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Motivos encontrados", motivos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateMotivo(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: validationError } = motivoValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [motivo, error] = await updateMotivoService(id, body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Motivo actualizado correctamente", motivo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteMotivo(req, res) {
  try {
    const { id } = req.params;

    const [motivo, error] = await deleteMotivoService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Motivo eliminado correctamente", motivo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
