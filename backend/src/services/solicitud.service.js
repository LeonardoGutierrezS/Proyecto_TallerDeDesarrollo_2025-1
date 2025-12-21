"use strict";
import Solicitud from "../entity/solicitud.entity.js";
import Prestamo from "../entity/prestamo.entity.js";
import User from "../entity/user.entity.js";
import Equipos from "../entity/equipos.entity.js";
import TieneEstado from "../entity/tiene_estado.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Crear una nueva solicitud de préstamo
 */
export async function createSolicitudService(body) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const userRepository = AppDataSource.getRepository(User);
    const equipoRepository = AppDataSource.getRepository(Equipos);

    // Verificar que el usuario existe
    const userFound = await userRepository.findOne({
      where: { Rut: body.Rut },
    });

    if (!userFound) {
      return [null, "El usuario no existe"];
    }

    // Verificar que el usuario está vigente
    if (!userFound.Vigente) {
      return [null, "El usuario no está vigente, no puede realizar solicitudes"];
    }

    // Verificar que el equipo existe y está disponible
    const equipoFound = await equipoRepository.findOne({
      where: { ID_Num_Inv: body.ID_Num_Inv },
    });

    if (!equipoFound) {
      return [null, "El equipo no existe"];
    }

    if (!equipoFound.Disponible) {
      return [null, "El equipo no está disponible para préstamo"];
    }

    // Verificar que el préstamo existe
    if (!body.ID_Prestamo) {
      return [null, "ID_Prestamo es requerido"];
    }

    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const prestamoFound = await prestamoRepository.findOne({
      where: { ID_Prestamo: body.ID_Prestamo },
    });

    if (!prestamoFound) {
      return [null, "El préstamo no existe"];
    }

    // Crear la solicitud
    const newSolicitud = solicitudRepository.create({
      Rut: body.Rut,
      ID_Prestamo: body.ID_Prestamo,
      Fecha_Sol: body.Fecha_Sol || new Date(),
      Hora_Sol: body.Hora_Sol,
      Motivo_Sol: body.Motivo_Sol || null,
    });

    const solicitudSaved = await solicitudRepository.save(newSolicitud);

    const solicitudWithRelations = await solicitudRepository.findOne({
      where: { Rut: solicitudSaved.Rut, ID_Prestamo: solicitudSaved.ID_Prestamo },
      relations: ["usuario", "usuario.cargo", "usuario.carrera", "usuario.tipoUsuario", "prestamo"],
    });

    return [solicitudWithRelations, null];
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener todas las solicitudes
 */
export async function getSolicitudesService() {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    const solicitudes = await solicitudRepository.find({
      relations: ["usuario", "usuario.cargo", "usuario.carrera", "usuario.tipoUsuario", "prestamo"],
      order: { Fecha_Sol: "DESC" },
    });

    return [solicitudes || [], null];
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener solicitudes por usuario (RUT)
 */
export async function getSolicitudesPorUsuarioService(rut) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    const solicitudes = await solicitudRepository.find({
      where: { usuario: { Rut: rut } },
      relations: ["usuario", "usuario.cargo", "usuario.carrera", "usuario.tipoUsuario", "prestamo"],
      order: { Fecha_Sol: "DESC" },
    });

    return [solicitudes || [], null];
  } catch (error) {
    console.error("Error al obtener las solicitudes por usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener solicitudes por préstamo
 */
export async function getSolicitudesPorPrestamoService(prestamoId) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    const solicitudes = await solicitudRepository.find({
      where: { prestamo: { ID_Prestamo: prestamoId } },
      relations: ["usuario", "usuario.cargo", "usuario.carrera", "usuario.tipoUsuario", "prestamo"],
      order: { Fecha_Sol: "DESC" },
    });

    return [solicitudes || [], null];
  } catch (error) {
    console.error("Error al obtener las solicitudes pendientes:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener una solicitud por Rut y ID_Prestamo
 */
export async function getSolicitudService(rut, idPrestamo) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    const solicitudFound = await solicitudRepository.findOne({
      where: { Rut: rut, ID_Prestamo: idPrestamo },
      relations: ["usuario", "usuario.cargo", "usuario.carrera", "usuario.tipoUsuario", "prestamo"],
    });

    if (!solicitudFound) return [null, "Solicitud no encontrada"];

    return [solicitudFound, null];
  } catch (error) {
    console.error("Error al obtener la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Eliminar una solicitud
 */
export async function deleteSolicitudService(rut, idPrestamo) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    const solicitudFound = await solicitudRepository.findOne({
      where: { Rut: rut, ID_Prestamo: idPrestamo },
    });

    if (!solicitudFound) return [null, "Solicitud no encontrada"];

    // Solo se puede eliminar si no tiene préstamo asociado
    if (solicitudFound.ID_Prestamo) {
      return [null, "No se puede eliminar una solicitud con préstamo asociado"];
    }

    const solicitudDeleted = await solicitudRepository.remove(solicitudFound);

    return [solicitudDeleted, null];
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}
