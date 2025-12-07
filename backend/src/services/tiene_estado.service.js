"use strict";
import TieneEstado from "../entity/tiene_estado.entity.js";
import Prestamo from "../entity/prestamo.entity.js";
import Estado from "../entity/estado.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Crear un nuevo registro de estado para un préstamo
 */
export async function createTieneEstadoService(body) {
  try {
    const tieneEstadoRepository = AppDataSource.getRepository(TieneEstado);
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const estadoRepository = AppDataSource.getRepository(Estado);

    // Verificar que el préstamo existe
    const prestamoFound = await prestamoRepository.findOne({
      where: { ID_Prestamo: body.ID_Prestamo },
    });

    if (!prestamoFound) {
      return [null, "El préstamo no existe"];
    }

    // Verificar que el estado existe
    const estadoFound = await estadoRepository.findOne({
      where: { ID_Estado: body.Cod_Estado },
    });

    if (!estadoFound) {
      return [null, "El estado no existe"];
    }

    // Crear el registro de estado
    const newTieneEstado = tieneEstadoRepository.create({
      ID_Prestamo: body.ID_Prestamo,
      Cod_Estado: body.Cod_Estado,
      Fecha_Estado: body.Fecha_Estado || new Date(),
      Hora_Estado: body.Hora_Estado,
      Obs_Estado: body.Obs_Estado || null,
    });

    const tieneEstadoSaved = await tieneEstadoRepository.save(newTieneEstado);

    const tieneEstadoWithRelations = await tieneEstadoRepository.findOne({
      where: { ID_Tiene_Estado: tieneEstadoSaved.ID_Tiene_Estado },
      relations: ["prestamo", "estado"],
    });

    return [tieneEstadoWithRelations, null];
  } catch (error) {
    console.error("Error al crear el registro de estado:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener el historial de estados de un préstamo
 */
export async function getHistorialEstadosService(prestamoId) {
  try {
    const tieneEstadoRepository = AppDataSource.getRepository(TieneEstado);

    const historial = await tieneEstadoRepository.find({
      where: { prestamo: { ID_Prestamo: prestamoId } },
      relations: ["estado"],
      order: { Fecha_Estado: "ASC", Hora_Estado: "ASC" },
    });

    return [historial || [], null];
  } catch (error) {
    console.error("Error al obtener el historial de estados:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener el estado actual de un préstamo
 */
export async function getEstadoActualService(prestamoId) {
  try {
    const tieneEstadoRepository = AppDataSource.getRepository(TieneEstado);

    const estadoActual = await tieneEstadoRepository.findOne({
      where: { prestamo: { ID_Prestamo: prestamoId } },
      relations: ["estado"],
      order: { Fecha_Estado: "DESC", Hora_Estado: "DESC" },
    });

    if (!estadoActual) return [null, "No se encontró estado para el préstamo"];

    return [estadoActual, null];
  } catch (error) {
    console.error("Error al obtener el estado actual:", error);
    return [null, "Error interno del servidor"];
  }
}
