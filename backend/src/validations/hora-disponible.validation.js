"use strict";
import Joi from "joi";

export const horaDisponibleQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  equipoId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del equipo debe ser un número.",
      "number.integer": "El id del equipo debe ser un número entero.",
      "number.positive": "El id del equipo debe ser un número positivo.",
    }),
  fecha: Joi.date()
    .iso()
    .messages({
      "date.base": "La fecha debe ser una fecha válida.",
      "date.format": "La fecha debe estar en formato ISO (YYYY-MM-DD).",
    }),
  disponible: Joi.boolean()
    .messages({
      "boolean.base": "El estado de disponibilidad debe ser verdadero o falso.",
    }),
})
  .or("id", "equipoId", "fecha", "disponible")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro de búsqueda.",
  });

export const horaDisponibleBodyValidation = Joi.object({
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
  hora: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.empty": "La hora no puede estar vacía.",
      "string.base": "La hora debe ser de tipo string.",
      "string.pattern.base": "La hora debe estar en formato HH:MM (24 horas).",
      "any.required": "La hora es obligatoria.",
    }),
  fecha: Joi.date()
    .iso()
    .min("now")
    .required()
    .messages({
      "date.base": "La fecha debe ser una fecha válida.",
      "date.format": "La fecha debe estar en formato ISO (YYYY-MM-DD).",
      "date.min": "La fecha no puede ser anterior a hoy.",
      "any.required": "La fecha es obligatoria.",
    }),
  disponible: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "El estado de disponibilidad debe ser verdadero o falso.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const horaDisponibleUpdateValidation = Joi.object({
  equipoId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del equipo debe ser un número.",
      "number.integer": "El id del equipo debe ser un número entero.",
      "number.positive": "El id del equipo debe ser un número positivo.",
    }),
  hora: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.empty": "La hora no puede estar vacía.",
      "string.base": "La hora debe ser de tipo string.",
      "string.pattern.base": "La hora debe estar en formato HH:MM (24 horas).",
    }),
  fecha: Joi.date()
    .iso()
    .messages({
      "date.base": "La fecha debe ser una fecha válida.",
      "date.format": "La fecha debe estar en formato ISO (YYYY-MM-DD).",
    }),
  disponible: Joi.boolean()
    .messages({
      "boolean.base": "El estado de disponibilidad debe ser verdadero o falso.",
    }),
})
  .or("equipoId", "hora", "fecha", "disponible")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un campo para actualizar.",
  });

export const horarioRangoValidation = Joi.object({
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
  fechaInicio: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
      "date.format": "La fecha de inicio debe estar en formato ISO (YYYY-MM-DD).",
      "any.required": "La fecha de inicio es obligatoria.",
    }),
  fechaFin: Joi.date()
    .iso()
    .min(Joi.ref("fechaInicio"))
    .required()
    .messages({
      "date.base": "La fecha de fin debe ser una fecha válida.",
      "date.format": "La fecha de fin debe estar en formato ISO (YYYY-MM-DD).",
      "date.min": "La fecha de fin debe ser posterior o igual a la fecha de inicio.",
      "any.required": "La fecha de fin es obligatoria.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
