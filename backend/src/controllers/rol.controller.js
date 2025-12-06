"use strict";
import {
  createRolService,
  getRolService,
  getRolesService,
  updateRolService,
  deleteRolService,
} from "../services/rol.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import {
  rolIdValidation,
  rolValidation,
} from "../validations/rol.validation.js";

export async function createRol(req, res) {
  try {
    const { body } = req;

    const { error: validationError } = rolValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [rol, error] = await createRolService(body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Rol creado exitosamente", rol);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getRol(req, res) {
  try {
    const { id } = req.params;

    const [rol, error] = await getRolService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Rol encontrado", rol);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getRoles(req, res) {
  try {
    const [roles, error] = await getRolesService();

    if (error) return handleErrorClient(res, 404, error);

    roles.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Roles encontrados", roles);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateRol(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: validationError } = rolValidation.validate(body);

    if (validationError) {
      return handleErrorClient(
        res,
        400,
        validationError.details[0].message,
      );
    }

    const [rol, error] = await updateRolService(id, body);

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 200, "Rol actualizado correctamente", rol);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteRol(req, res) {
  try {
    const { id } = req.params;

    const [rol, error] = await deleteRolService(id);

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Rol eliminado correctamente", rol);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
