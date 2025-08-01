"use strict";
import { EntitySchema } from "typeorm";

const MarcaSchema = new EntitySchema({
  name: "Marca",
  tableName: "marca",
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
      inverseSide: "marca",
    },
  },
  indices: [
    {
      name: "IDX_MARCA",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default MarcaSchema;
