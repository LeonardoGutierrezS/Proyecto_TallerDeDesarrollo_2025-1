"use strict";
import Marca from "../entity/marca.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createMarcaService(body) {
  try {
    const marcaRepository = AppDataSource.getRepository(Marca);

    // Normalizar el nombre (trim y capitalizar primera letra de cada palabra)
    const marcaNormalizada = body.Marca.trim()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    // Verificar si existe (case-insensitive)
    const marcas = await marcaRepository.find();
    const existingMarca = marcas.find(
      m => m.Marca.toLowerCase() === marcaNormalizada.toLowerCase()
    );

    if (existingMarca) {
      return [null, "La marca ya existe"];
    }

    const newMarca = marcaRepository.create({
      Marca: marcaNormalizada,
    });

    const marcaSaved = await marcaRepository.save(newMarca);

    return [marcaSaved, null];
  } catch (error) {
    console.error("Error al crear la marca:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getMarcaService(id) {
  try {
    const marcaRepository = AppDataSource.getRepository(Marca);

    const marcaFound = await marcaRepository.findOne({
      where: { ID_Marca: id },
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

    const marcas = await marcaRepository.find();

    return [marcas || [], null];
  } catch (error) {
    console.error("Error al obtener las marcas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateMarcaService(id, body) {
  try {
    const marcaRepository = AppDataSource.getRepository(Marca);

    const marcaFound = await marcaRepository.findOne({
      where: { ID_Marca: id },
    });

    if (!marcaFound) return [null, "Marca no encontrada"];

    const existingMarca = await marcaRepository.findOne({
      where: { Marca: body.Marca },
    });

    if (existingMarca && existingMarca.ID_Marca !== id) {
      return [null, "Ya existe otra marca con el mismo nombre"];
    }

    await marcaRepository.update(
      { ID_Marca: id },
      { Marca: body.Marca },
    );

    const marcaUpdated = await marcaRepository.findOne({
      where: { ID_Marca: id },
    });

    return [marcaUpdated, null];
  } catch (error) {
    console.error("Error al actualizar la marca:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteMarcaService(id) {
  try {
    const marcaRepository = AppDataSource.getRepository(Marca);

    const marcaFound = await marcaRepository.findOne({
      where: { ID_Marca: id },
    });

    if (!marcaFound) return [null, "Marca no encontrada"];

    const marcaDeleted = await marcaRepository.remove(marcaFound);

    return [marcaDeleted, null];
  } catch (error) {
    console.error("Error al eliminar la marca:", error);
    return [null, "Error interno del servidor"];
  }
}
