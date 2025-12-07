"use strict";
import { EntitySchema } from "typeorm";

/**
 * Entidad CaracterísticasEquipo - Características adicionales de equipos
 * Normaliza las características técnicas de los equipos en tabla separada.
 * Permite múltiples características por equipo.
 */
const CaracteristicasEquipoSchema = new EntitySchema({
  name: "CaracteristicasEquipo",
  tableName: "caracteristicas_equipo",
  columns: {
    ID_Caracteristicas: {
      type: "int",
      primary: true,
      generated: true,
    },
    ID_Num_Inv: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    Tipo_Caracteristica: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    Descripcion: {
      type: "text",
      nullable: true,
    },
  },
  relations: {
    equipo: {
      type: "many-to-one",
      target: "Equipos",
      joinColumn: {
        name: "ID_Num_Inv",
      },
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_CARACTERISTICAS_EQUIPO",
      columns: ["ID_Caracteristicas"],
      unique: true,
    },
  ],
});

export default CaracteristicasEquipoSchema;
