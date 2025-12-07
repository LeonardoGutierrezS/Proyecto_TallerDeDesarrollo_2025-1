"use strict";
import TienePenalizacion from "../entity/tiene_penalizacion.entity.js";
import Penalizaciones from "../entity/penalizaciones.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Asignar una penalización a un usuario
 */
export async function asignarPenalizacionService(body) {
  try {
    const tienePenalizacionRepository = AppDataSource.getRepository(TienePenalizacion);
    const penalizacionRepository = AppDataSource.getRepository(Penalizaciones);
    const userRepository = AppDataSource.getRepository(User);

    // Verificar que el usuario existe
    const userFound = await userRepository.findOne({
      where: { Rut: body.Rut },
    });

    if (!userFound) {
      return [null, "El usuario no existe"];
    }

    // Verificar que la penalización existe
    const penalizacionFound = await penalizacionRepository.findOne({
      where: { ID_Penalizaciones: body.ID_Penalizaciones },
    });

    if (!penalizacionFound) {
      return [null, "La penalización no existe"];
    }

    // Crear la asignación de penalización
    const newTienePenalizacion = tienePenalizacionRepository.create({
      Rut: body.Rut,
      ID_Penalizaciones: body.ID_Penalizaciones,
      Fecha_Inicio: body.Fecha_Inicio || new Date(),
      Fecha_Fin: body.Fecha_Fin || null,
      Motivo_Obs: body.Motivo_Obs || null,
    });

    const tienePenalizacionSaved = await tienePenalizacionRepository.save(newTienePenalizacion);

    // Marcar al usuario como no vigente si la penalización está activa
    if (!body.Fecha_Fin || new Date(body.Fecha_Fin) > new Date()) {
      await userRepository.update(
        { Rut: body.Rut },
        { Vigente: false },
      );
    }

    const tienePenalizacionWithRelations = await tienePenalizacionRepository.findOne({
      where: { ID_Tiene_Penalizacion: tienePenalizacionSaved.ID_Tiene_Penalizacion },
      relations: [
        "usuario",
        "usuario.cargo",
        "usuario.carrera",
        "usuario.tipoUsuario",
        "penalizacion",
      ],
    });

    return [tienePenalizacionWithRelations, null];
  } catch (error) {
    console.error("Error al asignar la penalización:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener todas las penalizaciones asignadas
 */
export async function getTienePenalizacionesService() {
  try {
    const tienePenalizacionRepository = AppDataSource.getRepository(TienePenalizacion);

    const penalizaciones = await tienePenalizacionRepository.find({
      relations: [
        "usuario",
        "usuario.cargo",
        "usuario.carrera",
        "usuario.tipoUsuario",
        "penalizacion",
      ],
      order: { Fecha_Inicio: "DESC" },
    });

    return [penalizaciones || [], null];
  } catch (error) {
    console.error("Error al obtener las penalizaciones asignadas:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener penalizaciones de un usuario
 */
export async function getPenalizacionesPorUsuarioService(rut) {
  try {
    const tienePenalizacionRepository = AppDataSource.getRepository(TienePenalizacion);

    const penalizaciones = await tienePenalizacionRepository.find({
      where: { usuario: { Rut: rut } },
      relations: ["penalizacion"],
      order: { Fecha_Inicio: "DESC" },
    });

    return [penalizaciones || [], null];
  } catch (error) {
    console.error("Error al obtener las penalizaciones por usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener penalizaciones activas de un usuario
 */
export async function getPenalizacionesActivasService(rut) {
  try {
    const tienePenalizacionRepository = AppDataSource.getRepository(TienePenalizacion);
    const now = new Date();

    const penalizaciones = await tienePenalizacionRepository
      .createQueryBuilder("tp")
      .leftJoinAndSelect("tp.usuario", "usuario")
      .leftJoinAndSelect("tp.penalizacion", "penalizacion")
      .where("tp.Rut = :rut", { rut })
      .andWhere("(tp.Fecha_Fin IS NULL OR tp.Fecha_Fin > :now)", { now })
      .orderBy("tp.Fecha_Inicio", "DESC")
      .getMany();

    return [penalizaciones || [], null];
  } catch (error) {
    console.error("Error al obtener las penalizaciones activas:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Finalizar una penalización
 */
export async function finalizarPenalizacionService(id, fechaFin) {
  try {
    const tienePenalizacionRepository = AppDataSource.getRepository(TienePenalizacion);
    const userRepository = AppDataSource.getRepository(User);

    const penalizacionFound = await tienePenalizacionRepository.findOne({
      where: { ID_Tiene_Penalizacion: id },
      relations: ["usuario"],
    });

    if (!penalizacionFound) return [null, "Penalización no encontrada"];

    if (penalizacionFound.Fecha_Fin) {
      return [null, "La penalización ya fue finalizada"];
    }

    await tienePenalizacionRepository.update(
      { ID_Tiene_Penalizacion: id },
      { Fecha_Fin: fechaFin || new Date() },
    );

    // Verificar si el usuario tiene otras penalizaciones activas
    const penalizacionesActivas = await getPenalizacionesActivasService(
      penalizacionFound.usuario.Rut,
    );

    // Si no tiene más penalizaciones activas, marcarlo como vigente
    if (penalizacionesActivas[0].length === 0) {
      await userRepository.update(
        { Rut: penalizacionFound.usuario.Rut },
        { Vigente: true },
      );
    }

    const penalizacionUpdated = await tienePenalizacionRepository.findOne({
      where: { ID_Tiene_Penalizacion: id },
      relations: ["usuario", "penalizacion"],
    });

    return [penalizacionUpdated, null];
  } catch (error) {
    console.error("Error al finalizar la penalización:", error);
    return [null, "Error interno del servidor"];
  }
}
