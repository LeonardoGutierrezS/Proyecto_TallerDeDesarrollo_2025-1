"use strict";
import {
  createHoraDisponibleService,
  createMultipleHorasService,
  createMultipleHorasServiceBulk,
  deleteHoraDisponibleService,
  getHoraDisponibleService,
  getHorasDisponiblesByEquipoService,
  getHorasRealmenterDisponiblesByEquipoService,
  getRangosHorariosDisponiblesService,
  getHorasDisponiblesByFechaService,
  getHorasDisponiblesByRangoService,
  getHorasDisponiblesService,
  marcarHoraNoDisponibleService,
  updateHoraDisponibleService,
} from "../services/hora-disponible.service.js";
import {
  horaDisponibleBodyValidation,
  horaDisponibleQueryValidation,
  horaDisponibleUpdateValidation,
  horarioRangoValidation,
} from "../validations/hora-disponible.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getHoraDisponible(req, res) {
  try {
    const { id, equipoId, fecha, disponible } = req.query;

    const { error } = horaDisponibleQueryValidation.validate({
      id,
      equipoId,
      fecha,
      disponible,
    });

    if (error) return handleErrorClient(res, 400, error.message);

    const [hora, errorHora] = await getHoraDisponibleService({
      id,
      equipoId,
      fecha,
      disponible,
    });

    if (errorHora) return handleErrorClient(res, 404, errorHora);

    handleSuccess(res, 200, "Hora disponible encontrada", hora);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getHorasDisponibles(req, res) {
  try {
    const [horas, errorHoras] = await getHorasDisponiblesService();

    if (errorHoras) return handleErrorClient(res, 404, errorHoras);

    horas.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Horas disponibles encontradas", horas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getHorasDisponiblesByEquipo(req, res) {
  try {
    const { equipoId } = req.query; // Cambiar de req.params a req.query

    if (!equipoId || isNaN(equipoId)) {
      return handleErrorClient(res, 400, "ID de equipo inválido");
    }

    const [horas, errorHoras] = await getHorasDisponiblesByEquipoService(parseInt(equipoId, 10));

    if (errorHoras) return handleErrorClient(res, 404, errorHoras);

    horas.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Horas disponibles encontradas por equipo", horas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getHorasRealmenteDisponiblesByEquipo(req, res) {
  try {
    const { equipoId, fecha } = req.query;

    if (!equipoId || isNaN(equipoId)) {
      return handleErrorClient(res, 400, "ID de equipo inválido");
    }

    const [horas, errorHoras] = await getHorasRealmenterDisponiblesByEquipoService(
      parseInt(equipoId, 10), 
      fecha
    );

    if (errorHoras) return handleErrorClient(res, 404, errorHoras);

    horas.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Horas realmente disponibles encontradas", horas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getRangosHorariosDisponibles(req, res) {
  try {
    const { equipoId, fecha } = req.query;

    if (!equipoId || isNaN(equipoId)) {
      return handleErrorClient(res, 400, "ID de equipo inválido");
    }

    if (!fecha) {
      return handleErrorClient(res, 400, "Fecha requerida");
    }

    const [rangos, errorRangos] = await getRangosHorariosDisponiblesService(
      parseInt(equipoId, 10), 
      fecha
    );

    if (errorRangos) return handleErrorClient(res, 404, errorRangos);

    rangos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Rangos horarios disponibles encontrados", rangos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getHorasDisponiblesByFecha(req, res) {
  try {
    const { fecha } = req.query; // Cambiar de req.params a req.query

    if (!fecha) {
      return handleErrorClient(res, 400, "Fecha requerida");
    }

    const [horas, errorHoras] = await getHorasDisponiblesByFechaService(fecha);

    if (errorHoras) return handleErrorClient(res, 404, errorHoras);

    horas.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Horas disponibles encontradas por fecha", horas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getHorasDisponiblesByRango(req, res) {
  try {
    const { equipoId, fechaInicio, fechaFin } = req.query;

    const { error } = horarioRangoValidation.validate({
      equipoId,
      fechaInicio,
      fechaFin,
    });

    if (error) return handleErrorClient(res, 400, error.message);

    const [horas, errorHoras] = await getHorasDisponiblesByRangoService(
      parseInt(equipoId, 10),
      fechaInicio,
      fechaFin
    );

    if (errorHoras) return handleErrorClient(res, 404, errorHoras);

    horas.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Horas disponibles encontradas en el rango", horas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createHoraDisponible(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = horaDisponibleBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [hora, errorHora] = await createHoraDisponibleService(body);

    if (errorHora) return handleErrorClient(res, 400, "Error creando la hora disponible", errorHora);

    handleSuccess(res, 201, "Hora disponible creada correctamente", hora);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createMultipleHoras(req, res) {
  try {
    const { equipoId, fecha, horas } = req.body;

    if (!equipoId || !fecha || !horas || !Array.isArray(horas)) {
      return handleErrorClient(
        res,
        400,
        "equipoId, fecha y horas (array) son requeridos"
      );
    }

    const [horasCreadas, errores] = await createMultipleHorasService(equipoId, fecha, horas);

    if (!horasCreadas) return handleErrorClient(res, 400, "Error creando las horas", errores);

    const mensaje = errores && errores.length > 0
      ? `Horas creadas con algunas advertencias: ${errores.join(", ")}`
      : "Horas creadas correctamente";

    handleSuccess(res, 201, mensaje, horasCreadas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateHoraDisponible(req, res) {
  try {
    const { id, equipoId, fecha, disponible } = req.query;
    const { body } = req;

    const { error: queryError } = horaDisponibleQueryValidation.validate({
      id,
      equipoId,
      fecha,
      disponible,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = horaDisponibleUpdateValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [hora, errorHora] = await updateHoraDisponibleService({
      id,
      equipoId,
      fecha,
      disponible,
    }, body);

    if (errorHora) return handleErrorClient(res, 400, "Error modificando la hora disponible", errorHora);

    handleSuccess(res, 200, "Hora disponible modificada correctamente", hora);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function marcarHoraNoDisponible(req, res) {
  try {
    const { equipoId, fecha, hora } = req.body;

    if (!equipoId || !fecha || !hora) {
      return handleErrorClient(res, 400, "equipoId, fecha y hora son requeridos");
    }

    const [horaUpdated, errorHora] = await marcarHoraNoDisponibleService(equipoId, fecha, hora);

    if (errorHora) return handleErrorClient(res, 400, "Error marcando hora como no disponible", errorHora);

    handleSuccess(res, 200, "Hora marcada como no disponible", horaUpdated);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteHoraDisponible(req, res) {
  try {
    const { id, equipoId, fecha, disponible } = req.query;

    const { error: queryError } = horaDisponibleQueryValidation.validate({
      id,
      equipoId,
      fecha,
      disponible,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [horaDeleted, errorHoraDeleted] = await deleteHoraDisponibleService({
      id,
      equipoId,
      fecha,
      disponible,
    });

    if (errorHoraDeleted) {
      return handleErrorClient(res, 404, "Error eliminando la hora disponible", errorHoraDeleted);
    }

    handleSuccess(res, 200, "Hora disponible eliminada correctamente", horaDeleted);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function generarHoras(req, res) {
  try {
    console.log("Datos recibidos para generar horas:", req.body);
    const { equipos, fechaInicio, fechaFin, horaInicio, horaFin, diasSemana, duracion } = req.body;

    // Validación básica
    if (!equipos || !Array.isArray(equipos) || equipos.length === 0) {
      console.log("Error: equipos inválidos", equipos);
      return handleErrorClient(res, 400, "Debe seleccionar al menos un equipo");
    }

    if (!fechaInicio || !fechaFin) {
      console.log("Error: fechas inválidas", { fechaInicio, fechaFin });
      return handleErrorClient(res, 400, "Debe especificar el rango de fechas");
    }

    if (!horaInicio || !horaFin) {
      console.log("Error: horas inválidas", { horaInicio, horaFin });
      return handleErrorClient(res, 400, "Debe especificar el rango de horas");
    }

    if (!diasSemana || !Array.isArray(diasSemana) || diasSemana.length === 0) {
      console.log("Error: días de semana inválidos", diasSemana);
      return handleErrorClient(res, 400, "Debe seleccionar al menos un día de la semana");
    }

    const [horasCreadas, errorCreacion] = await createMultipleHorasServiceBulk({
      equipos,
      fechaInicio,
      fechaFin,
      horaInicio,
      horaFin,
      diasSemana,
      duracion: duracion || 60 // Duración por defecto de 60 minutos
    });

    if (errorCreacion) {
      return handleErrorClient(res, 400, "Error generando las horas disponibles", errorCreacion);
    }

    handleSuccess(res, 201, "Horas disponibles generadas exitosamente", {
      horasCreadas: horasCreadas.length,
      horas: horasCreadas
    });
  } catch (error) {
    console.error("Error en generarHoras:", error);
    handleErrorServer(res, 500, error.message);
  }
}
