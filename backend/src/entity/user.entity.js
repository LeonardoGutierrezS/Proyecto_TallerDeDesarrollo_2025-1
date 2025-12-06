"use strict";
import { EntitySchema } from "typeorm";

const UserSchema = new EntitySchema({
  name: "User",
  tableName: "usuario",
  columns: {
    ID_Usuario: {
      type: "int",
      primary: true,
      generated: true,
    },
    Correo: {
      type: "varchar",
      length: 100,
      nullable: false,
      unique: true,
    },
    Rut: {
      type: "varchar",
      length: 12,
      nullable: false,
      unique: true,
    },
    Nombre_Completo: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    Contrasenia: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    Vigente: {
      type: "boolean",
      nullable: false,
      default: true,
    },
  },
  relations: {
    carrera: {
      type: "many-to-one",
      target: "Carrera",
      joinColumn: {
        name: "ID_Carrera",
      },
      nullable: true,
    },
    rol: {
      type: "many-to-one",
      target: "Rol",
      joinColumn: {
        name: "ID_Rol",
      },
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_USUARIO",
      columns: ["ID_Usuario"],
      unique: true,
    },
    {
      name: "IDX_USUARIO_RUT",
      columns: ["Rut"],
      unique: true,
    },
    {
      name: "IDX_USUARIO_CORREO",
      columns: ["Correo"],
      unique: true,
    },
  ],
});

export default UserSchema;