"use strict";
import { EntitySchema } from "typeorm";

const CarreraSchema = new EntitySchema({
  name: "Carrera",
  tableName: "carrera",
  columns: {
    ID_Carrera: {
      type: "int",
      primary: true,
      generated: true,
    },
    Carrera: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_CARRERA",
      columns: ["ID_Carrera"],
      unique: true,
    },
  ],
});

export default CarreraSchema;
