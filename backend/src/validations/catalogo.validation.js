"use strict";
import Joi from "joi";

/**
 * Validación genérica para catálogos simples (nombre de campo configurable)
 */
export const catalogoValidation = (fieldName, minLength = 3, maxLength = 100) => {
  return Joi.object({
    [fieldName]: Joi.string()
      .min(minLength)
      .max(maxLength)
      .required()
      .messages({
        "string.empty": `El campo ${fieldName} no puede estar vacío.`,
        "any.required": `El campo ${fieldName} es obligatorio.`,
        "string.base": `El campo ${fieldName} debe ser de tipo texto.`,
        "string.min": `El campo ${fieldName} debe tener al menos ${minLength} caracteres.`,
        "string.max": `El campo ${fieldName} debe tener como máximo ${maxLength} caracteres.`,
      }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "No se permiten propiedades adicionales.",
    });
};

/**
 * Validación genérica para ID numérico
 */
export const idValidation = Joi.object({
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

/**
 * Validaciones específicas para cada catálogo
 */
export const motivoValidation = catalogoValidation("Motivo", 5, 100);
export const tipoDocumentoValidation = catalogoValidation("Documento", 3, 50);
export const marcaValidation = catalogoValidation("Marca", 2, 50);
export const estadoValidation = catalogoValidation("Estado", 3, 50);
export const categoriaValidation = catalogoValidation("Categoria", 3, 50);
export const estadoPrestamoValidation = catalogoValidation("Estado_Prestamo", 3, 50);
