"use strict";
import { EntitySchema } from "typeorm";

/**
 * Entidad TieneEstado - Historial de estados de préstamos
 * Reemplaza el campo único de estado por un historial completo (auditoría).
 * Permite tracking de todos los cambios de estado de un préstamo.
 */
const TieneEstadoSchema = new EntitySchema({
  name: "TieneEstado",
  tableName: "tiene_estado",
  columns: {
    ID_Num_Inv: {
      type: "varchar",
      length: 50,
      primary: true,
    },
    ID_Estado: {
      type: "int",
      primary: true,
    },
    Cod_Estado: {
      type: "int",
      primary: true,
    },
    Fecha_Estado: {
      type: "timestamp with time zone",
      nullable: false,
    },
    Hora_Estado: {
      type: "time",
      nullable: false,
    },
    Obs_Estado: {
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
    estadoPrestamo: {
      type: "many-to-one",
      target: "EstadoPrestamo",
      joinColumn: {
        name: "ID_Estado",
      },
      nullable: false,
    },
    estado: {
      type: "many-to-one",
      target: "Estado",
      joinColumn: {
        name: "Cod_Estado",
      },
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_TIENE_ESTADO",
      columns: ["ID_Num_Inv", "ID_Estado", "Cod_Estado"],
      unique: true,
    },
  ],
});

export default TieneEstadoSchema;
