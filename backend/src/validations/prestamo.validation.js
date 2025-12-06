"use strict";
import Joi from "joi";

/**
 * Validación para crear préstamo
 */
export const prestamoValidation = Joi.object({
  ID_Usuario: Joi.number()
    .integer()
    .positive()
    .optional() // Cambiado a opcional porque se obtiene del token JWT
    .messages({
      "number.base": "El ID de usuario debe ser un número.",
      "number.integer": "El ID de usuario debe ser un número entero.",
      "number.positive": "El ID de usuario debe ser un número positivo.",
    }),
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
  Fecha_inicio_prestamo: Joi.date()
    .messages({
      "date.base": "La fecha de inicio debe ser una fecha válida.",
    }),
  Hora_inicio_prestamo: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .required()
    .messages({
      "string.empty": "La hora de inicio no puede estar vacía.",
      "any.required": "La hora de inicio es obligatoria.",
      "string.base": "La hora de inicio debe ser de tipo texto.",
      "string.pattern.base": "La hora debe tener el formato HH:MM o HH:MM:SS.",
    }),
  Fecha_ter_prestamo: Joi.date()
    .allow(null)
    .messages({
      "date.base": "La fecha de término debe ser una fecha válida.",
    }),
  Hora_fin_prestamo: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .allow(null, "")
    .messages({
      "string.base": "La hora de fin debe ser de tipo texto.",
      "string.pattern.base": "La hora debe tener el formato HH:MM o HH:MM:SS.",
    }),
  Motivo_Rechazo: Joi.string()
    .max(500)
    .allow(null, "")
    .messages({
      "string.base": "El motivo de rechazo debe ser de tipo texto.",
      "string.max": "El motivo de rechazo debe tener como máximo 500 caracteres.",
    }),
  Retencion_documento: Joi.string()
    .max(100)
    .allow(null, "")
    .messages({
      "string.base": "La retención de documento debe ser de tipo texto.",
      "string.max": "La retención de documento debe tener como máximo 100 caracteres.",
    }),
  Condiciones_Prestamo: Joi.string()
    .max(500)
    .allow(null, "")
    .messages({
      "string.base": "Las condiciones del préstamo deben ser de tipo texto.",
      "string.max": "Las condiciones del préstamo deben tener como máximo 500 caracteres.",
    }),
  Observaciones: Joi.string()
    .max(500)
    .allow(null, "")
    .messages({
      "string.base": "Las observaciones deben ser de tipo texto.",
      "string.max": "Las observaciones deben tener como máximo 500 caracteres.",
    }),
  ID_Categoria: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de categoría debe ser un número.",
      "number.integer": "El ID de categoría debe ser un número entero.",
      "number.positive": "El ID de categoría debe ser un número positivo.",
      "any.required": "El ID de categoría es obligatorio.",
    }),
  ID_Estado_Prestamo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de estado de préstamo debe ser un número.",
      "number.integer": "El ID de estado de préstamo debe ser un número entero.",
      "number.positive": "El ID de estado de préstamo debe ser un número positivo.",
      "any.required": "El ID de estado de préstamo es obligatorio.",
    }),
  ID_Tipo_Documento: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .messages({
      "number.base": "El ID de tipo de documento debe ser un número.",
      "number.integer": "El ID de tipo de documento debe ser un número entero.",
      "number.positive": "El ID de tipo de documento debe ser un número positivo.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

/**
 * Validación para finalizar préstamo
 */
export const finalizarPrestamoValidation = Joi.object({
  Fecha_devolucion: Joi.date()
    .messages({
      "date.base": "La fecha de devolución debe ser una fecha válida.",
    }),
  Hora_devolucion: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .required()
    .messages({
      "string.empty": "La hora de devolución no puede estar vacía.",
      "any.required": "La hora de devolución es obligatoria.",
      "string.base": "La hora de devolución debe ser de tipo texto.",
      "string.pattern.base": "La hora debe tener el formato HH:MM o HH:MM:SS.",
    }),
  Observaciones: Joi.string()
    .max(500)
    .allow(null, "")
    .messages({
      "string.base": "Las observaciones deben ser de tipo texto.",
      "string.max": "Las observaciones deben tener como máximo 500 caracteres.",
    }),
  ID_Estado_Prestamo: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de estado de préstamo debe ser un número.",
      "number.integer": "El ID de estado de préstamo debe ser un número entero.",
      "number.positive": "El ID de estado de préstamo debe ser un número positivo.",
      "any.required": "El ID de estado de préstamo es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
