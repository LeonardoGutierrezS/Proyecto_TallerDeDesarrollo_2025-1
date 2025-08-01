"use strict";
import { EntitySchema } from "typeorm";

const CategoriaSchema = new EntitySchema({
  name: "Categoria",
  tableName: "categoria",
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
      inverseSide: "categoria",
    },
    prestamos: {
      type: "one-to-many",
      target: "Prestamo",
      inverseSide: "categoria",
    },
  },
  indices: [
    {
      name: "IDX_CATEGORIA",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default CategoriaSchema;
