"use strict";
import EstadoPrestamo from "../entity/estado_prestamo.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createEstadoPrestamoService(body) {
  try {
    const estadoPrestamoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const existingEstadoPrestamo = await estadoPrestamoRepository.findOne({
      where: { Estado_Prestamo: body.Estado_Prestamo },
    });

    if (existingEstadoPrestamo) {
      return [null, "El estado de préstamo ya existe"];
    }

    const newEstadoPrestamo = estadoPrestamoRepository.create({
      Estado_Prestamo: body.Estado_Prestamo,
    });

    const estadoPrestamoSaved = await estadoPrestamoRepository.save(newEstadoPrestamo);

    return [estadoPrestamoSaved, null];
  } catch (error) {
    console.error("Error al crear el estado de préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEstadoPrestamoService(id) {
  try {
    const estadoPrestamoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const estadoPrestamoFound = await estadoPrestamoRepository.findOne({
      where: { ID_Estado_Prestamo: id },
    });

    if (!estadoPrestamoFound) return [null, "Estado de préstamo no encontrado"];

    return [estadoPrestamoFound, null];
  } catch (error) {
    console.error("Error al obtener el estado de préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEstadosPrestamosService() {
  try {
    const estadoPrestamoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const estadosPrestamos = await estadoPrestamoRepository.find();

    if (!estadosPrestamos || estadosPrestamos.length === 0) {
      return [null, "No hay estados de préstamo"];
    }

    return [estadosPrestamos, null];
  } catch (error) {
    console.error("Error al obtener los estados de préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateEstadoPrestamoService(id, body) {
  try {
    const estadoPrestamoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const estadoPrestamoFound = await estadoPrestamoRepository.findOne({
      where: { ID_Estado_Prestamo: id },
    });

    if (!estadoPrestamoFound) return [null, "Estado de préstamo no encontrado"];

    const existingEstadoPrestamo = await estadoPrestamoRepository.findOne({
      where: { Estado_Prestamo: body.Estado_Prestamo },
    });

    if (existingEstadoPrestamo && existingEstadoPrestamo.ID_Estado_Prestamo !== id) {
      return [null, "Ya existe otro estado de préstamo con el mismo nombre"];
    }

    await estadoPrestamoRepository.update(
      { ID_Estado_Prestamo: id },
      { Estado_Prestamo: body.Estado_Prestamo },
    );

    const estadoPrestamoUpdated = await estadoPrestamoRepository.findOne({
      where: { ID_Estado_Prestamo: id },
    });

    return [estadoPrestamoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el estado de préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteEstadoPrestamoService(id) {
  try {
    const estadoPrestamoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const estadoPrestamoFound = await estadoPrestamoRepository.findOne({
      where: { ID_Estado_Prestamo: id },
    });

    if (!estadoPrestamoFound) return [null, "Estado de préstamo no encontrado"];

    const estadoPrestamoDeleted = await estadoPrestamoRepository.remove(estadoPrestamoFound);

    return [estadoPrestamoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el estado de préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}
