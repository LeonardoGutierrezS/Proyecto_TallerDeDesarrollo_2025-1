"use strict";
import Joi from "joi";

/**
 * Validación para crear penalización
 */
export const penalizacionValidation = Joi.object({
  Descripcion: Joi.string()
    .min(3)
    .max(500)
    .required()
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "any.required": "La descripción es obligatoria.",
      "string.base": "La descripción debe ser de tipo texto.",
      "string.min": "La descripción debe tener al menos 3 caracteres.",
      "string.max": "La descripción debe tener como máximo 500 caracteres.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

/**
 * Validación para actualizar penalización
 */
export const updatePenalizacionValidation = Joi.object({
  Descripcion: Joi.string()
    .min(3)
    .max(500)
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "string.base": "La descripción debe ser de tipo texto.",
      "string.min": "La descripción debe tener al menos 3 caracteres.",
      "string.max": "La descripción debe tener como máximo 500 caracteres.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
