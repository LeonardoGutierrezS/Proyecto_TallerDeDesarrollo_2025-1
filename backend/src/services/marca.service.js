"use strict";
import Marca from "../entity/marca.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getMarcaService(query) {
  try {
    const { id, nombre } = query;

    const marcaRepository = AppDataSource.getRepository(Marca);

    const marcaFound = await marcaRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!marcaFound) return [null, "Marca no encontrada"];

    return [marcaFound, null];
  } catch (error) {
    console.error("Error al obtener la marca:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getMarcasService() {
  try {
    const marcaRepository = AppDataSource.getRepository(Marca);

    const marcas = await marcaRepository.find({
      order: { nombre: "ASC" },
    });

    if (!marcas || marcas.length === 0) return [null, "No hay marcas"];

    return [marcas, null];
  } catch (error) {
    console.error("Error al obtener las marcas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createMarcaService(body) {
  try {
    const marcaRepository = AppDataSource.getRepository(Marca);

    const existingMarca = await marcaRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingMarca) {
      return [null, "Ya existe una marca con ese nombre"];
    }

    const newMarca = marcaRepository.create({
      nombre: body.nombre,
    });

    const marcaCreated = await marcaRepository.save(newMarca);

    return [marcaCreated, null];
  } catch (error) {
    console.error("Error al crear la marca:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateMarcaService(query, body) {
  try {
    const { id, nombre } = query;

    const marcaRepository = AppDataSource.getRepository(Marca);

    const marcaFound = await marcaRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!marcaFound) return [null, "Marca no encontrada"];

    if (body.nombre) {
      const existingMarca = await marcaRepository.findOne({
        where: { nombre: body.nombre },
      });

      if (existingMarca && existingMarca.id !== marcaFound.id) {
        return [null, "Ya existe una marca con ese nombre"];
      }
    }

    const dataMarcaUpdate = {
      nombre: body.nombre,
    };

    await marcaRepository.update({ id: marcaFound.id }, dataMarcaUpdate);

    const marcaUpdated = await marcaRepository.findOne({
      where: { id: marcaFound.id },
    });

    return [marcaUpdated, null];
  } catch (error) {
    console.error("Error al actualizar la marca:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteMarcaService(query) {
  try {
    const { id, nombre } = query;

    const marcaRepository = AppDataSource.getRepository(Marca);

    const marcaFound = await marcaRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
      relations: ["equipos"],
    });

    if (!marcaFound) return [null, "Marca no encontrada"];

    // Verificar si la marca tiene equipos asociados
    if (marcaFound.equipos && marcaFound.equipos.length > 0) {
      return [null, "No se puede eliminar la marca porque tiene equipos asociados"];
    }

    const marcaDeleted = await marcaRepository.remove(marcaFound);

    return [marcaDeleted, null];
  } catch (error) {
    console.error("Error al eliminar la marca:", error);
    return [null, "Error interno del servidor"];
  }
}
