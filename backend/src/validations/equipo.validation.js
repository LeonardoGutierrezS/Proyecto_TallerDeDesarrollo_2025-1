"use strict";
import Joi from "joi";

export const equipoQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  marcaId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la marca debe ser un número.",
      "number.integer": "El id de la marca debe ser un número entero.",
      "number.positive": "El id de la marca debe ser un número positivo.",
    }),
  modelo: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/)
    .messages({
      "string.empty": "El modelo no puede estar vacío.",
      "string.base": "El modelo debe ser de tipo string.",
      "string.min": "El modelo debe tener como mínimo 1 carácter.",
      "string.max": "El modelo debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El modelo solo puede contener letras, números, espacios, guiones y puntos.",
    }),
  numeroDeSerie: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\-]+$/)
    .messages({
      "string.empty": "El número de serie no puede estar vacío.",
      "string.base": "El número de serie debe ser de tipo string.",
      "string.min": "El número de serie debe tener como mínimo 1 carácter.",
      "string.max": "El número de serie debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El número de serie solo puede contener letras, números y guiones.",
    }),
  categoriaId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la categoría debe ser un número.",
      "number.integer": "El id de la categoría debe ser un número entero.",
      "number.positive": "El id de la categoría debe ser un número positivo.",
    }),
  estadoAltaBajaId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del estado debe ser un número.",
      "number.integer": "El id del estado debe ser un número entero.",
      "number.positive": "El id del estado debe ser un número positivo.",
    }),
})
  .or("id", "marcaId", "modelo", "numeroDeSerie", "categoriaId", "estadoAltaBajaId")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro de búsqueda.",
  });

export const equipoBodyValidation = Joi.object({
  marcaId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id de la marca debe ser un número.",
      "number.integer": "El id de la marca debe ser un número entero.",
      "number.positive": "El id de la marca debe ser un número positivo.",
      "any.required": "El id de la marca es obligatorio.",
    }),
  modelo: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/)
    .required()
    .messages({
      "string.empty": "El modelo no puede estar vacío.",
      "string.base": "El modelo debe ser de tipo string.",
      "string.min": "El modelo debe tener como mínimo 1 carácter.",
      "string.max": "El modelo debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El modelo solo puede contener letras, números, espacios, guiones y puntos.",
      "any.required": "El modelo es obligatorio.",
    }),
  numeroDeSerie: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\-]+$/)
    .required()
    .messages({
      "string.empty": "El número de serie no puede estar vacío.",
      "string.base": "El número de serie debe ser de tipo string.",
      "string.min": "El número de serie debe tener como mínimo 1 carácter.",
      "string.max": "El número de serie debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El número de serie solo puede contener letras, números y guiones.",
      "any.required": "El número de serie es obligatorio.",
    }),
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
  estadoAltaBajaId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id del estado debe ser un número.",
      "number.integer": "El id del estado debe ser un número entero.",
      "number.positive": "El id del estado debe ser un número positivo.",
      "any.required": "El id del estado es obligatorio.",
    }),
  fechaAltaLab: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "La fecha de alta debe ser una fecha válida.",
      "date.format": "La fecha de alta debe estar en formato ISO (YYYY-MM-DD).",
      "any.required": "La fecha de alta es obligatoria.",
    }),
  fechaBajaLab: Joi.date()
    .iso()
    .allow(null)
    .messages({
      "date.base": "La fecha de baja debe ser una fecha válida.",
      "date.format": "La fecha de baja debe estar en formato ISO (YYYY-MM-DD).",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const equipoUpdateValidation = Joi.object({
  marcaId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la marca debe ser un número.",
      "number.integer": "El id de la marca debe ser un número entero.",
      "number.positive": "El id de la marca debe ser un número positivo.",
    }),
  modelo: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/)
    .messages({
      "string.empty": "El modelo no puede estar vacío.",
      "string.base": "El modelo debe ser de tipo string.",
      "string.min": "El modelo debe tener como mínimo 1 carácter.",
      "string.max": "El modelo debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El modelo solo puede contener letras, números, espacios, guiones y puntos.",
    }),
  numeroDeSerie: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\-]+$/)
    .messages({
      "string.empty": "El número de serie no puede estar vacío.",
      "string.base": "El número de serie debe ser de tipo string.",
      "string.min": "El número de serie debe tener como mínimo 1 carácter.",
      "string.max": "El número de serie debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El número de serie solo puede contener letras, números y guiones.",
    }),
  categoriaId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la categoría debe ser un número.",
      "number.integer": "El id de la categoría debe ser un número entero.",
      "number.positive": "El id de la categoría debe ser un número positivo.",
    }),
  estadoAltaBajaId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del estado debe ser un número.",
      "number.integer": "El id del estado debe ser un número entero.",
      "number.positive": "El id del estado debe ser un número positivo.",
    }),
  fechaAltaLab: Joi.date()
    .iso()
    .messages({
      "date.base": "La fecha de alta debe ser una fecha válida.",
      "date.format": "La fecha de alta debe estar en formato ISO (YYYY-MM-DD).",
    }),
  fechaBajaLab: Joi.date()
    .iso()
    .allow(null)
    .messages({
      "date.base": "La fecha de baja debe ser una fecha válida.",
      "date.format": "La fecha de baja debe estar en formato ISO (YYYY-MM-DD).",
    }),
})
  .or("marcaId", "modelo", "numeroDeSerie", "categoriaId", "estadoAltaBajaId", "fechaAltaLab", "fechaBajaLab")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un campo para actualizar.",
  });
