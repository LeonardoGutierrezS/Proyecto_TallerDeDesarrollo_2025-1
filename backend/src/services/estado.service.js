"use strict";
import Estado from "../entity/estado.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createEstadoService(body) {
  try {
    const estadoRepository = AppDataSource.getRepository(Estado);

    const existingEstado = await estadoRepository.findOne({
      where: { Estado: body.Estado },
    });

    if (existingEstado) {
      return [null, "El estado ya existe"];
    }

    const newEstado = estadoRepository.create({
      Estado: body.Estado,
    });

    const estadoSaved = await estadoRepository.save(newEstado);

    return [estadoSaved, null];
  } catch (error) {
    console.error("Error al crear el estado:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEstadoService(id) {
  try {
    const estadoRepository = AppDataSource.getRepository(Estado);

    const estadoFound = await estadoRepository.findOne({
      where: { ID_Estado: id },
    });

    if (!estadoFound) return [null, "Estado no encontrado"];

    return [estadoFound, null];
  } catch (error) {
    console.error("Error al obtener el estado:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEstadosService() {
  try {
    const estadoRepository = AppDataSource.getRepository(Estado);

    const estados = await estadoRepository.find();

    if (!estados || estados.length === 0) return [null, "No hay estados"];

    return [estados, null];
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateEstadoService(id, body) {
  try {
    const estadoRepository = AppDataSource.getRepository(Estado);

    const estadoFound = await estadoRepository.findOne({
      where: { ID_Estado: id },
    });

    if (!estadoFound) return [null, "Estado no encontrado"];

    const existingEstado = await estadoRepository.findOne({
      where: { Estado: body.Estado },
    });

    if (existingEstado && existingEstado.ID_Estado !== id) {
      return [null, "Ya existe otro estado con el mismo nombre"];
    }

    await estadoRepository.update(
      { ID_Estado: id },
      { Estado: body.Estado },
    );

    const estadoUpdated = await estadoRepository.findOne({
      where: { ID_Estado: id },
    });

    return [estadoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteEstadoService(id) {
  try {
    const estadoRepository = AppDataSource.getRepository(Estado);

    const estadoFound = await estadoRepository.findOne({
      where: { ID_Estado: id },
    });

    if (!estadoFound) return [null, "Estado no encontrado"];

    const estadoDeleted = await estadoRepository.remove(estadoFound);

    return [estadoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el estado:", error);
    return [null, "Error interno del servidor"];
  }
}
