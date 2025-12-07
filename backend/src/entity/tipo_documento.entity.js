"use strict";
import { EntitySchema } from "typeorm";

/**
 * @deprecated El tipo de documento ahora se maneja como campo de texto en Prestamo.Tipo_documento
 * Se mantiene por compatibilidad con código legacy.
 * TODO: Migrar servicios para usar campo de texto directo
 */
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
