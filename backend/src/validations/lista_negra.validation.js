"use strict";
import Joi from "joi";

/**
 * Validación para crear lista negra
 */
export const listaNegraValidation = Joi.object({
  ID_Usuario: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de usuario debe ser un número.",
      "number.integer": "El ID de usuario debe ser un número entero.",
      "number.positive": "El ID de usuario debe ser un número positivo.",
      "any.required": "El ID de usuario es obligatorio.",
    }),
  ID_Prestamo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de préstamo debe ser un número.",
      "number.integer": "El ID de préstamo debe ser un número entero.",
      "number.positive": "El ID de préstamo debe ser un número positivo.",
      "any.required": "El ID de préstamo es obligatorio.",
    }),
  ID_Motivo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de motivo debe ser un número.",
      "number.integer": "El ID de motivo debe ser un número entero.",
      "number.positive": "El ID de motivo debe ser un número positivo.",
      "any.required": "El ID de motivo es obligatorio.",
    }),
  fecha_inicio: Joi.date()
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
    }),
  fecha_termino: Joi.date()
    .required()
    .greater(Joi.ref("fecha_inicio"))
    .messages({
      "date.base": "La fecha de término debe ser una fecha válida.",
      "any.required": "La fecha de término es obligatoria.",
      "date.greater": "La fecha de término debe ser posterior a la fecha de inicio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

/**
 * Validación para actualizar lista negra
 */
export const listaNegraUpdateValidation = Joi.object({
  ID_Motivo: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El ID de motivo debe ser un número.",
      "number.integer": "El ID de motivo debe ser un número entero.",
      "number.positive": "El ID de motivo debe ser un número positivo.",
    }),
  fecha_inicio: Joi.date()
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
    }),
  fecha_termino: Joi.date()
    .messages({
      "date.base": "La fecha de término debe ser una fecha válida.",
    }),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.min": "Debes proporcionar al menos un campo para actualizar.",
  });
