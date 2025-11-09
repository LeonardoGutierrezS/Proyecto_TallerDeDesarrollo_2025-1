"use strict";
import { EntitySchema } from "typeorm";

const DetallesNotebookSchema = new EntitySchema({
  name: "DetallesNotebook",
  tableName: "detalles_notebook",
  columns: {
    ID_Detalles_Notebook: {
      type: "int",
      primary: true,
      generated: true,
    },
    Procesador: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    Ram: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    Tipo_Almacenamiento: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    Capacidad_Almacenamiento: {
      type: "varchar",
      length: 50,
      nullable: false,
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
      name: "IDX_DETALLES_NOTEBOOK",
      columns: ["ID_Detalles_Notebook"],
      unique: true,
    },
  ],
});

export default DetallesNotebookSchema;
