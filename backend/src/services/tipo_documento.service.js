"use strict";
import TipoDocumento from "../entity/tipo_documento.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createTipoDocumentoService(body) {
  try {
    const tipoDocumentoRepository = AppDataSource.getRepository(TipoDocumento);

    const existingTipoDocumento = await tipoDocumentoRepository.findOne({
      where: { Documento: body.Documento },
    });

    if (existingTipoDocumento) {
      return [null, "El tipo de documento ya existe"];
    }

    const newTipoDocumento = tipoDocumentoRepository.create({
      Documento: body.Documento,
    });

    const tipoDocumentoSaved = await tipoDocumentoRepository.save(newTipoDocumento);

    return [tipoDocumentoSaved, null];
  } catch (error) {
    console.error("Error al crear el tipo de documento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getTipoDocumentoService(id) {
  try {
    const tipoDocumentoRepository = AppDataSource.getRepository(TipoDocumento);

    const tipoDocumentoFound = await tipoDocumentoRepository.findOne({
      where: { ID_Tipo_Documento: id },
    });

    if (!tipoDocumentoFound) return [null, "Tipo de documento no encontrado"];

    return [tipoDocumentoFound, null];
  } catch (error) {
    console.error("Error al obtener el tipo de documento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getTiposDocumentoService() {
  try {
    const tipoDocumentoRepository = AppDataSource.getRepository(TipoDocumento);

    const tiposDocumento = await tipoDocumentoRepository.find();

    if (!tiposDocumento || tiposDocumento.length === 0) {
      return [null, "No hay tipos de documento"];
    }

    return [tiposDocumento, null];
  } catch (error) {
    console.error("Error al obtener los tipos de documento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateTipoDocumentoService(id, body) {
  try {
    const tipoDocumentoRepository = AppDataSource.getRepository(TipoDocumento);

    const tipoDocumentoFound = await tipoDocumentoRepository.findOne({
      where: { ID_Tipo_Documento: id },
    });

    if (!tipoDocumentoFound) return [null, "Tipo de documento no encontrado"];

    const existingTipoDocumento = await tipoDocumentoRepository.findOne({
      where: { Documento: body.Documento },
    });

    if (existingTipoDocumento && existingTipoDocumento.ID_Tipo_Documento !== id) {
      return [null, "Ya existe otro tipo de documento con el mismo nombre"];
    }

    await tipoDocumentoRepository.update(
      { ID_Tipo_Documento: id },
      { Documento: body.Documento },
    );

    const tipoDocumentoUpdated = await tipoDocumentoRepository.findOne({
      where: { ID_Tipo_Documento: id },
    });

    return [tipoDocumentoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el tipo de documento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteTipoDocumentoService(id) {
  try {
    const tipoDocumentoRepository = AppDataSource.getRepository(TipoDocumento);

    const tipoDocumentoFound = await tipoDocumentoRepository.findOne({
      where: { ID_Tipo_Documento: id },
    });

    if (!tipoDocumentoFound) return [null, "Tipo de documento no encontrado"];

    const tipoDocumentoDeleted = await tipoDocumentoRepository.remove(tipoDocumentoFound);

    return [tipoDocumentoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el tipo de documento:", error);
    return [null, "Error interno del servidor"];
  }
}
