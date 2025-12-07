"use strict";
import { EntitySchema } from "typeorm";

/**
 * @deprecated Esta entidad está siendo reemplazada por TipoUsuario (tipo_usuario)
 * en la nueva arquitectura 3FN. Se mantiene por compatibilidad con auth legacy.
 * TODO: Migrar sistema de autenticación para usar TipoUsuario
 */
const RolSchema = new EntitySchema({
  name: "Rol",
  tableName: "rol",
  columns: {
    ID_Rol: {
      type: "int",
      primary: true,
      generated: true,
    },
    Rol: {
      type: "varchar",
      length: 50,
      nullable: false,
      unique: true,
    },
  },
  indices: [
    {
      name: "IDX_ROL",
      columns: ["ID_Rol"],
      unique: true,
    },
  ],
});

export default RolSchema;
