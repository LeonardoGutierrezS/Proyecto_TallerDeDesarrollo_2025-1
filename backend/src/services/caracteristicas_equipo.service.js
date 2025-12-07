"use strict";
import CaracteristicasEquipo from "../entity/caracteristicas_equipo.entity.js";
import Equipos from "../entity/equipos.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Crear una característica para un equipo
 */
export async function createCaracteristicaService(body) {
  try {
    const caracteristicaRepository = AppDataSource.getRepository(CaracteristicasEquipo);
    const equipoRepository = AppDataSource.getRepository(Equipos);

    // Verificar que el equipo existe
    const equipoFound = await equipoRepository.findOne({
      where: { ID_Num_Inv: body.ID_Num_Inv },
    });

    if (!equipoFound) {
      return [null, "El equipo no existe"];
    }

    const newCaracteristica = caracteristicaRepository.create({
      ID_Num_Inv: body.ID_Num_Inv,
      Tipo_Caracteristica: body.Tipo_Caracteristica,
      Descripcion: body.Descripcion || null,
    });

    const caracteristicaSaved = await caracteristicaRepository.save(newCaracteristica);

    const caracteristicaWithRelations = await caracteristicaRepository.findOne({
      where: { ID_Caracteristicas: caracteristicaSaved.ID_Caracteristicas },
      relations: ["equipo", "equipo.marca", "equipo.categoria", "equipo.estado"],
    });

    return [caracteristicaWithRelations, null];
  } catch (error) {
    console.error("Error al crear la característica:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener todas las características de un equipo
 */
export async function getCaracteristicasPorEquipoService(idNumInv) {
  try {
    const caracteristicaRepository = AppDataSource.getRepository(CaracteristicasEquipo);

    const caracteristicas = await caracteristicaRepository.find({
      where: { equipo: { ID_Num_Inv: idNumInv } },
      relations: ["equipo"],
    });

    return [caracteristicas || [], null];
  } catch (error) {
    console.error("Error al obtener las características del equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Actualizar una característica
 */
export async function updateCaracteristicaService(id, body) {
  try {
    const caracteristicaRepository = AppDataSource.getRepository(CaracteristicasEquipo);

    const caracteristicaFound = await caracteristicaRepository.findOne({
      where: { ID_Caracteristicas: id },
    });

    if (!caracteristicaFound) return [null, "Característica no encontrada"];

    await caracteristicaRepository.update(
      { ID_Caracteristicas: id },
      {
        Tipo_Caracteristica: body.Tipo_Caracteristica || caracteristicaFound.Tipo_Caracteristica,
        Descripcion: body.Descripcion !== undefined ? body.Descripcion : caracteristicaFound.Descripcion,
      },
    );

    const caracteristicaUpdated = await caracteristicaRepository.findOne({
      where: { ID_Caracteristicas: id },
      relations: ["equipo"],
    });

    return [caracteristicaUpdated, null];
  } catch (error) {
    console.error("Error al actualizar la característica:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Eliminar una característica
 */
export async function deleteCaracteristicaService(id) {
  try {
    const caracteristicaRepository = AppDataSource.getRepository(CaracteristicasEquipo);

    const caracteristicaFound = await caracteristicaRepository.findOne({
      where: { ID_Caracteristicas: id },
    });

    if (!caracteristicaFound) return [null, "Característica no encontrada"];

    const caracteristicaDeleted = await caracteristicaRepository.remove(caracteristicaFound);

    return [caracteristicaDeleted, null];
  } catch (error) {
    console.error("Error al eliminar la característica:", error);
    return [null, "Error interno del servidor"];
  }
}
