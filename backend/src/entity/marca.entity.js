"use strict";
import { EntitySchema } from "typeorm";

const MarcaSchema = new EntitySchema({
  name: "Marca",
  tableName: "marca",
  columns: {
    ID_Marca: {
      type: "int",
      primary: true,
      generated: true,
    },
    Marca: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_MARCA",
      columns: ["ID_Marca"],
      unique: true,
    },
  ],
});

export default MarcaSchema;
