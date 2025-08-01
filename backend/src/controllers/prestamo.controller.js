"use strict";
import {
    createPrestamoService,
    deletePrestamoService,
    getPrestamosByEquipoService,
    getPrestamosByEstadoService,
    getPrestamosByUsuarioService,
    getPrestamoService,
    getPrestamosService,
    updateEstadoPrestamoService,
    updatePrestamoService,
} from "../services/prestamo.service.js";
import {
    prestamoBodyValidation,
    prestamoEstadoValidation,
    prestamoQueryValidation,
    prestamoUpdateValidation,
} from "../validations/prestamo.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getPrestamo(req, res) {
    try {
    const {
        id,
        usuarioId,
        equipoId,
        categoriaId,
        estadoPrestamoId,
        fechaInicioPrestamo,
        fechaFinPrestamo,
    } = req.query;

    const { error } = prestamoQueryValidation.validate({
        id,
        usuarioId,
        equipoId,
        categoriaId,
        estadoPrestamoId,
        fechaInicioPrestamo,
        fechaFinPrestamo,
    });

    if (error) return handleErrorClient(res, 400, error.message);

    const [prestamo, errorPrestamo] = await getPrestamoService({
        id,
        usuarioId,
        equipoId,
        categoriaId,
        estadoPrestamoId,
        fechaInicioPrestamo,
        fechaFinPrestamo,
    });

    if (errorPrestamo) return handleErrorClient(res, 404, errorPrestamo);

    handleSuccess(res, 200, "Préstamo encontrado", prestamo);
    } catch (error) {
    handleErrorServer(res, 500, error.message);
    }
}

export async function getPrestamos(req, res) {
    try {
    const [prestamos, errorPrestamos] = await getPrestamosService();

    if (errorPrestamos) return handleErrorClient(res, 404, errorPrestamos);

    prestamos.length === 0
        ? handleSuccess(res, 204)
        : handleSuccess(res, 200, "Préstamos encontrados", prestamos);
    } catch (error) {
    handleErrorServer(res, 500, error.message);
    }
    }

export async function getPrestamosByUsuario(req, res) {
    try {
    // Si viene de la ruta /my-prestamos/, usar el usuario autenticado
    // Si viene de otra ruta (para admin), usar el parámetro usuarioId
    const usuarioId = req.params.usuarioId || req.user?.id;

    if (!usuarioId || isNaN(usuarioId)) {
        return handleErrorClient(res, 400, "ID de usuario inválido");
    }

    const [prestamos, errorPrestamos] = await getPrestamosByUsuarioService(parseInt(usuarioId, 10));

    if (errorPrestamos) return handleErrorClient(res, 404, errorPrestamos);

    prestamos.length === 0
        ? handleSuccess(res, 204)
        : handleSuccess(res, 200, "Préstamos encontrados por usuario", prestamos);
    } catch (error) {
    handleErrorServer(res, 500, error.message);
    }
}

export async function getPrestamosByEquipo(req, res) {
  try {
    const { equipoId } = req.params;

    if (!equipoId || isNaN(equipoId)) {
      return handleErrorClient(res, 400, "ID de equipo inválido");
    }

    const [prestamos, errorPrestamos] = await getPrestamosByEquipoService(parseInt(equipoId, 10));

    if (errorPrestamos) return handleErrorClient(res, 404, errorPrestamos);

    prestamos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Préstamos encontrados por equipo", prestamos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getPrestamosByEstado(req, res) {
  try {
    const { estadoId } = req.params;

    if (!estadoId || isNaN(estadoId)) {
      return handleErrorClient(res, 400, "ID de estado inválido");
    }

    const [prestamos, errorPrestamos] = await getPrestamosByEstadoService(parseInt(estadoId, 10));

    if (errorPrestamos) return handleErrorClient(res, 404, errorPrestamos);

    prestamos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Préstamos encontrados por estado", prestamos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createPrestamo(req, res) {
  try {
    const { body } = req;
    
    // Agregar automáticamente el ID del usuario autenticado
    body.usuarioId = req.user.id;

    const { error: bodyError } = prestamoBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [prestamo, errorPrestamo] = await createPrestamoService(body);

    if (errorPrestamo) return handleErrorClient(res, 400, "Error creando el préstamo", errorPrestamo);

    handleSuccess(res, 201, "Préstamo creado correctamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updatePrestamo(req, res) {
  try {
    const {
      id,
      usuarioId,
      equipoId,
      categoriaId,
      estadoPrestamoId,
    } = req.query;
    const { body } = req;

    const { error: queryError } = prestamoQueryValidation.validate({
      id,
      usuarioId,
      equipoId,
      categoriaId,
      estadoPrestamoId,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = prestamoUpdateValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [prestamo, errorPrestamo] = await updatePrestamoService({
      id,
      usuarioId,
      equipoId,
      categoriaId,
      estadoPrestamoId,
    }, body);

    if (errorPrestamo) return handleErrorClient(res, 400, "Error modificando el préstamo", errorPrestamo);

    handleSuccess(res, 200, "Préstamo modificado correctamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateEstadoPrestamo(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID de préstamo inválido");
    }

    const { error: bodyError } = prestamoEstadoValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [prestamo, errorPrestamo] = await updateEstadoPrestamoService(parseInt(id, 10), body);

    if (errorPrestamo) {
      return handleErrorClient(res, 400, "Error actualizando el estado del préstamo", errorPrestamo);
    }

    handleSuccess(res, 200, "Estado del préstamo actualizado correctamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deletePrestamo(req, res) {
  try {
    const {
      id,
      usuarioId,
      equipoId,
      categoriaId,
      estadoPrestamoId,
    } = req.query;

    const { error: queryError } = prestamoQueryValidation.validate({
      id,
      usuarioId,
      equipoId,
      categoriaId,
      estadoPrestamoId,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [prestamoDeleted, errorPrestamoDeleted] = await deletePrestamoService({
      id,
      usuarioId,
      equipoId,
      categoriaId,
      estadoPrestamoId,
    });

    if (errorPrestamoDeleted) {
      return handleErrorClient(res, 404, "Error eliminando el préstamo", errorPrestamoDeleted);
    }

    handleSuccess(res, 200, "Préstamo eliminado correctamente", prestamoDeleted);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Funciones adicionales para manejo específico de préstamos
export async function aprobarPrestamo(req, res) {
  try {
    const { id } = req.body;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID de préstamo inválido");
    }

    const [prestamo, errorPrestamo] = await updateEstadoPrestamoService(
      parseInt(id, 10),
      { estadoPrestamoId: 2 } // Asumiendo que 2 es "Aprobado"
    );

    if (errorPrestamo) {
      return handleErrorClient(res, 400, "Error aprobando el préstamo", errorPrestamo);
    }

    handleSuccess(res, 200, "Préstamo aprobado correctamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function rechazarPrestamo(req, res) {
  try {
    const { id, motivoRechazo } = req.body;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID de préstamo inválido");
    }

    if (!motivoRechazo) {
      return handleErrorClient(res, 400, "El motivo de rechazo es requerido");
    }

    const [prestamo, errorPrestamo] = await updateEstadoPrestamoService(
      parseInt(id, 10),
      {
        estadoPrestamoId: 3, // Asumiendo que 3 es "Rechazado"
        motivoRechazo,
      }
    );

    if (errorPrestamo) {
      return handleErrorClient(res, 400, "Error rechazando el préstamo", errorPrestamo);
    }

    handleSuccess(res, 200, "Préstamo rechazado correctamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function entregarPrestamo(req, res) {
  try {
    const { id } = req.body;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID de préstamo inválido");
    }

    const [prestamo, errorPrestamo] = await updateEstadoPrestamoService(
      parseInt(id, 10),
      { estadoPrestamoId: 4 } // Asumiendo que 4 es "Entregado"
    );

    if (errorPrestamo) {
      return handleErrorClient(res, 400, "Error marcando préstamo como entregado", errorPrestamo);
    }

    handleSuccess(res, 200, "Préstamo marcado como entregado correctamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function devolverPrestamo(req, res) {
  try {
    const { id } = req.body;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID de préstamo inválido");
    }

    const [prestamo, errorPrestamo] = await updateEstadoPrestamoService(
      parseInt(id, 10),
      { estadoPrestamoId: 5 } // 5 es "Devuelto"
    );

    if (errorPrestamo) {
      return handleErrorClient(res, 400, "Error marcando préstamo como devuelto", errorPrestamo);
    }

    handleSuccess(res, 200, "Préstamo marcado como devuelto correctamente", prestamo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
