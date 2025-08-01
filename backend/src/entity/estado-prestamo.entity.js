"use strict";
import { EntitySchema } from "typeorm";

const EstadoPrestamoSchema = new EntitySchema({
  name: "EstadoPrestamo",
  tableName: "estado_prestamo",
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
      inverseSide: "estadoPrestamo",
    },
  },
  indices: [
    {
      name: "IDX_ESTADO_PRESTAMO",
      columns: ["id"],
      unique: true,
    },
  ],
});

export default EstadoPrestamoSchema;
