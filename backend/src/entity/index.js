"use strict";

// Entidades Básicas (Catálogos)
import RolSchema from "./rol.entity.js";
import CarreraSchema from "./carrera.entity.js";
import MotivoSchema from "./motivo.entity.js";
import TipoDocumentoSchema from "./tipo_documento.entity.js";
import MarcaSchema from "./marca.entity.js";
import EstadoSchema from "./estado.entity.js";
import CategoriaSchema from "./categoria.entity.js";
import EstadoPrestamoSchema from "./estado_prestamo.entity.js";

// Entidades Principales
import UserSchema from "./user.entity.js";
import EquiposSchema from "./equipos.entity.js";
import PrestamoSchema from "./prestamo.entity.js";
import ListaNegraSchema from "./lista_negra.entity.js";
import DetallesNotebookSchema from "./detalles_notebook.entity.js";

export {
  // Catálogos
  RolSchema,
  CarreraSchema,
  MotivoSchema,
  TipoDocumentoSchema,
  MarcaSchema,
  EstadoSchema,
  CategoriaSchema,
  EstadoPrestamoSchema,
  // Principales
  UserSchema,
  EquiposSchema,
  PrestamoSchema,
  ListaNegraSchema,
  DetallesNotebookSchema,
};
