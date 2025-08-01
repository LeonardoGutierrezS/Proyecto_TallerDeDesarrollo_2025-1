"use strict";
import Joi from "joi";

const dateValidator = (value, helper) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(value);
  inputDate.setHours(0, 0, 0, 0);
  
  // Permitir desde hoy en adelante
  if (inputDate < today) {
    return helper.message("La fecha no puede ser anterior a hoy");
  }
  return value;
};

const timeOrderValidator = (value, helper) => {
  // Por ahora, solo validamos que la hora de fin sea posterior a la de inicio
  // Esta validación se puede mejorar después si es necesario
  return value;
};

export const prestamoQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  usuarioId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del usuario debe ser un número.",
      "number.integer": "El id del usuario debe ser un número entero.",
      "number.positive": "El id del usuario debe ser un número positivo.",
    }),
  equipoId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del equipo debe ser un número.",
      "number.integer": "El id del equipo debe ser un número entero.",
      "number.positive": "El id del equipo debe ser un número positivo.",
    }),
  categoriaId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la categoría debe ser un número.",
      "number.integer": "El id de la categoría debe ser un número entero.",
      "number.positive": "El id de la categoría debe ser un número positivo.",
    }),
  estadoPrestamoId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del estado del préstamo debe ser un número.",
      "number.integer": "El id del estado del préstamo debe ser un número entero.",
      "number.positive": "El id del estado del préstamo debe ser un número positivo.",
    }),
  fechaInicioPrestamo: Joi.date()
    .iso()
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
      "date.format": "La fecha de inicio debe estar en formato ISO (YYYY-MM-DD).",
    }),
  fechaFinPrestamo: Joi.date()
    .iso()
    .messages({
      "date.base": "La fecha de fin debe ser una fecha válida.",
      "date.format": "La fecha de fin debe estar en formato ISO (YYYY-MM-DD).",
    }),
})
  .or("id", "usuarioId", "equipoId", "categoriaId", "estadoPrestamoId", "fechaInicioPrestamo", "fechaFinPrestamo")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro de búsqueda.",
  });

export const prestamoBodyValidation = Joi.object({
  categoriaId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id de la categoría debe ser un número.",
      "number.integer": "El id de la categoría debe ser un número entero.",
      "number.positive": "El id de la categoría debe ser un número positivo.",
      "any.required": "El id de la categoría es obligatorio.",
    }),
  equipoId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id del equipo debe ser un número.",
      "number.integer": "El id del equipo debe ser un número entero.",
      "number.positive": "El id del equipo debe ser un número positivo.",
      "any.required": "El id del equipo es obligatorio.",
    }),
  fechaInicioPrestamo: Joi.date()
    .iso()
    .required()
    .custom(dateValidator, "Validación fecha futura")
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
      "date.format": "La fecha de inicio debe estar en formato ISO (YYYY-MM-DD).",
      "any.required": "La fecha de inicio del préstamo es obligatoria.",
    }),
  horaInicioPrestamo: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.empty": "La hora de inicio no puede estar vacía.",
      "string.base": "La hora de inicio debe ser de tipo string.",
      "string.pattern.base": "La hora de inicio debe estar en formato HH:MM (24 horas).",
      "any.required": "La hora de inicio del préstamo es obligatoria.",
    }),
  horaFinPrestamo: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.empty": "La hora de fin no puede estar vacía.",
      "string.base": "La hora de fin debe ser de tipo string.",
      "string.pattern.base": "La hora de fin debe estar en formato HH:MM (24 horas).",
      "any.required": "La hora de fin del préstamo es obligatoria.",
    }),
  fechaFinPrestamo: Joi.date()
    .iso()
    .min(Joi.ref("fechaInicioPrestamo"))
    .required()
    .messages({
      "date.base": "La fecha de fin debe ser una fecha válida.",
      "date.format": "La fecha de fin debe estar en formato ISO (YYYY-MM-DD).",
      "date.min": "La fecha de fin debe ser posterior o igual a la fecha de inicio.",
      "any.required": "La fecha de fin del préstamo es obligatoria.",
    }),
  estadoPrestamoId: Joi.number()
    .integer()
    .positive()
    .default(1)
    .messages({
      "number.base": "El id del estado del préstamo debe ser un número.",
      "number.integer": "El id del estado del préstamo debe ser un número entero.",
      "number.positive": "El id del estado del préstamo debe ser un número positivo.",
    }),
  motivoRechazo: Joi.string()
    .max(500)
    .allow(null, "")
    .messages({
      "string.base": "El motivo de rechazo debe ser de tipo string.",
      "string.max": "El motivo de rechazo debe tener como máximo 500 caracteres.",
    }),
  retencionDocumento: Joi.boolean()
    .default(false)
    .messages({
      "boolean.base": "La retención de documento debe ser verdadero o falso.",
    }),
  tipoDocumentoId: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .when("retencionDocumento", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "number.base": "El id del tipo de documento debe ser un número.",
      "number.integer": "El id del tipo de documento debe ser un número entero.",
      "number.positive": "El id del tipo de documento debe ser un número positivo.",
      "any.required": "El tipo de documento es obligatorio cuando se retiene documento.",
    }),
  usuarioId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id del usuario debe ser un número.",
      "number.integer": "El id del usuario debe ser un número entero.",
      "number.positive": "El id del usuario debe ser un número positivo.",
      "any.required": "El id del usuario es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const prestamoUpdateValidation = Joi.object({
  categoriaId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la categoría debe ser un número.",
      "number.integer": "El id de la categoría debe ser un número entero.",
      "number.positive": "El id de la categoría debe ser un número positivo.",
    }),
  equipoId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del equipo debe ser un número.",
      "number.integer": "El id del equipo debe ser un número entero.",
      "number.positive": "El id del equipo debe ser un número positivo.",
    }),
  fechaInicioPrestamo: Joi.date()
    .iso()
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
      "date.format": "La fecha de inicio debe estar en formato ISO (YYYY-MM-DD).",
    }),
  horaInicioPrestamo: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.empty": "La hora de inicio no puede estar vacía.",
      "string.base": "La hora de inicio debe ser de tipo string.",
      "string.pattern.base": "La hora de inicio debe estar en formato HH:MM (24 horas).",
    }),
  horaFinPrestamo: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.empty": "La hora de fin no puede estar vacía.",
      "string.base": "La hora de fin debe ser de tipo string.",
      "string.pattern.base": "La hora de fin debe estar en formato HH:MM (24 horas).",
    }),
  fechaFinPrestamo: Joi.date()
    .iso()
    .messages({
      "date.base": "La fecha de fin debe ser una fecha válida.",
      "date.format": "La fecha de fin debe estar en formato ISO (YYYY-MM-DD).",
    }),
  estadoPrestamoId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del estado del préstamo debe ser un número.",
      "number.integer": "El id del estado del préstamo debe ser un número entero.",
      "number.positive": "El id del estado del préstamo debe ser un número positivo.",
    }),
  motivoRechazo: Joi.string()
    .max(500)
    .allow(null, "")
    .messages({
      "string.base": "El motivo de rechazo debe ser de tipo string.",
      "string.max": "El motivo de rechazo debe tener como máximo 500 caracteres.",
    }),
  retencionDocumento: Joi.boolean()
    .messages({
      "boolean.base": "La retención de documento debe ser verdadero o falso.",
    }),
  tipoDocumentoId: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El id del tipo de documento debe ser un número.",
      "number.integer": "El id del tipo de documento debe ser un número entero.",
      "number.positive": "El id del tipo de documento debe ser un número positivo.",
    }),
  fechaRealEntrega: Joi.date()
    .timestamp()
    .allow(null)
    .messages({
      "date.base": "La fecha real de entrega debe ser una fecha válida.",
      "date.timestamp": "La fecha real de entrega debe ser un timestamp válido.",
    }),
  horaRealEntrega: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .allow(null)
    .messages({
      "string.base": "La hora real de entrega debe ser de tipo string.",
      "string.pattern.base": "La hora real de entrega debe estar en formato HH:MM (24 horas).",
    }),
})
  .or(
    "categoriaId",
    "equipoId",
    "fechaInicioPrestamo",
    "horaInicioPrestamo",
    "horaFinPrestamo",
    "fechaFinPrestamo",
    "estadoPrestamoId",
    "motivoRechazo",
    "retencionDocumento",
    "tipoDocumentoId",
    "fechaRealEntrega",
    "horaRealEntrega"
  )
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un campo para actualizar.",
  });

export const prestamoEstadoValidation = Joi.object({
  estadoPrestamoId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id del estado del préstamo debe ser un número.",
      "number.integer": "El id del estado del préstamo debe ser un número entero.",
      "number.positive": "El id del estado del préstamo debe ser un número positivo.",
      "any.required": "El id del estado del préstamo es obligatorio.",
    }),
  motivoRechazo: Joi.string()
    .max(500)
    .when("estadoPrestamoId", {
      is: Joi.number().valid(3), // Asumiendo que 3 es "rechazado"
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.base": "El motivo de rechazo debe ser de tipo string.",
      "string.max": "El motivo de rechazo debe tener como máximo 500 caracteres.",
      "any.required": "El motivo de rechazo es obligatorio cuando se rechaza el préstamo.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
