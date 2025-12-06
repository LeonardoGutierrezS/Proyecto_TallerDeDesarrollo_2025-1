"use strict";
import Joi from "joi";

/**
 * Validación para crear/actualizar carrera
 */
export const carreraValidation = Joi.object({
  Carrera: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      "string.empty": "La carrera no puede estar vacía.",
      "any.required": "La carrera es obligatoria.",
      "string.base": "La carrera debe ser de tipo texto.",
      "string.min": "La carrera debe tener al menos 5 caracteres.",
      "string.max": "La carrera debe tener como máximo 100 caracteres.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

/**
 * Validación para ID de carrera
 */
export const carreraIdValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID debe ser un número.",
      "number.integer": "El ID debe ser un número entero.",
      "number.positive": "El ID debe ser un número positivo.",
      "any.required": "El ID es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
