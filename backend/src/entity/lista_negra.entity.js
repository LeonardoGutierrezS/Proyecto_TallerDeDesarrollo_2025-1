"use strict";
import { EntitySchema } from "typeorm";

const ListaNegraSchema = new EntitySchema({
  name: "ListaNegra",
  tableName: "lista_negra",
  columns: {
    ID_Lista_Negra: {
      type: "int",
      primary: true,
      generated: true,
    },
    fecha_inicio: {
      type: "date",
      nullable: false,
    },
    fecha_termino: {
      type: "date",
      nullable: false,
    },
  },
  relations: {
    prestamo: {
      type: "many-to-one",
      target: "Prestamo",
      joinColumn: {
        name: "ID_Prestamo",
      },
      nullable: false,
    },
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "ID_Usuario",
      },
      nullable: false,
    },
    motivo: {
      type: "many-to-one",
      target: "Motivo",
      joinColumn: {
        name: "ID_Motivo",
      },
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_LISTA_NEGRA",
      columns: ["ID_Lista_Negra"],
      unique: true,
    },
  ],
});

export default ListaNegraSchema;
