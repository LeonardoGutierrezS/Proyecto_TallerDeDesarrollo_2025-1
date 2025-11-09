"use strict";
import { EntitySchema } from "typeorm";

const CategoriaSchema = new EntitySchema({
  name: "Categoria",
  tableName: "categoria",
  columns: {
    ID_Categoria: {
      type: "int",
      primary: true,
      generated: true,
    },
    Categoria: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_CATEGORIA",
      columns: ["ID_Categoria"],
      unique: true,
    },
  ],
});

export default CategoriaSchema;
