"use strict";
import Joi from "joi";

/**
 * Validación para crear detalles de notebook
 */
export const detallesNotebookValidation = Joi.object({
  ID_Num_Inv: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "El número de inventario no puede estar vacío.",
      "any.required": "El número de inventario es obligatorio.",
      "string.base": "El número de inventario debe ser de tipo texto.",
      "string.min": "El número de inventario debe tener al menos 3 caracteres.",
      "string.max": "El número de inventario debe tener como máximo 50 caracteres.",
    }),
  Procesador: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "El procesador no puede estar vacío.",
      "any.required": "El procesador es obligatorio.",
      "string.base": "El procesador debe ser de tipo texto.",
      "string.min": "El procesador debe tener al menos 3 caracteres.",
      "string.max": "El procesador debe tener como máximo 100 caracteres.",
    }),
  Ram: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "La RAM no puede estar vacía.",
      "any.required": "La RAM es obligatoria.",
      "string.base": "La RAM debe ser de tipo texto.",
      "string.min": "La RAM debe tener al menos 2 caracteres.",
      "string.max": "La RAM debe tener como máximo 50 caracteres.",
    }),
  Tipo_Almacenamiento: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "El tipo de almacenamiento no puede estar vacío.",
      "any.required": "El tipo de almacenamiento es obligatorio.",
      "string.base": "El tipo de almacenamiento debe ser de tipo texto.",
      "string.min": "El tipo de almacenamiento debe tener al menos 2 caracteres.",
      "string.max": "El tipo de almacenamiento debe tener como máximo 50 caracteres.",
    }),
  Capacidad_Almacenamiento: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "La capacidad de almacenamiento no puede estar vacía.",
      "any.required": "La capacidad de almacenamiento es obligatoria.",
      "string.base": "La capacidad de almacenamiento debe ser de tipo texto.",
      "string.min": "La capacidad de almacenamiento debe tener al menos 2 caracteres.",
      "string.max": "La capacidad de almacenamiento debe tener como máximo 50 caracteres.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

/**
 * Validación para actualizar detalles de notebook
 */
export const detallesNotebookUpdateValidation = Joi.object({
  Procesador: Joi.string()
    .min(3)
    .max(100)
    .messages({
      "string.empty": "El procesador no puede estar vacío.",
      "string.base": "El procesador debe ser de tipo texto.",
      "string.min": "El procesador debe tener al menos 3 caracteres.",
      "string.max": "El procesador debe tener como máximo 100 caracteres.",
    }),
  Ram: Joi.string()
    .min(2)
    .max(50)
    .messages({
      "string.empty": "La RAM no puede estar vacía.",
      "string.base": "La RAM debe ser de tipo texto.",
      "string.min": "La RAM debe tener al menos 2 caracteres.",
      "string.max": "La RAM debe tener como máximo 50 caracteres.",
    }),
  Tipo_Almacenamiento: Joi.string()
    .min(2)
    .max(50)
    .messages({
      "string.empty": "El tipo de almacenamiento no puede estar vacío.",
      "string.base": "El tipo de almacenamiento debe ser de tipo texto.",
      "string.min": "El tipo de almacenamiento debe tener al menos 2 caracteres.",
      "string.max": "El tipo de almacenamiento debe tener como máximo 50 caracteres.",
    }),
  Capacidad_Almacenamiento: Joi.string()
    .min(2)
    .max(50)
    .messages({
      "string.empty": "La capacidad de almacenamiento no puede estar vacía.",
      "string.base": "La capacidad de almacenamiento debe ser de tipo texto.",
      "string.min": "La capacidad de almacenamiento debe tener al menos 2 caracteres.",
      "string.max": "La capacidad de almacenamiento debe tener como máximo 50 caracteres.",
    }),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.min": "Debes proporcionar al menos un campo para actualizar.",
  });
