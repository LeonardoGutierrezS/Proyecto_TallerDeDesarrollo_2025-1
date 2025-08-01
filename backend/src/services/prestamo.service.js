"use strict";
import Prestamo from "../entity/prestamo.entity.js";
import Equipo from "../entity/equipo.entity.js";
import Categoria from "../entity/categoria.entity.js";
import EstadoPrestamo from "../entity/estado-prestamo.entity.js";
import TipoDocumento from "../entity/tipo-documento.entity.js";
import User from "../entity/user.entity.js";
import HoraDisponible from "../entity/hora-disponible.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { 
  sendSolicitudCreatedNotification,
  sendSolicitudStatusUpdateNotification 
} from "./prestamo-notifications.service.js";

export async function getPrestamoService(query) {
  try {
    const { id, usuarioId, equipoId, categoriaId, estadoPrestamoId, fechaInicioPrestamo, fechaFinPrestamo } = query;

    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const whereConditions = {};
    if (id) whereConditions.id = id;
    if (usuarioId) whereConditions.usuarioId = usuarioId;
    if (equipoId) whereConditions.equipoId = equipoId;
    if (categoriaId) whereConditions.categoriaId = categoriaId;
    if (estadoPrestamoId) whereConditions.estadoPrestamoId = estadoPrestamoId;
    if (fechaInicioPrestamo) whereConditions.fechaInicioPrestamo = fechaInicioPrestamo;
    if (fechaFinPrestamo) whereConditions.fechaFinPrestamo = fechaFinPrestamo;

    const prestamoFound = await prestamoRepository.findOne({
      where: whereConditions,
      relations: ["usuario", "equipo", "categoria", "estadoPrestamo", "tipoDocumento"],
    });

    if (!prestamoFound) return [null, "Préstamo no encontrado"];

    return [prestamoFound, null];
  } catch (error) {
    console.error("Error al obtener el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPrestamosService() {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const prestamos = await prestamoRepository.find({
      relations: ["usuario", "equipo", "categoria", "estadoPrestamo", "tipoDocumento"],
      order: { fechaInicioPrestamo: "DESC", horaInicioPrestamo: "DESC" },
    });

    if (!prestamos || prestamos.length === 0) return [null, "No hay préstamos"];

    return [prestamos, null];
  } catch (error) {
    console.error("Error al obtener los préstamos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPrestamosByUsuarioService(usuarioId) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const prestamos = await prestamoRepository.find({
      where: { usuarioId },
      relations: [
        "usuario", 
        "equipo", 
        "equipo.marca", 
        "equipo.categoria", 
        "equipo.estadoAltaBaja",
        "categoria", 
        "estadoPrestamo", 
        "tipoDocumento"
      ],
      order: { fechaInicioPrestamo: "DESC", horaInicioPrestamo: "DESC" },
    });

    if (!prestamos || prestamos.length === 0) {
      return [null, "No hay préstamos para este usuario"];
    }

    return [prestamos, null];
  } catch (error) {
    console.error("Error al obtener préstamos por usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPrestamosByEquipoService(equipoId) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const prestamos = await prestamoRepository.find({
      where: { equipoId },
      relations: ["usuario", "equipo", "categoria", "estadoPrestamo", "tipoDocumento"],
      order: { fechaInicioPrestamo: "DESC", horaInicioPrestamo: "DESC" },
    });

    if (!prestamos || prestamos.length === 0) {
      return [null, "No hay préstamos para este equipo"];
    }

    return [prestamos, null];
  } catch (error) {
    console.error("Error al obtener préstamos por equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPrestamosByEstadoService(estadoPrestamoId) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const prestamos = await prestamoRepository.find({
      where: { estadoPrestamoId },
      relations: ["usuario", "equipo", "categoria", "estadoPrestamo", "tipoDocumento"],
      order: { fechaInicioPrestamo: "DESC", horaInicioPrestamo: "DESC" },
    });

    // Siempre retornar los datos, aunque el array esté vacío
    return [prestamos, null];
  } catch (error) {
    console.error("Error al obtener préstamos por estado:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createPrestamoService(body) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const equipoRepository = AppDataSource.getRepository(Equipo);
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const estadoRepository = AppDataSource.getRepository(EstadoPrestamo);
    const tipoDocumentoRepository = AppDataSource.getRepository(TipoDocumento);
    const userRepository = AppDataSource.getRepository(User);
    const horaDisponibleRepository = AppDataSource.getRepository(HoraDisponible);

    // Verificar que existan las entidades relacionadas
    const usuarioExists = await userRepository.findOne({
      where: { id: body.usuarioId },
    });
    if (!usuarioExists) return [null, "El usuario especificado no existe"];

    const equipoExists = await equipoRepository.findOne({
      where: { id: body.equipoId },
    });
    if (!equipoExists) return [null, "El equipo especificado no existe"];

    const categoriaExists = await categoriaRepository.findOne({
      where: { id: body.categoriaId },
    });
    if (!categoriaExists) return [null, "La categoría especificada no existe"];

    const estadoExists = await estadoRepository.findOne({
      where: { id: body.estadoPrestamoId || 1 },
    });
    if (!estadoExists) return [null, "El estado del préstamo especificado no existe"];

    if (body.tipoDocumentoId) {
      const tipoDocumentoExists = await tipoDocumentoRepository.findOne({
        where: { id: body.tipoDocumentoId },
      });
      if (!tipoDocumentoExists) return [null, "El tipo de documento especificado no existe"];
    }

    // Verificar disponibilidad del equipo en el horario solicitado
    const disponibilidadInicio = await horaDisponibleRepository.findOne({
      where: {
        equipoId: body.equipoId,
        fecha: body.fechaInicioPrestamo,
        hora: body.horaInicioPrestamo,
        disponible: true,
      },
    });

    if (!disponibilidadInicio) {
      return [null, "El equipo no está disponible en la hora de inicio solicitada"];
    }

    // Verificar que no hay conflictos con otros préstamos
    const conflictoPrestamo = await prestamoRepository
      .createQueryBuilder("prestamo")
      .where("prestamo.equipoId = :equipoId", { equipoId: body.equipoId })
      .andWhere("prestamo.estadoPrestamoId IN (:...estados)", { estados: [1, 2] }) // Pendiente y Aprobado
      .andWhere(
        "(prestamo.fechaInicioPrestamo < :fechaFin AND prestamo.fechaFinPrestamo > :fechaInicio)",
        {
          fechaInicio: body.fechaInicioPrestamo,
          fechaFin: body.fechaFinPrestamo,
        }
      )
      .getOne();

    if (conflictoPrestamo) {
      return [null, "Ya existe un préstamo para este equipo en el período solicitado"];
    }

    const newPrestamo = prestamoRepository.create({
      categoriaId: body.categoriaId,
      equipoId: body.equipoId,
      fechaInicioPrestamo: body.fechaInicioPrestamo,
      horaInicioPrestamo: body.horaInicioPrestamo,
      horaFinPrestamo: body.horaFinPrestamo,
      fechaFinPrestamo: body.fechaFinPrestamo,
      estadoPrestamoId: body.estadoPrestamoId || 1, // Por defecto "Pendiente"
      motivoRechazo: body.motivoRechazo || null,
      retencionDocumento: body.retencionDocumento || false,
      tipoDocumentoId: body.tipoDocumentoId || null,
      usuarioId: body.usuarioId,
    });

    const prestamoCreated = await prestamoRepository.save(newPrestamo);

    // Marcar horas como no disponibles si el préstamo es aprobado
    if (body.estadoPrestamoId === 2) { // Asumiendo que 2 es "Aprobado"
      await marcarHorasNoDisponibles(
        body.equipoId,
        body.fechaInicioPrestamo,
        body.fechaFinPrestamo,
        body.horaInicioPrestamo,
        body.horaFinPrestamo
      );
    }

    // Obtener el préstamo con sus relaciones
    const prestamoWithRelations = await prestamoRepository.findOne({
      where: { id: prestamoCreated.id },
      relations: ["usuario", "equipo", "categoria", "estadoPrestamo", "tipoDocumento", "equipo.marca"],
    });

    // Enviar notificación por email al usuario
    try {
      await sendSolicitudCreatedNotification(
        prestamoWithRelations.usuario.email,
        prestamoWithRelations.usuario.nombreCompleto,
        prestamoWithRelations
      );
      console.log(`✅ Notificación de solicitud creada enviada a ${prestamoWithRelations.usuario.email}`);
    } catch (emailError) {
      console.error("⚠️ Error enviando notificación de solicitud creada:", emailError.message);
      // No retornamos error aquí para no bloquear la creación del préstamo
    }

    return [prestamoWithRelations, null];
  } catch (error) {
    console.error("Error al crear el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updatePrestamoService(query, body) {
  try {
    const { id, usuarioId, equipoId, categoriaId, estadoPrestamoId } = query;

    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const equipoRepository = AppDataSource.getRepository(Equipo);
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const estadoRepository = AppDataSource.getRepository(EstadoPrestamo);
    const tipoDocumentoRepository = AppDataSource.getRepository(TipoDocumento);

    const whereConditions = {};
    if (id) whereConditions.id = id;
    if (usuarioId) whereConditions.usuarioId = usuarioId;
    if (equipoId) whereConditions.equipoId = equipoId;
    if (categoriaId) whereConditions.categoriaId = categoriaId;
    if (estadoPrestamoId) whereConditions.estadoPrestamoId = estadoPrestamoId;

    const prestamoFound = await prestamoRepository.findOne({
      where: whereConditions,
    });

    if (!prestamoFound) return [null, "Préstamo no encontrado"];

    // Verificar entidades relacionadas si se proporcionan
    if (body.equipoId) {
      const equipoExists = await equipoRepository.findOne({
        where: { id: body.equipoId },
      });
      if (!equipoExists) return [null, "El equipo especificado no existe"];
    }

    if (body.categoriaId) {
      const categoriaExists = await categoriaRepository.findOne({
        where: { id: body.categoriaId },
      });
      if (!categoriaExists) return [null, "La categoría especificada no existe"];
    }

    if (body.estadoPrestamoId) {
      const estadoExists = await estadoRepository.findOne({
        where: { id: body.estadoPrestamoId },
      });
      if (!estadoExists) return [null, "El estado del préstamo especificado no existe"];
    }

    if (body.tipoDocumentoId) {
      const tipoDocumentoExists = await tipoDocumentoRepository.findOne({
        where: { id: body.tipoDocumentoId },
      });
      if (!tipoDocumentoExists) return [null, "El tipo de documento especificado no existe"];
    }

    const dataPrestamoUpdate = {
      categoriaId: body.categoriaId,
      equipoId: body.equipoId,
      fechaInicioPrestamo: body.fechaInicioPrestamo,
      horaInicioPrestamo: body.horaInicioPrestamo,
      horaFinPrestamo: body.horaFinPrestamo,
      fechaFinPrestamo: body.fechaFinPrestamo,
      estadoPrestamoId: body.estadoPrestamoId,
      motivoRechazo: body.motivoRechazo,
      retencionDocumento: body.retencionDocumento,
      tipoDocumentoId: body.tipoDocumentoId,
      fechaRealEntrega: body.fechaRealEntrega,
      horaRealEntrega: body.horaRealEntrega,
      updatedAt: new Date(),
    };

    // Remover propiedades undefined
    Object.keys(dataPrestamoUpdate).forEach(key => {
      if (dataPrestamoUpdate[key] === undefined) {
        delete dataPrestamoUpdate[key];
      }
    });

    await prestamoRepository.update({ id: prestamoFound.id }, dataPrestamoUpdate);

    const prestamoUpdated = await prestamoRepository.findOne({
      where: { id: prestamoFound.id },
      relations: ["usuario", "equipo", "categoria", "estadoPrestamo", "tipoDocumento"],
    });

    return [prestamoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateEstadoPrestamoService(prestamoId, estadoData) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const estadoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const prestamoFound = await prestamoRepository.findOne({
      where: { id: prestamoId },
      relations: ["estadoPrestamo", "usuario"],
    });

    if (!prestamoFound) return [null, "Préstamo no encontrado"];

    // Guardar el estado anterior para la notificación
    const estadoAnterior = prestamoFound.estadoPrestamo?.nombre;

    const estadoExists = await estadoRepository.findOne({
      where: { id: estadoData.estadoPrestamoId },
    });
    if (!estadoExists) return [null, "El estado del préstamo especificado no existe"];

    const updateData = {
      estadoPrestamoId: estadoData.estadoPrestamoId,
      updatedAt: new Date(),
    };

    // Si se rechaza, agregar motivo de rechazo
    if (estadoData.estadoPrestamoId === 3 && estadoData.motivoRechazo) { // Asumiendo que 3 es "Rechazado"
      updateData.motivoRechazo = estadoData.motivoRechazo;
    }

    // Si se entrega, marcar fecha y hora real de entrega
    if (estadoData.estadoPrestamoId === 4) { // Asumiendo que 4 es "Entregado"
      updateData.fechaRealEntrega = new Date();
      updateData.horaRealEntrega = new Date().toTimeString().slice(0, 5);
    }

    await prestamoRepository.update({ id: prestamoFound.id }, updateData);

    // Manejar disponibilidad de horas según el estado
    if (estadoData.estadoPrestamoId === 2) { // Aprobado
      await marcarHorasNoDisponibles(
        prestamoFound.equipoId,
        prestamoFound.fechaInicioPrestamo,
        prestamoFound.fechaFinPrestamo,
        prestamoFound.horaInicioPrestamo,
        prestamoFound.horaFinPrestamo
      );
    } else if (estadoData.estadoPrestamoId === 3 || estadoData.estadoPrestamoId === 4) { // Rechazado o Entregado
      await liberarHorasDisponibles(
        prestamoFound.equipoId,
        prestamoFound.fechaInicioPrestamo,
        prestamoFound.fechaFinPrestamo,
        prestamoFound.horaInicioPrestamo,
        prestamoFound.horaFinPrestamo
      );
    }

    const prestamoUpdated = await prestamoRepository.findOne({
      where: { id: prestamoFound.id },
      relations: ["usuario", "equipo", "categoria", "estadoPrestamo", "tipoDocumento", "equipo.marca"],
    });

    // Enviar notificación por email cuando cambia el estado
    try {
      await sendSolicitudStatusUpdateNotification(
        prestamoUpdated.usuario.email,
        prestamoUpdated.usuario.nombreCompleto,
        prestamoUpdated,
        estadoAnterior
      );
      console.log(`✅ Notificación de cambio de estado enviada a ${prestamoUpdated.usuario.email}`);
    } catch (emailError) {
      console.error("⚠️ Error enviando notificación de cambio de estado:", emailError.message);
      // No retornamos error aquí para no bloquear la actualización del préstamo
    }

    return [prestamoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar estado del préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deletePrestamoService(query) {
  try {
    const { id, usuarioId, equipoId, categoriaId, estadoPrestamoId } = query;

    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const whereConditions = {};
    if (id) whereConditions.id = id;
    if (usuarioId) whereConditions.usuarioId = usuarioId;
    if (equipoId) whereConditions.equipoId = equipoId;
    if (categoriaId) whereConditions.categoriaId = categoriaId;
    if (estadoPrestamoId) whereConditions.estadoPrestamoId = estadoPrestamoId;

    const prestamoFound = await prestamoRepository.findOne({
      where: whereConditions,
    });

    if (!prestamoFound) return [null, "Préstamo no encontrado"];

    // Solo permitir eliminar préstamos en estado pendiente o rechazado
    if (prestamoFound.estadoPrestamoId === 2 || prestamoFound.estadoPrestamoId === 4) {
      return [null, "No se puede eliminar un préstamo aprobado o entregado"];
    }

    const prestamoDeleted = await prestamoRepository.remove(prestamoFound);

    return [prestamoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

// Funciones auxiliares para manejo de disponibilidad
async function marcarHorasNoDisponibles(equipoId, fechaInicio, fechaFin, horaInicio, horaFin) {
  try {
    const horaDisponibleRepository = AppDataSource.getRepository(HoraDisponible);
    
    await horaDisponibleRepository
      .createQueryBuilder()
      .update(HoraDisponible)
      .set({ disponible: false, updatedAt: new Date() })
      .where("equipoId = :equipoId", { equipoId })
      .andWhere("fecha >= :fechaInicio", { fechaInicio })
      .andWhere("fecha <= :fechaFin", { fechaFin })
      .andWhere("hora >= :horaInicio", { horaInicio })
      .andWhere("hora <= :horaFin", { horaFin })
      .execute();
  } catch (error) {
    console.error("Error al marcar horas como no disponibles:", error);
  }
}

async function liberarHorasDisponibles(equipoId, fechaInicio, fechaFin, horaInicio, horaFin) {
  try {
    const horaDisponibleRepository = AppDataSource.getRepository(HoraDisponible);
    
    await horaDisponibleRepository
      .createQueryBuilder()
      .update(HoraDisponible)
      .set({ disponible: true, updatedAt: new Date() })
      .where("equipoId = :equipoId", { equipoId })
      .andWhere("fecha >= :fechaInicio", { fechaInicio })
      .andWhere("fecha <= :fechaFin", { fechaFin })
      .andWhere("hora >= :horaInicio", { horaInicio })
      .andWhere("hora <= :horaFin", { horaFin })
      .execute();
  } catch (error) {
    console.error("Error al liberar horas disponibles:", error);
  }
}
