"use strict";
import { EntitySchema } from "typeorm";

const EstadoAltaBajaSchema = new EntitySchema({
  name: "EstadoAltaBaja",
  tableName: "estado_alta_baja",
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
    equipos: {
      type: "one-to-many",
      target: "Equipo",
      inverseSide: "estadoAltaBaja",
    },
  },
  indices: [
    {
      name: "IDX_ESTADO_ALTA_BAJA",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default EstadoAltaBajaSchema;
