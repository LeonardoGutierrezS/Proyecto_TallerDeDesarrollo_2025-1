"use strict";
import {
  approveUserService,
  createUserByAdminService,
  deleteUserService,
  getPendingUsersService,
  getUserService,
  getUsersService,
  rejectUserService,
  updateUserService,
  updateUserStatusService,
} from "../services/user.service.js";
import {
  userBodyValidation,
  userQueryValidation,
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getUser(req, res) {
  try {
    const { rut, email } = req.query;

    const { error } = userQueryValidation.validate({ rut, email });

    if (error) return handleErrorClient(res, 400, error.message);

    const [user, errorUser] = await getUserService({ rut, email });

    if (errorUser) return handleErrorClient(res, 404, errorUser);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    users.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      error.message,
    );
  }
}

export async function updateUser(req, res) {
  try {
    const { rut, email } = req.query;
    const { body } = req;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = userBodyValidation.validate(body);

    if (bodyError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );
    }

    const [user, userError] = await updateUserService({ rut, email }, body);

    if (userError) {
      return handleErrorClient(res, 400, "Error modificando al usuario", userError);
    }

    handleSuccess(res, 200, "Usuario modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const { rut, email } = req.query;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [userDelete, errorUserDelete] = await deleteUserService({
      rut,
      email,
    });

    if (errorUserDelete) return handleErrorClient(res, 404, "Error eliminado al usuario", errorUserDelete);

    handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getPendingUsers(req, res) {
  try {
    const [users, error] = await getPendingUsersService();

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Usuarios pendientes encontrados", users);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function approveUser(req, res) {
  try {
    const { rut } = req.params;
    const [user, error] = await approveUserService(rut);

    if (error) return handleErrorClient(res, 400, "Error al aprobar usuario", error);

    handleSuccess(res, 200, "Usuario aprobado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function rejectUser(req, res) {
  try {
    const { rut } = req.params;
    const [user, error] = await rejectUserService(rut);

    if (error) return handleErrorClient(res, 400, "Error al rechazar usuario", error);

    handleSuccess(res, 200, "Usuario rechazado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateUserStatus(req, res) {
  try {
    const { rut } = req.params;
    const { vigente } = req.body;
    const [user, error] = await updateUserStatusService(rut, vigente);

    if (error) return handleErrorClient(res, 400, "Error al actualizar estado", error);

    handleSuccess(res, 200, "Estado actualizado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createUserByAdmin(req, res) {
  try {
    const { body } = req;
    const [newUser, error] = await createUserByAdminService(body);

    if (error) return handleErrorClient(res, 400, "Error al crear usuario", error);

    handleSuccess(res, 201, "Usuario creado correctamente", newUser);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}