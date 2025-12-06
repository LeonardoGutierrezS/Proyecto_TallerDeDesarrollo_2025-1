"use strict";
import Joi from "joi";

/**
 * Validación para crear/actualizar rol
 */
export const rolValidation = Joi.object({
  Rol: Joi.string()
    .min(4)
    .max(50)
    .required()
    .messages({
      "string.empty": "El rol no puede estar vacío.",
      "any.required": "El rol es obligatorio.",
      "string.base": "El rol debe ser de tipo texto.",
      "string.min": "El rol debe tener al menos 4 caracteres.",
      "string.max": "El rol debe tener como máximo 50 caracteres.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

/**
 * Validación para ID de rol
 */
export const rolIdValidation = Joi.object({
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
