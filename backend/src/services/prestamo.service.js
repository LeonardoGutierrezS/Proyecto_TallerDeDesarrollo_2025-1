"use strict";
import Prestamo from "../entity/prestamo.entity.js";
import Equipos from "../entity/equipos.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createPrestamoService(body) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const equipoRepository = AppDataSource.getRepository(Equipos);
    const userRepository = AppDataSource.getRepository(User);

    // Verificar que el usuario existe
    const userFound = await userRepository.findOne({
      where: { ID_Usuario: body.ID_Usuario },
    });

    if (!userFound) {
      return [null, "El usuario no existe"];
    }

    // Verificar que el usuario está vigente
    if (!userFound.Vigente) {
      return [null, "El usuario no está vigente, no puede realizar préstamos"];
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

    const newPrestamo = prestamoRepository.create({
      ID_Num_Inv: body.ID_Num_Inv,
      ID_Usuario: body.ID_Usuario, // Agregar directamente el ID
      Fecha_inicio_prestamo: body.Fecha_inicio_prestamo || new Date(),
      Hora_inicio_prestamo: body.Hora_inicio_prestamo,
      Fecha_ter_prestamo: body.Fecha_ter_prestamo || null,
      Hora_fin_prestamo: body.Hora_fin_prestamo || null,
      Motivo_Rechazo: body.Motivo_Rechazo || null,
      Retencion_documento: body.Retencion_documento || null,
      Fecha_devolucion: body.Fecha_devolucion || null,
      Hora_devolucion: body.Hora_devolucion || null,
      Condiciones_Prestamo: body.Condiciones_Prestamo || null,
      Observaciones: body.Observaciones || null,
      usuario: { ID_Usuario: body.ID_Usuario },
      categoria: { ID_Categoria: body.ID_Categoria },
      estadoPrestamo: { ID_Estado_Prestamo: body.ID_Estado_Prestamo },
      tipoDocumento: body.ID_Tipo_Documento ? { ID_Tipo_Documento: body.ID_Tipo_Documento } : null,
    });

    const prestamoSaved = await prestamoRepository.save(newPrestamo);

    // Marcar el equipo como no disponible
    await equipoRepository.update(
      { ID_Num_Inv: body.ID_Num_Inv },
      { Disponible: false },
    );

    const prestamoWithRelations = await prestamoRepository.findOne({
      where: { ID_Prestamo: prestamoSaved.ID_Prestamo },
      relations: [
        "usuario",
        "usuario.rol",
        "usuario.carrera",
        "categoria",
        "estadoPrestamo",
        "tipoDocumento",
        "equipos",
      ],
    });

    return [prestamoWithRelations, null];
  } catch (error) {
    console.error("Error al crear el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPrestamoService(id) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const prestamoFound = await prestamoRepository.findOne({
      where: { ID_Prestamo: id },
      relations: [
        "usuario",
        "usuario.rol",
        "usuario.carrera",
        "categoria",
        "estadoPrestamo",
        "tipoDocumento",
        "equipos",
      ],
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
      relations: [
        "usuario",
        "usuario.rol",
        "usuario.carrera",
        "categoria",
        "estadoPrestamo",
        "tipoDocumento",
        "equipos",
      ],
      order: { Fecha_inicio_prestamo: "DESC" },
    });

    return [prestamos || [], null];
  } catch (error) {
    console.error("Error al obtener los préstamos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPrestamosPorUsuarioService(usuarioId) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const prestamos = await prestamoRepository.find({
      where: { usuario: { ID_Usuario: usuarioId } },
      relations: [
        "usuario",
        "usuario.rol",
        "usuario.carrera",
        "categoria",
        "estadoPrestamo",
        "tipoDocumento",
        "equipos",
      ],
      order: { Fecha_inicio_prestamo: "DESC" },
    });

    return [prestamos || [], null];
  } catch (error) {
    console.error("Error al obtener los préstamos por usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPrestamosActivosService() {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const prestamosActivos = await prestamoRepository.find({
      where: { Fecha_devolucion: null },
      relations: [
        "usuario",
        "usuario.rol",
        "usuario.carrera",
        "categoria",
        "estadoPrestamo",
        "tipoDocumento",
        "equipos",
      ],
      order: { Fecha_inicio_prestamo: "DESC" },
    });

    if (!prestamosActivos || prestamosActivos.length === 0) {
      return [null, "No hay préstamos activos"];
    }

    return [prestamosActivos, null];
  } catch (error) {
    console.error("Error al obtener los préstamos activos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updatePrestamoService(id, body) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    const prestamoFound = await prestamoRepository.findOne({
      where: { ID_Prestamo: id },
    });

    if (!prestamoFound) return [null, "Préstamo no encontrado"];

    const dataPrestamoUpdate = {
      Fecha_ter_prestamo: body.Fecha_ter_prestamo !== undefined ? body.Fecha_ter_prestamo : prestamoFound.Fecha_ter_prestamo,
      Hora_fin_prestamo: body.Hora_fin_prestamo !== undefined ? body.Hora_fin_prestamo : prestamoFound.Hora_fin_prestamo,
      Motivo_Rechazo: body.Motivo_Rechazo !== undefined ? body.Motivo_Rechazo : prestamoFound.Motivo_Rechazo,
      Retencion_documento: body.Retencion_documento !== undefined ? body.Retencion_documento : prestamoFound.Retencion_documento,
      Fecha_devolucion: body.Fecha_devolucion !== undefined ? body.Fecha_devolucion : prestamoFound.Fecha_devolucion,
      Hora_devolucion: body.Hora_devolucion !== undefined ? body.Hora_devolucion : prestamoFound.Hora_devolucion,
      Condiciones_Prestamo: body.Condiciones_Prestamo !== undefined ? body.Condiciones_Prestamo : prestamoFound.Condiciones_Prestamo,
      Observaciones: body.Observaciones !== undefined ? body.Observaciones : prestamoFound.Observaciones,
    };

    if (body.ID_Estado_Prestamo) {
      dataPrestamoUpdate.estadoPrestamo = { ID_Estado_Prestamo: body.ID_Estado_Prestamo };
    }

    await prestamoRepository.save({
      ID_Prestamo: id,
      ...dataPrestamoUpdate,
    });

    const prestamoUpdated = await prestamoRepository.findOne({
      where: { ID_Prestamo: id },
      relations: [
        "usuario",
        "usuario.rol",
        "usuario.carrera",
        "categoria",
        "estadoPrestamo",
        "tipoDocumento",
        "equipos",
      ],
    });

    return [prestamoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function finalizarPrestamoService(id, body) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const prestamoFound = await prestamoRepository.findOne({
      where: { ID_Prestamo: id },
    });

    if (!prestamoFound) return [null, "Préstamo no encontrado"];

    if (prestamoFound.Fecha_devolucion) {
      return [null, "El préstamo ya fue finalizado"];
    }

    const dataFinalizacion = {
      Fecha_devolucion: body.Fecha_devolucion || new Date(),
      Hora_devolucion: body.Hora_devolucion,
      Observaciones: body.Observaciones || prestamoFound.Observaciones,
      estadoPrestamo: { ID_Estado_Prestamo: body.ID_Estado_Prestamo },
    };

    await prestamoRepository.save({
      ID_Prestamo: id,
      ...dataFinalizacion,
    });

    // Marcar el equipo como disponible nuevamente
    await equipoRepository.update(
      { ID_Num_Inv: prestamoFound.ID_Num_Inv },
      { Disponible: true },
    );

    const prestamoFinalizado = await prestamoRepository.findOne({
      where: { ID_Prestamo: id },
      relations: [
        "usuario",
        "usuario.rol",
        "usuario.carrera",
        "categoria",
        "estadoPrestamo",
        "tipoDocumento",
        "equipos",
      ],
    });

    return [prestamoFinalizado, null];
  } catch (error) {
    console.error("Error al finalizar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deletePrestamoService(id) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const prestamoFound = await prestamoRepository.findOne({
      where: { ID_Prestamo: id },
      relations: ["usuario", "categoria", "estadoPrestamo", "equipos"],
    });

    if (!prestamoFound) return [null, "Préstamo no encontrado"];

    // Si el préstamo no estaba finalizado, liberar el equipo
    if (!prestamoFound.Fecha_devolucion) {
      await equipoRepository.update(
        { ID_Num_Inv: prestamoFound.ID_Num_Inv },
        { Disponible: true },
      );
    }

    const prestamoDeleted = await prestamoRepository.remove(prestamoFound);

    return [prestamoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}
