"use strict";
import Joi from "joi";

export const tipoDocumentoQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  nombre: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre del tipo de documento no puede estar vacío.",
      "string.base": "El nombre del tipo de documento debe ser de tipo string.",
      "string.min": "El nombre del tipo de documento debe tener como mínimo 2 caracteres.",
      "string.max": "El nombre del tipo de documento debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El nombre del tipo de documento solo puede contener letras y espacios.",
    }),
})
  .or("id", "nombre")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id o nombre.",
  });

export const tipoDocumentoBodyValidation = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.empty": "El nombre del tipo de documento no puede estar vacío.",
      "string.base": "El nombre del tipo de documento debe ser de tipo string.",
      "string.min": "El nombre del tipo de documento debe tener como mínimo 2 caracteres.",
      "string.max": "El nombre del tipo de documento debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El nombre del tipo de documento solo puede contener letras y espacios.",
      "any.required": "El nombre del tipo de documento es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
