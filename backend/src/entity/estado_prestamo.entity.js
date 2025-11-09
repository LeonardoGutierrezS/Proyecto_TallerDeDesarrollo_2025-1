"use strict";
import { EntitySchema } from "typeorm";

const EstadoPrestamoSchema = new EntitySchema({
  name: "EstadoPrestamo",
  tableName: "estado_prestamo",
  columns: {
    ID_Estado_Prestamo: {
      type: "int",
      primary: true,
      generated: true,
    },
    Estado_Prestamo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_ESTADO_PRESTAMO",
      columns: ["ID_Estado_Prestamo"],
      unique: true,
    },
  ],
});

export default EstadoPrestamoSchema;
