"use strict";
import { EntitySchema } from "typeorm";

const TipoDocumentoSchema = new EntitySchema({
  name: "TipoDocumento",
  tableName: "tipo_documento",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
  },
  relations: {
    prestamos: {
      type: "one-to-many",
      target: "Prestamo",
      inverseSide: "tipoDocumento",
    },
  },
  indices: [
    {
      name: "IDX_TIPO_DOCUMENTO",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default TipoDocumentoSchema;
