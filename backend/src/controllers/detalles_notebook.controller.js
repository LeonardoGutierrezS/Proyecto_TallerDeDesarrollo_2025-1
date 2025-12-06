"use strict";
import {
  createDetallesNotebookService,
  deleteDetallesNotebookService,
  getAllDetallesNotebooksService,
  getDetallesNotebookPorEquipoService,
  getDetallesNotebookService,
  updateDetallesNotebookService,
} from "../services/detalles_notebook.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import {
  detallesNotebookUpdateValidation,
  detallesNotebookValidation,
} from "../validations/detalles_notebook.validation.js";

export async function createDetallesNotebook(req, res) {
  try {
    const { body } = req;

    const { error: validationError } = detallesNotebookValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [detalles, error] = await createDetallesNotebookService(body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Detalles del notebook creados exitosamente", detalles);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getDetallesNotebook(req, res) {
  try {
    const { id } = req.params;

    const [detalles, error] = await getDetallesNotebookService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Detalles del notebook encontrados", detalles);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getDetallesNotebookPorEquipo(req, res) {
  try {
    const { equipoId } = req.params;

    const [detalles, error] = await getDetallesNotebookPorEquipoService(equipoId);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Detalles del notebook encontrados", detalles);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllDetallesNotebooks(req, res) {
  try {
    const [detalles, error] = await getAllDetallesNotebooksService();

    if (error) return handleErrorClient(res, 404, error);

    detalles.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Detalles de notebooks encontrados", detalles);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateDetallesNotebook(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: validationError } = detallesNotebookUpdateValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [detalles, error] = await updateDetallesNotebookService(id, body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Detalles del notebook actualizados correctamente", detalles);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteDetallesNotebook(req, res) {
  try {
    const { id } = req.params;

    const [detalles, error] = await deleteDetallesNotebookService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Detalles del notebook eliminados correctamente", detalles);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
