"use strict";
import { EntitySchema } from "typeorm";

/**
 * @note Esta entidad sigue en uso para motivos de lista negra.
 * Se mantiene activa en la arquitectura actual.
 */
const MotivoSchema = new EntitySchema({
  name: "Motivo",
  tableName: "motivo",
  columns: {
    ID_Motivo: {
      type: "int",
      primary: true,
      generated: true,
    },
    Motivo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_MOTIVO",
      columns: ["ID_Motivo"],
      unique: true,
    },
  ],
});

export default MotivoSchema;
