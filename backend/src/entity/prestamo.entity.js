"use strict";
import { EntitySchema } from "typeorm";

const PrestamoSchema = new EntitySchema({
  name: "Prestamo",
  tableName: "prestamo",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    categoriaId: {
      type: "int",
      nullable: false,
    },
    equipoId: {
      type: "int",
      nullable: false,
    },
    fechaInicioPrestamo: {
      type: "date",
      nullable: false,
    },
    horaInicioPrestamo: {
      type: "time",
      nullable: false,
    },
    horaFinPrestamo: {
      type: "time",
      nullable: false,
    },
    fechaFinPrestamo: {
      type: "date",
      nullable: false,
    },
    estadoPrestamoId: {
      type: "int",
      nullable: false,
    },
    motivoRechazo: {
      type: "text",
      nullable: true,
    },
    retencionDocumento: {
      type: "boolean",
      default: false,
      nullable: false,
    },
    tipoDocumentoId: {
      type: "int",
      nullable: true,
    },
    fechaRealEntrega: {
      type: "timestamp with time zone",
      nullable: true,
    },
    horaRealEntrega: {
      type: "time",
      nullable: true,
    },
    usuarioId: {
      type: "int",
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
    categoria: {
      type: "many-to-one",
      target: "Categoria",
      joinColumn: {
        name: "categoriaId",
        referencedColumnName: "id",
      },
    },
    equipo: {
      type: "many-to-one",
      target: "Equipo",
      joinColumn: {
        name: "equipoId",
        referencedColumnName: "id",
      },
    },
    estadoPrestamo: {
      type: "many-to-one",
      target: "EstadoPrestamo",
      joinColumn: {
        name: "estadoPrestamoId",
        referencedColumnName: "id",
      },
    },
    tipoDocumento: {
      type: "many-to-one",
      target: "TipoDocumento",
      joinColumn: {
        name: "tipoDocumentoId",
        referencedColumnName: "id",
      },
    },
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "usuarioId",
        referencedColumnName: "id",
      },
    },
  },
  indices: [
    {
      name: "IDX_PRESTAMO",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_PRESTAMO_USUARIO",
      columns: ["usuarioId"],
    },
    {
      name: "IDX_PRESTAMO_EQUIPO",
      columns: ["equipoId"],
    },
    {
      name: "IDX_PRESTAMO_CATEGORIA",
      columns: ["categoriaId"],
    },
    {
      name: "IDX_PRESTAMO_ESTADO",
      columns: ["estadoPrestamoId"],
    },
    {
      name: "IDX_PRESTAMO_FECHA_INICIO",
      columns: ["fechaInicioPrestamo"],
    },
  ],
});

export default PrestamoSchema;
