"use strict";
import { EntitySchema } from "typeorm";

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
