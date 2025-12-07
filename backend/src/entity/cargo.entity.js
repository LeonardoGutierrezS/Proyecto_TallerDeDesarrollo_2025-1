"use strict";
import { EntitySchema } from "typeorm";

/**
 * Entidad Cargo - Cargos/Posiciones de usuarios
 * Define el cargo o posición laboral/académica del usuario.
 */
const CargoSchema = new EntitySchema({
  name: "Cargo",
  tableName: "cargo",
  columns: {
    ID_Cargo: {
      type: "int",
      primary: true,
      generated: true,
    },
    Rut: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    Desc_Cargo: {
      type: "varchar",
      length: 100,
      nullable: false,
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
  },
  indices: [
    {
      name: "IDX_CARGO",
      columns: ["ID_Cargo"],
      unique: true,
    },
  ],
});

export default CargoSchema;
