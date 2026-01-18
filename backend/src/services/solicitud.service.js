"use strict";
import Solicitud from "../entity/solicitud.entity.js";
import Prestamo from "../entity/prestamo.entity.js";
import User from "../entity/user.entity.js";
import Equipos from "../entity/equipos.entity.js";
import TieneEstado from "../entity/tiene_estado.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { enviarEmailSolicitudCreada } from "./email.service.js";

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

    // Crear la solicitud (ID_Prestamo será null hasta que se apruebe)
    const newSolicitud = solicitudRepository.create({
      Rut: body.Rut,
      ID_Num_Inv: body.ID_Num_Inv,
      Fecha_Sol: body.Fecha_Sol || new Date(),
      Hora_Sol: body.Hora_Sol,
      Motivo_Sol: body.Motivo_Sol || null,
      Fecha_inicio_sol: body.Fecha_inicio_sol || null,
      Fecha_termino_sol: body.Fecha_termino_sol || null,
      ID_Prestamo: null, // Se llenará cuando se apruebe la solicitud
    });

    const solicitudSaved = await solicitudRepository.save(newSolicitud);

    // Marcar el equipo como ocupado inmediatamente
    await equipoRepository.update(
      { ID_Num_Inv: body.ID_Num_Inv },
      { Disponible: false }
    );

    const solicitudWithRelations = await solicitudRepository.findOne({
      where: { ID_Solicitud: solicitudSaved.ID_Solicitud },
      relations: [
        "usuario", 
        "usuario.cargo", 
        "usuario.carrera", 
        "usuario.tipoUsuario", 
        "equipo",
        "equipo.marca",
        "equipo.categoria",
        "equipo.estado",
        "prestamo"
      ],
    });

    // Enviar notificación por correo
    if (solicitudWithRelations) {
      await enviarEmailSolicitudCreada(solicitudWithRelations);
    }

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
      relations: [
        "usuario", 
        "usuario.cargo", 
        "usuario.carrera", 
        "usuario.tipoUsuario", 
        "equipo",
        "equipo.marca",
        "equipo.categoria",
        "equipo.estado",
        "equipo.especificaciones",
        "prestamo",
        "prestamo.autorizacion",
        "prestamo.autorizacion.usuario",
        "prestamo.devolucion",
        "prestamo.devolucion.usuario",
        "prestamo.tieneEstados",
        "prestamo.tieneEstados.estadoPrestamo"
      ],
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
      where: { Rut: rut },
      relations: [
        "usuario", 
        "usuario.cargo", 
        "usuario.carrera", 
        "usuario.tipoUsuario", 
        "equipo",
        "equipo.marca",
        "equipo.categoria",
        "equipo.estado",
        "equipo.especificaciones",
        "prestamo",
        "prestamo.autorizacion",
        "prestamo.autorizacion.usuario",
        "prestamo.devolucion",
        "prestamo.devolucion.usuario",
        "prestamo.tieneEstados",
        "prestamo.tieneEstados.estadoPrestamo"
      ],
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
      where: { ID_Prestamo: prestamoId },
      relations: [
        "usuario", 
        "usuario.cargo", 
        "usuario.carrera", 
        "usuario.tipoUsuario", 
        "equipo",
        "equipo.marca",
        "equipo.categoria",
        "equipo.estado",
        "prestamo",
        "prestamo.autorizacion",
        "prestamo.devolucion"
      ],
      order: { Fecha_Sol: "DESC" },
    });

    return [solicitudes || [], null];
  } catch (error) {
    console.error("Error al obtener las solicitudes por préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener una solicitud por ID_Solicitud
 */
export async function getSolicitudService(idSolicitud) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    const solicitudFound = await solicitudRepository.findOne({
      where: { ID_Solicitud: idSolicitud },
      relations: [
        "usuario", 
        "usuario.cargo", 
        "usuario.carrera", 
        "usuario.tipoUsuario", 
        "equipo",
        "equipo.marca",
        "equipo.categoria",
        "equipo.estado",
        "equipo.especificaciones",
        "prestamo",
        "prestamo.autorizacion",
        "prestamo.autorizacion.usuario",
        "prestamo.devolucion",
        "prestamo.devolucion.usuario",
        "prestamo.tieneEstados",
        "prestamo.tieneEstados.estadoPrestamo"
      ],
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
export async function deleteSolicitudService(idSolicitud) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    const solicitudFound = await solicitudRepository.findOne({
      where: { ID_Solicitud: idSolicitud },
    });

    if (!solicitudFound) return [null, "Solicitud no encontrada"];

    // Solo se puede eliminar si no tiene préstamo asociado (no ha sido procesada)
    if (solicitudFound.ID_Prestamo) {
      return [null, "No se puede eliminar una solicitud que ya fue procesada"];
    }

    // Liberar el equipo antes de eliminar la solicitud
    const equipoRepository = AppDataSource.getRepository(Equipos);
    await equipoRepository.update(
      { ID_Num_Inv: solicitudFound.ID_Num_Inv },
      { Disponible: true }
    );

    const solicitudDeleted = await solicitudRepository.remove(solicitudFound);

    return [solicitudDeleted, null];
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}
