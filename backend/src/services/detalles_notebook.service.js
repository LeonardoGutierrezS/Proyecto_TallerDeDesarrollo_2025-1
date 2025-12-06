"use strict";
import DetallesNotebook from "../entity/detalles_notebook.entity.js";
import Equipos from "../entity/equipos.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createDetallesNotebookService(body) {
  try {
    const detallesNotebookRepository = AppDataSource.getRepository(DetallesNotebook);
    const equipoRepository = AppDataSource.getRepository(Equipos);

    // Verificar que el equipo existe
    const equipoFound = await equipoRepository.findOne({
      where: { ID_Num_Inv: body.ID_Num_Inv },
    });

    if (!equipoFound) {
      return [null, "El equipo no existe"];
    }

    // Verificar que no existan detalles para este equipo
    const existingDetalles = await detallesNotebookRepository.findOne({
      where: { equipo: { ID_Num_Inv: body.ID_Num_Inv } },
    });

    if (existingDetalles) {
      return [null, "Ya existen detalles para este equipo"];
    }

    const newDetalles = detallesNotebookRepository.create({
      Procesador: body.Procesador,
      Ram: body.Ram,
      Tipo_Almacenamiento: body.Tipo_Almacenamiento,
      Capacidad_Almacenamiento: body.Capacidad_Almacenamiento,
      equipo: { ID_Num_Inv: body.ID_Num_Inv },
    });

    const detallesSaved = await detallesNotebookRepository.save(newDetalles);

    const detallesWithRelations = await detallesNotebookRepository.findOne({
      where: { ID_Detalles_Notebook: detallesSaved.ID_Detalles_Notebook },
      relations: ["equipo", "equipo.marca", "equipo.categoria", "equipo.estado"],
    });

    return [detallesWithRelations, null];
  } catch (error) {
    console.error("Error al crear los detalles del notebook:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getDetallesNotebookService(id) {
  try {
    const detallesNotebookRepository = AppDataSource.getRepository(DetallesNotebook);

    const detallesFound = await detallesNotebookRepository.findOne({
      where: { ID_Detalles_Notebook: id },
      relations: ["equipo", "equipo.marca", "equipo.categoria", "equipo.estado"],
    });

    if (!detallesFound) return [null, "Detalles de notebook no encontrados"];

    return [detallesFound, null];
  } catch (error) {
    console.error("Error al obtener los detalles del notebook:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getDetallesNotebookPorEquipoService(equipoId) {
  try {
    const detallesNotebookRepository = AppDataSource.getRepository(DetallesNotebook);

    const detallesFound = await detallesNotebookRepository.findOne({
      where: { equipo: { ID_Num_Inv: equipoId } },
      relations: ["equipo", "equipo.marca", "equipo.categoria", "equipo.estado"],
    });

    if (!detallesFound) {
      return [null, "No hay detalles para este equipo"];
    }

    return [detallesFound, null];
  } catch (error) {
    console.error("Error al obtener los detalles del notebook por equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllDetallesNotebooksService() {
  try {
    const detallesNotebookRepository = AppDataSource.getRepository(DetallesNotebook);

    const detalles = await detallesNotebookRepository.find({
      relations: ["equipo", "equipo.marca", "equipo.categoria", "equipo.estado"],
    });

    if (!detalles || detalles.length === 0) {
      return [null, "No hay detalles de notebooks"];
    }

    return [detalles, null];
  } catch (error) {
    console.error("Error al obtener todos los detalles de notebooks:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateDetallesNotebookService(id, body) {
  try {
    const detallesNotebookRepository = AppDataSource.getRepository(DetallesNotebook);

    const detallesFound = await detallesNotebookRepository.findOne({
      where: { ID_Detalles_Notebook: id },
    });

    if (!detallesFound) return [null, "Detalles de notebook no encontrados"];

    const dataDetallesUpdate = {
      Procesador: body.Procesador || detallesFound.Procesador,
      Ram: body.Ram || detallesFound.Ram,
      Tipo_Almacenamiento: body.Tipo_Almacenamiento || detallesFound.Tipo_Almacenamiento,
      Capacidad_Almacenamiento: body.Capacidad_Almacenamiento || detallesFound.Capacidad_Almacenamiento,
    };

    await detallesNotebookRepository.update(
      { ID_Detalles_Notebook: id },
      dataDetallesUpdate,
    );

    const detallesUpdated = await detallesNotebookRepository.findOne({
      where: { ID_Detalles_Notebook: id },
      relations: ["equipo", "equipo.marca", "equipo.categoria", "equipo.estado"],
    });

    return [detallesUpdated, null];
  } catch (error) {
    console.error("Error al actualizar los detalles del notebook:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteDetallesNotebookService(id) {
  try {
    const detallesNotebookRepository = AppDataSource.getRepository(DetallesNotebook);

    const detallesFound = await detallesNotebookRepository.findOne({
      where: { ID_Detalles_Notebook: id },
      relations: ["equipo"],
    });

    if (!detallesFound) return [null, "Detalles de notebook no encontrados"];

    const detallesDeleted = await detallesNotebookRepository.remove(detallesFound);

    return [detallesDeleted, null];
  } catch (error) {
    console.error("Error al eliminar los detalles del notebook:", error);
    return [null, "Error interno del servidor"];
  }
}
