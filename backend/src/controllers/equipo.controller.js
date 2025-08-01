"use strict";
import {
  createEquipoService,
  deleteEquipoService,
  getEquiposByCategoriaService,
  getEquiposByMarcaService,
  getEquipoService,
  getEquiposService,
  updateEquipoService,
} from "../services/equipo.service.js";
import {
  equipoBodyValidation,
  equipoQueryValidation,
  equipoUpdateValidation,
} from "../validations/equipo.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getEquipo(req, res) {
  try {
    const { id, marcaId, modelo, numeroDeSerie, categoriaId, estadoAltaBajaId } = req.query;

    const { error } = equipoQueryValidation.validate({
      id,
      marcaId,
      modelo,
      numeroDeSerie,
      categoriaId,
      estadoAltaBajaId,
    });

    if (error) return handleErrorClient(res, 400, error.message);

    const [equipo, errorEquipo] = await getEquipoService({
      id,
      marcaId,
      modelo,
      numeroDeSerie,
      categoriaId,
      estadoAltaBajaId,
    });

    if (errorEquipo) return handleErrorClient(res, 404, errorEquipo);

    handleSuccess(res, 200, "Equipo encontrado", equipo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getEquipos(req, res) {
  try {
    const [equipos, errorEquipos] = await getEquiposService();

    if (errorEquipos) return handleErrorClient(res, 404, errorEquipos);

    equipos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Equipos encontrados", equipos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getEquiposByMarca(req, res) {
  try {
    const { marcaId } = req.params;

    if (!marcaId || isNaN(marcaId)) {
      return handleErrorClient(res, 400, "ID de marca inválido");
    }

    const [equipos, errorEquipos] = await getEquiposByMarcaService(parseInt(marcaId, 10));

    if (errorEquipos) return handleErrorClient(res, 404, errorEquipos);

    equipos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Equipos encontrados por marca", equipos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getEquiposByCategoria(req, res) {
  try {
    const { categoriaId } = req.query; // Cambiar de req.params a req.query

    if (!categoriaId || isNaN(categoriaId)) {
      return handleErrorClient(res, 400, "ID de categoría inválido");
    }

    const [equipos, errorEquipos] = await getEquiposByCategoriaService(parseInt(categoriaId, 10));

    if (errorEquipos) return handleErrorClient(res, 404, errorEquipos);

    equipos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Equipos encontrados por categoría", equipos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createEquipo(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = equipoBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [equipo, errorEquipo] = await createEquipoService(body);

    if (errorEquipo) return handleErrorClient(res, 400, "Error creando el equipo", errorEquipo);

    handleSuccess(res, 201, "Equipo creado correctamente", equipo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateEquipo(req, res) {
  try {
    const { id, marcaId, modelo, numeroDeSerie, categoriaId, estadoAltaBajaId } = req.query;
    const { body } = req;

    const { error: queryError } = equipoQueryValidation.validate({
      id,
      marcaId,
      modelo,
      numeroDeSerie,
      categoriaId,
      estadoAltaBajaId,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = equipoUpdateValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [equipo, errorEquipo] = await updateEquipoService({
      id,
      marcaId,
      modelo,
      numeroDeSerie,
      categoriaId,
      estadoAltaBajaId,
    }, body);

    if (errorEquipo) return handleErrorClient(res, 400, "Error modificando el equipo", errorEquipo);

    handleSuccess(res, 200, "Equipo modificado correctamente", equipo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteEquipo(req, res) {
  try {
    const { id, marcaId, modelo, numeroDeSerie, categoriaId, estadoAltaBajaId } = req.query;

    const { error: queryError } = equipoQueryValidation.validate({
      id,
      marcaId,
      modelo,
      numeroDeSerie,
      categoriaId,
      estadoAltaBajaId,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [equipoDeleted, errorEquipoDeleted] = await deleteEquipoService({
      id,
      marcaId,
      modelo,
      numeroDeSerie,
      categoriaId,
      estadoAltaBajaId,
    });

    if (errorEquipoDeleted) {
      return handleErrorClient(res, 404, "Error eliminando el equipo", errorEquipoDeleted);
    }

    handleSuccess(res, 200, "Equipo eliminado correctamente", equipoDeleted);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
