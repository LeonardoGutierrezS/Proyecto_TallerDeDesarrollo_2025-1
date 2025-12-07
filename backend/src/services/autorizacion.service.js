"use strict";
import Autorizacion from "../entity/autorizacion.entity.js";
import Prestamo from "../entity/prestamo.entity.js";
import Solicitud from "../entity/solicitud.entity.js";
import User from "../entity/user.entity.js";
import Equipos from "../entity/equipos.entity.js";
import TieneEstado from "../entity/tiene_estado.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Autorizar (aprobar) una solicitud creando un préstamo
 */
export async function aprobarSolicitudService(body) {
  try {
    const autorizacionRepository = AppDataSource.getRepository(Autorizacion);
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const equipoRepository = AppDataSource.getRepository(Equipos);
    const tieneEstadoRepository = AppDataSource.getRepository(TieneEstado);
    const userRepository = AppDataSource.getRepository(User);

    // Verificar que la solicitud existe
    const solicitudFound = await solicitudRepository.findOne({
      where: { ID_Solicitud: body.ID_Solicitud },
      relations: ["usuario"],
    });

    if (!solicitudFound) {
      return [null, "La solicitud no existe"];
    }

    // Verificar que no tenga préstamo asociado
    if (solicitudFound.ID_Prestamo) {
      return [null, "La solicitud ya tiene un préstamo asociado"];
    }

    // Verificar que el autorizador existe
    const autorizador = await userRepository.findOne({
      where: { Rut: body.Rut_Autorizador },
    });

    if (!autorizador) {
      return [null, "El usuario autorizador no existe"];
    }

    // Crear el préstamo
    const newPrestamo = prestamoRepository.create({
      ID_Num_Inv: body.ID_Num_Inv,
      Fecha_inicio_prestamo: body.Fecha_inicio_prestamo || new Date(),
      Hora_inicio_prestamo: body.Hora_inicio_prestamo,
      Fecha_fin_prestamo: body.Fecha_fin_prestamo || null,
      Hora_fin_prestamo: body.Hora_fin_prestamo || null,
      Tipo_documento: body.Tipo_documento || null,
      Condiciones_Prestamo: body.Condiciones_Prestamo || null,
    });

    const prestamoSaved = await prestamoRepository.save(newPrestamo);

    // Crear la autorización
    const newAutorizacion = autorizacionRepository.create({
      Rut: body.Rut_Autorizador,
      ID_Prestamo: prestamoSaved.ID_Prestamo,
      Fecha_Aut: body.Fecha_Aut || new Date(),
      Hora_Aut: body.Hora_Aut,
      Obs_Aut: body.Obs_Aut || null,
    });

    await autorizacionRepository.save(newAutorizacion);

    // Crear el primer estado del préstamo (Aprobado)
    const newEstado = tieneEstadoRepository.create({
      ID_Prestamo: prestamoSaved.ID_Prestamo,
      Cod_Estado: 2, // Estado "Aprobado"
      Fecha_Estado: new Date(),
      Hora_Estado: body.Hora_Aut,
      Obs_Estado: "Solicitud aprobada",
    });

    await tieneEstadoRepository.save(newEstado);

    // Actualizar la solicitud con el ID del préstamo
    await solicitudRepository.update(
      { ID_Solicitud: body.ID_Solicitud },
      { ID_Prestamo: prestamoSaved.ID_Prestamo },
    );

    // Marcar el equipo como no disponible
    await equipoRepository.update(
      { ID_Num_Inv: body.ID_Num_Inv },
      { Disponible: false },
    );

    const prestamoWithRelations = await prestamoRepository.findOne({
      where: { ID_Prestamo: prestamoSaved.ID_Prestamo },
      relations: [
        "equipos",
        "equipos.marca",
        "equipos.categoria",
        "equipos.estado",
        "solicitud",
        "solicitud.usuario",
        "autorizacion",
        "autorizacion.usuario",
        "tieneEstados",
        "tieneEstados.estado",
      ],
    });

    return [prestamoWithRelations, null];
  } catch (error) {
    console.error("Error al aprobar la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Rechazar una solicitud
 */
export async function rechazarSolicitudService(body) {
  try {
    const autorizacionRepository = AppDataSource.getRepository(Autorizacion);
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const tieneEstadoRepository = AppDataSource.getRepository(TieneEstado);
    const userRepository = AppDataSource.getRepository(User);

    // Verificar que la solicitud existe
    const solicitudFound = await solicitudRepository.findOne({
      where: { ID_Solicitud: body.ID_Solicitud },
    });

    if (!solicitudFound) {
      return [null, "La solicitud no existe"];
    }

    // Verificar que no tenga préstamo asociado
    if (solicitudFound.ID_Prestamo) {
      return [null, "La solicitud ya fue procesada"];
    }

    // Verificar que el autorizador existe
    const autorizador = await userRepository.findOne({
      where: { Rut: body.Rut_Autorizador },
    });

    if (!autorizador) {
      return [null, "El usuario autorizador no existe"];
    }

    // Crear un préstamo rechazado
    const newPrestamo = prestamoRepository.create({
      ID_Num_Inv: body.ID_Num_Inv,
      Fecha_inicio_prestamo: new Date(),
      Hora_inicio_prestamo: body.Hora_Aut,
    });

    const prestamoSaved = await prestamoRepository.save(newPrestamo);

    // Crear la autorización (rechazo)
    const newAutorizacion = autorizacionRepository.create({
      Rut: body.Rut_Autorizador,
      ID_Prestamo: prestamoSaved.ID_Prestamo,
      Fecha_Aut: body.Fecha_Aut || new Date(),
      Hora_Aut: body.Hora_Aut,
      Obs_Aut: body.Motivo_Rechazo || "Solicitud rechazada",
    });

    await autorizacionRepository.save(newAutorizacion);

    // Crear el estado de rechazo
    const newEstado = tieneEstadoRepository.create({
      ID_Prestamo: prestamoSaved.ID_Prestamo,
      Cod_Estado: 3, // Estado "Rechazado"
      Fecha_Estado: new Date(),
      Hora_Estado: body.Hora_Aut,
      Obs_Estado: body.Motivo_Rechazo || "Solicitud rechazada",
    });

    await tieneEstadoRepository.save(newEstado);

    // Actualizar la solicitud con el ID del préstamo
    await solicitudRepository.update(
      { ID_Solicitud: body.ID_Solicitud },
      { ID_Prestamo: prestamoSaved.ID_Prestamo },
    );

    const prestamoWithRelations = await prestamoRepository.findOne({
      where: { ID_Prestamo: prestamoSaved.ID_Prestamo },
      relations: [
        "equipos",
        "solicitud",
        "solicitud.usuario",
        "autorizacion",
        "autorizacion.usuario",
        "tieneEstados",
        "tieneEstados.estado",
      ],
    });

    return [prestamoWithRelations, null];
  } catch (error) {
    console.error("Error al rechazar la solicitud:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Obtener todas las autorizaciones
 */
export async function getAutorizacionesService() {
  try {
    const autorizacionRepository = AppDataSource.getRepository(Autorizacion);

    const autorizaciones = await autorizacionRepository.find({
      relations: [
        "usuario",
        "usuario.cargo",
        "usuario.tipoUsuario",
        "prestamo",
        "prestamo.equipos",
        "prestamo.solicitud",
        "prestamo.solicitud.usuario",
      ],
      order: { Fecha_Aut: "DESC" },
    });

    return [autorizaciones || [], null];
  } catch (error) {
    console.error("Error al obtener las autorizaciones:", error);
    return [null, "Error interno del servidor"];
  }
}
