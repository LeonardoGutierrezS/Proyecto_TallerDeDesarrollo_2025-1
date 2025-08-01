"use strict";
import { EntitySchema } from "typeorm";

const HoraDisponibleSchema = new EntitySchema({
  name: "HoraDisponible",
  tableName: "horas_disponibles",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    equipoId: {
      type: "int",
      nullable: false,
    },
    hora: {
      type: "time",
      nullable: false,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    disponible: {
      type: "boolean",
      default: true,
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    equipo: {
      type: "many-to-one",
      target: "Equipo",
      joinColumn: {
        name: "equipoId",
        referencedColumnName: "id",
      },
    },
  },
  indices: [
    {
      name: "IDX_HORA_DISPONIBLE",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_HORA_EQUIPO",
      columns: ["equipoId"],
    },
    {
      name: "IDX_HORA_FECHA",
      columns: ["fecha"],
    },
  ],
});

export default HoraDisponibleSchema;
