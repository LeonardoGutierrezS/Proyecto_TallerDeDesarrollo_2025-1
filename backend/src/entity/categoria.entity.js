"use strict";
import { EntitySchema } from "typeorm";

/**
 * @note Esta entidad sigue en uso para clasificación de equipos.
 * Se mantiene activa en la arquitectura actual.
 */
const CategoriaSchema = new EntitySchema({
  name: "Categoria",
  tableName: "categoria",
  columns: {
    ID_Categoria: {
      type: "int",
      primary: true,
      generated: true,
    },
    Categoria: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_CATEGORIA",
      columns: ["ID_Categoria"],
      unique: true,
    },
  ],
});

export default CategoriaSchema;
