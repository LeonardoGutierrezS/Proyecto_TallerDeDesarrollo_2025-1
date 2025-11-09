"use strict";
import { EntitySchema } from "typeorm";

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
