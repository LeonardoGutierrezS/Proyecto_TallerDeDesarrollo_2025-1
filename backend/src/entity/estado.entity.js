"use strict";
import { EntitySchema } from "typeorm";

const EstadoSchema = new EntitySchema({
  name: "Estado",
  tableName: "estado",
  columns: {
    ID_Estado: {
      type: "int",
      primary: true,
      generated: true,
    },
    Estado: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_ESTADO",
      columns: ["ID_Estado"],
      unique: true,
    },
  ],
});

export default EstadoSchema;
