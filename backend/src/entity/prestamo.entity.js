"use strict";
import { EntitySchema } from "typeorm";

const PrestamoSchema = new EntitySchema({
  name: "Prestamo",
  tableName: "prestamo",
  columns: {
    ID_Prestamo: {
      type: "int",
      primary: true,
      generated: true,
    },
    ID_Num_Inv: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    Fecha_inicio_prestamo: {
      type: "timestamp with time zone",
      nullable: false,
    },
    Hora_inicio_prestamo: {
      type: "time",
      nullable: false,
    },
    Fecha_ter_prestamo: {
      type: "timestamp with time zone",
      nullable: true,
    },
    Hora_fin_prestamo: {
      type: "time",
      nullable: true,
    },
    Motivo_Rechazo: {
      type: "text",
      nullable: true,
    },
    Retencion_documento: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    Fecha_devolucion: {
      type: "timestamp with time zone",
      nullable: true,
    },
    Hora_devolucion: {
      type: "time",
      nullable: true,
    },
    Condiciones_Prestamo: {
      type: "text",
      nullable: true,
    },
    Observaciones: {
      type: "text",
      nullable: true,
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "ID_Usuario",
      },
      nullable: false,
    },
    categoria: {
      type: "many-to-one",
      target: "Categoria",
      joinColumn: {
        name: "ID_Categoria",
      },
      nullable: false,
    },
    estadoPrestamo: {
      type: "many-to-one",
      target: "EstadoPrestamo",
      joinColumn: {
        name: "ID_Estado_Prestamo",
      },
      nullable: false,
    },
    tipoDocumento: {
      type: "many-to-one",
      target: "TipoDocumento",
      joinColumn: {
        name: "ID_Tipo_Documento",
      },
      nullable: true,
    },
  },
  indices: [
    {
      name: "IDX_PRESTAMO",
      columns: ["ID_Prestamo"],
      unique: true,
    },
  ],
});

export default PrestamoSchema;
