"use strict";
import EstadoAltaBaja from "../entity/estado-alta-baja.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getEstadoAltaBajaService(query) {
  try {
    const { id, nombre } = query;

    const estadoRepository = AppDataSource.getRepository(EstadoAltaBaja);

    const estadoFound = await estadoRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!estadoFound) return [null, "Estado no encontrado"];

    return [estadoFound, null];
  } catch (error) {
    console.error("Error al obtener el estado:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEstadosAltaBajaService() {
  try {
    const estadoRepository = AppDataSource.getRepository(EstadoAltaBaja);

    const estados = await estadoRepository.find({
      order: { nombre: "ASC" },
    });

    if (!estados || estados.length === 0) return [null, "No hay estados"];

    return [estados, null];
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createEstadoAltaBajaService(body) {
  try {
    const estadoRepository = AppDataSource.getRepository(EstadoAltaBaja);

    const existingEstado = await estadoRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingEstado) {
      return [null, "Ya existe un estado con ese nombre"];
    }

    const newEstado = estadoRepository.create({
      nombre: body.nombre,
    });

    const estadoCreated = await estadoRepository.save(newEstado);

    return [estadoCreated, null];
  } catch (error) {
    console.error("Error al crear el estado:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateEstadoAltaBajaService(query, body) {
  try {
    const { id, nombre } = query;

    const estadoRepository = AppDataSource.getRepository(EstadoAltaBaja);

    const estadoFound = await estadoRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!estadoFound) return [null, "Estado no encontrado"];

    if (body.nombre) {
      const existingEstado = await estadoRepository.findOne({
        where: { nombre: body.nombre },
      });

      if (existingEstado && existingEstado.id !== estadoFound.id) {
        return [null, "Ya existe un estado con ese nombre"];
      }
    }

    const dataEstadoUpdate = {
      nombre: body.nombre,
    };

    await estadoRepository.update({ id: estadoFound.id }, dataEstadoUpdate);

    const estadoUpdated = await estadoRepository.findOne({
      where: { id: estadoFound.id },
    });

    return [estadoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteEstadoAltaBajaService(query) {
  try {
    const { id, nombre } = query;

    const estadoRepository = AppDataSource.getRepository(EstadoAltaBaja);

    const estadoFound = await estadoRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
      relations: ["equipos"],
    });

    if (!estadoFound) return [null, "Estado no encontrado"];

    // Verificar si el estado tiene equipos asociados
    if (estadoFound.equipos && estadoFound.equipos.length > 0) {
      return [null, "No se puede eliminar el estado porque tiene equipos asociados"];
    }

    const estadoDeleted = await estadoRepository.remove(estadoFound);

    return [estadoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el estado:", error);
    return [null, "Error interno del servidor"];
  }
}
