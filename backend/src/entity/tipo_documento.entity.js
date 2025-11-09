"use strict";
import { EntitySchema } from "typeorm";

const TipoDocumentoSchema = new EntitySchema({
  name: "TipoDocumento",
  tableName: "tipo_documento",
  columns: {
    ID_Tipo_Documento: {
      type: "int",
      primary: true,
      generated: true,
    },
    Documento: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_TIPO_DOCUMENTO",
      columns: ["ID_Tipo_Documento"],
      unique: true,
    },
  ],
});

export default TipoDocumentoSchema;
