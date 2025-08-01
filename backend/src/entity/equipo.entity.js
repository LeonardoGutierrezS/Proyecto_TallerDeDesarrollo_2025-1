"use strict";
import { EntitySchema } from "typeorm";

const EquipoSchema = new EntitySchema({
  name: "Equipo",
  tableName: "equipos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    marcaId: {
      type: "int",
      nullable: false,
    },
    modelo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    numeroDeSerie: {
      type: "varchar",
      length: 100,
      nullable: false,
      unique: true,
    },
    categoriaId: {
      type: "int",
      nullable: false,
    },
    estadoAltaBajaId: {
      type: "int",
      nullable: false,
    },
    fechaAltaLab: {
      type: "date",
      nullable: false,
    },
    fechaBajaLab: {
      type: "date",
      nullable: true,
    },
  },
  relations: {
    marca: {
      type: "many-to-one",
      target: "Marca",
      joinColumn: {
        name: "marcaId",
        referencedColumnName: "id",
      },
    },
    categoria: {
      type: "many-to-one",
      target: "Categoria",
      joinColumn: {
        name: "categoriaId",
        referencedColumnName: "id",
      },
    },
    estadoAltaBaja: {
      type: "many-to-one",
      target: "EstadoAltaBaja",
      joinColumn: {
        name: "estadoAltaBajaId",
        referencedColumnName: "id",
      },
    },
    horasDisponibles: {
      type: "one-to-many",
      target: "HoraDisponible",
      inverseSide: "equipo",
    },
    prestamos: {
      type: "one-to-many",
      target: "Prestamo",
      inverseSide: "equipo",
    },
  },
  indices: [
    {
      name: "IDX_EQUIPO",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_EQUIPO_SERIE",
      columns: ["numeroDeSerie"],
      unique: true,
    },
    {
      name: "IDX_EQUIPO_MARCA",
      columns: ["marcaId"],
    },
    {
      name: "IDX_EQUIPO_CATEGORIA",
      columns: ["categoriaId"],
    },
    {
      name: "IDX_EQUIPO_ESTADO",
      columns: ["estadoAltaBajaId"],
    },
  ],
});

export default EquipoSchema;
