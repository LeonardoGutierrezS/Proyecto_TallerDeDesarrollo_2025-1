"use strict";
import TipoDocumento from "../entity/tipo-documento.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getTipoDocumentoService(query) {
  try {
    const { id, nombre } = query;

    const tipoRepository = AppDataSource.getRepository(TipoDocumento);

    const tipoFound = await tipoRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!tipoFound) return [null, "Tipo de documento no encontrado"];

    return [tipoFound, null];
  } catch (error) {
    console.error("Error al obtener el tipo de documento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getTiposDocumentosService() {
  try {
    const tipoRepository = AppDataSource.getRepository(TipoDocumento);

    const tipos = await tipoRepository.find({
      order: { nombre: "ASC" },
    });

    if (!tipos || tipos.length === 0) return [null, "No hay tipos de documentos"];

    return [tipos, null];
  } catch (error) {
    console.error("Error al obtener los tipos de documentos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createTipoDocumentoService(body) {
  try {
    const tipoRepository = AppDataSource.getRepository(TipoDocumento);

    const existingTipo = await tipoRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingTipo) {
      return [null, "Ya existe un tipo de documento con ese nombre"];
    }

    const newTipo = tipoRepository.create({
      nombre: body.nombre,
    });

    const tipoCreated = await tipoRepository.save(newTipo);

    return [tipoCreated, null];
  } catch (error) {
    console.error("Error al crear el tipo de documento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateTipoDocumentoService(query, body) {
  try {
    const { id, nombre } = query;

    const tipoRepository = AppDataSource.getRepository(TipoDocumento);

    const tipoFound = await tipoRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!tipoFound) return [null, "Tipo de documento no encontrado"];

    if (body.nombre) {
      const existingTipo = await tipoRepository.findOne({
        where: { nombre: body.nombre },
      });

      if (existingTipo && existingTipo.id !== tipoFound.id) {
        return [null, "Ya existe un tipo de documento con ese nombre"];
      }
    }

    const dataTipoUpdate = {
      nombre: body.nombre,
    };

    await tipoRepository.update({ id: tipoFound.id }, dataTipoUpdate);

    const tipoUpdated = await tipoRepository.findOne({
      where: { id: tipoFound.id },
    });

    return [tipoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el tipo de documento:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteTipoDocumentoService(query) {
  try {
    const { id, nombre } = query;

    const tipoRepository = AppDataSource.getRepository(TipoDocumento);

    const tipoFound = await tipoRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
      relations: ["prestamos"],
    });

    if (!tipoFound) return [null, "Tipo de documento no encontrado"];

    // Verificar si el tipo de documento tiene préstamos asociados
    if (tipoFound.prestamos && tipoFound.prestamos.length > 0) {
      return [null, "No se puede eliminar el tipo de documento porque tiene préstamos asociados"];
    }

    const tipoDeleted = await tipoRepository.remove(tipoFound);

    return [tipoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el tipo de documento:", error);
    return [null, "Error interno del servidor"];
  }
}
