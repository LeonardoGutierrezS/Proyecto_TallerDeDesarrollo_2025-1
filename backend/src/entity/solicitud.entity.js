"use strict";
import { EntitySchema } from "typeorm";

/**
 * Entidad Solicitud - Parte del flujo de préstamos 3FN
 * Representa la solicitud inicial de préstamo realizada por un usuario.
 * Flujo: Solicitud → Autorización → Préstamo → Devolución
 */
const SolicitudSchema = new EntitySchema({
  name: "Solicitud",
  tableName: "solicitud",
  columns: {
    Rut: {
      type: "varchar",
      length: 12,
      primary: true,
    },
    ID_Prestamo: {
      type: "int",
      primary: true,
    },
    Fecha_Sol: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    Hora_Sol: {
      type: "time",
      nullable: false,
    },
    Motivo_Sol: {
      type: "text",
      nullable: true,
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "Rut",
        referencedColumnName: "Rut",
      },
      nullable: false,
    },
    prestamo: {
      type: "many-to-one",
      target: "Prestamo",
      joinColumn: {
        name: "ID_Prestamo",
      },
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_SOLICITUD",
      columns: ["Rut", "ID_Prestamo"],
      unique: true,
    },
  ],
});

export default SolicitudSchema;
