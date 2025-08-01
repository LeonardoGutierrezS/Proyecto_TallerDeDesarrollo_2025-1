"use strict";
import EstadoPrestamo from "../entity/estado-prestamo.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getEstadoPrestamoService(query) {
  try {
    const { id, nombre } = query;

    const estadoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const estadoFound = await estadoRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!estadoFound) return [null, "Estado del préstamo no encontrado"];

    return [estadoFound, null];
  } catch (error) {
    console.error("Error al obtener el estado del préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEstadosPrestamosService() {
  try {
    const estadoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const estados = await estadoRepository.find({
      order: { nombre: "ASC" },
    });

    if (!estados || estados.length === 0) return [null, "No hay estados de préstamos"];

    return [estados, null];
  } catch (error) {
    console.error("Error al obtener los estados de préstamos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createEstadoPrestamoService(body) {
  try {
    const estadoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const existingEstado = await estadoRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingEstado) {
      return [null, "Ya existe un estado del préstamo con ese nombre"];
    }

    const newEstado = estadoRepository.create({
      nombre: body.nombre,
    });

    const estadoCreated = await estadoRepository.save(newEstado);

    return [estadoCreated, null];
  } catch (error) {
    console.error("Error al crear el estado del préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateEstadoPrestamoService(query, body) {
  try {
    const { id, nombre } = query;

    const estadoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const estadoFound = await estadoRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!estadoFound) return [null, "Estado del préstamo no encontrado"];

    if (body.nombre) {
      const existingEstado = await estadoRepository.findOne({
        where: { nombre: body.nombre },
      });

      if (existingEstado && existingEstado.id !== estadoFound.id) {
        return [null, "Ya existe un estado del préstamo con ese nombre"];
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
    console.error("Error al actualizar el estado del préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteEstadoPrestamoService(query) {
  try {
    const { id, nombre } = query;

    const estadoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const estadoFound = await estadoRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
      relations: ["prestamos"],
    });

    if (!estadoFound) return [null, "Estado del préstamo no encontrado"];

    // Verificar si el estado tiene préstamos asociados
    if (estadoFound.prestamos && estadoFound.prestamos.length > 0) {
      return [null, "No se puede eliminar el estado porque tiene préstamos asociados"];
    }

    const estadoDeleted = await estadoRepository.remove(estadoFound);

    return [estadoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el estado del préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}
