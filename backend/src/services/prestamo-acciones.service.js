"use strict";
import { AppDataSource } from "../config/configDb.js";
import Prestamo from "../entity/prestamo.entity.js";
import TieneEstado from "../entity/tiene_estado.entity.js";
import Devolucion from "../entity/devolucion.entity.js";
import Equipos from "../entity/equipos.entity.js";
import { enviarEmailEquipoEntregado, enviarEmailEquipoDevuelto } from "./email.service.js";

/**
 * Marcar préstamo como entregado (Admin entrega el equipo al alumno)
 * @param {number} idPrestamo - ID del préstamo
 * @param {string} rutAdmin - RUT del administrador que entrega
 * @returns {Promise<[Object|null, string|null]>}
 */
export async function entregarPrestamoService(idPrestamo, rutAdmin) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const tieneEstadoRepository = AppDataSource.getRepository(TieneEstado);

    // Verificar que el préstamo existe
    const prestamo = await prestamoRepository.findOne({
      where: { ID_Prestamo: idPrestamo },
      relations: ["tieneEstados", "tieneEstados.estadoPrestamo"],
    });

    if (!prestamo) {
      return [null, "El préstamo no existe"];
    }

    // Verificar que el estado actual es "Listo para Entregar" (ID_Estado = 2)
    const estadoActual = prestamo.tieneEstados
      .sort((a, b) => new Date(b.Fecha_Estado) - new Date(a.Fecha_Estado))[0];

    if (!estadoActual || estadoActual.Cod_Estado !== 2) {
      return [null, "El préstamo no está en estado 'Listo para Entregar'"];
    }

    // Crear nuevo estado "Entregado" (ID_Estado = 3)
    const now = new Date();
    const horaActual = now.toTimeString().split(" ")[0];

    const nuevoEstado = tieneEstadoRepository.create({
      ID_Prestamo: idPrestamo,
      Cod_Estado: 3, // Estado "Entregado"
      Fecha_Estado: now,
      Hora_Estado: horaActual,
      Obs_Estado: `Equipo entregado por administrador (${rutAdmin})`,
    });

    await tieneEstadoRepository.save(nuevoEstado);

    // Obtener préstamo actualizado con todas las relaciones
    const prestamoActualizado = await prestamoRepository.findOne({
      where: { ID_Prestamo: idPrestamo },
      relations: [
        "equipos",
        "equipos.marca",
        "equipos.categoria",
        "solicitudes",
        "solicitudes.usuario",
        "tieneEstados",
        "tieneEstados.estadoPrestamo",
      ],
    });

    // Enviar notificación por correo
    if (prestamoActualizado && prestamoActualizado.solicitudes && prestamoActualizado.solicitudes.length > 0) {
      await enviarEmailEquipoEntregado(prestamoActualizado.solicitudes[0], prestamoActualizado);
    }

    return [prestamoActualizado, null];
  } catch (error) {
    console.error("Error al entregar préstamo:", error);
    return [null, "Error interno del servidor"];
  }
}

/**
 * Registrar devolución de préstamo (Admin recibe el equipo del alumno)
 * @param {Object} data - Datos de la devolución
 * @returns {Promise<[Object|null, string|null]>}
 */
export async function devolverPrestamoService(data) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const tieneEstadoRepository = AppDataSource.getRepository(TieneEstado);
    const devolucionRepository = AppDataSource.getRepository(Devolucion);
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const { ID_Prestamo, Rut_Recibe, Fecha_Dev, Hora_Dev, Obs_Dev, Estado_Equipo_Devolucion } = data;

    // Verificar que el préstamo existe
    const prestamo = await prestamoRepository.findOne({
      where: { ID_Prestamo },
      relations: ["tieneEstados", "tieneEstados.estadoPrestamo", "devolucion"],
    });

    if (!prestamo) {
      return [null, "El préstamo no existe"];
    }

    // Verificar que el estado actual es "Entregado" (ID_Estado = 3)
    const estadoActual = prestamo.tieneEstados
      .sort((a, b) => new Date(b.Fecha_Estado) - new Date(a.Fecha_Estado))[0];

    if (!estadoActual || estadoActual.Cod_Estado !== 3) {
      return [null, "El préstamo no está en estado 'Entregado'"];
    }

    // Verificar que no tenga ya una devolución registrada
    if (prestamo.devolucion) {
      return [null, "Este préstamo ya tiene una devolución registrada"];
    }

    // Crear registro de devolución
    const nuevaDevolucion = devolucionRepository.create({
      Rut: Rut_Recibe,
      ID_Prestamo,
      Fecha_Dev: Fecha_Dev || new Date(),
      Hora_Dev: Hora_Dev,
      Obs_Dev: Obs_Dev || null,
      Estado_Equipo_Devolucion: Estado_Equipo_Devolucion || "En buen estado",
    });

    await devolucionRepository.save(nuevaDevolucion);

    // Crear nuevo estado "Devuelto" (ID_Estado = 4)
    const now = new Date();
    const horaActual = now.toTimeString().split(" ")[0];

    const nuevoEstado = tieneEstadoRepository.create({
      ID_Prestamo,
      Cod_Estado: 4, // Estado "Devuelto"
      Fecha_Estado: now,
      Hora_Estado: horaActual,
      Obs_Estado: `Equipo devuelto - Estado: ${Estado_Equipo_Devolucion || "En buen estado"}`,
    });

    await tieneEstadoRepository.save(nuevoEstado);

    // Marcar el equipo como disponible nuevamente
    await equipoRepository.update(
      { ID_Num_Inv: prestamo.ID_Num_Inv },
      { Disponible: true }
    );

    // Obtener préstamo actualizado con todas las relaciones
    const prestamoActualizado = await prestamoRepository.findOne({
      where: { ID_Prestamo },
      relations: [
        "equipos",
        "equipos.marca",
        "equipos.categoria",
        "solicitudes",
        "solicitudes.usuario",
        "tieneEstados",
        "tieneEstados.estadoPrestamo",
        "devolucion",
        "devolucion.usuario",
      ],
    });

    // Enviar notificación por correo
    if (prestamoActualizado && prestamoActualizado.solicitudes && prestamoActualizado.solicitudes.length > 0 && prestamoActualizado.devolucion) {
      await enviarEmailEquipoDevuelto(prestamoActualizado.solicitudes[0], prestamoActualizado.devolucion);
    }

    return [prestamoActualizado, null];
  } catch (error) {
    console.error("Error al registrar devolución:", error);
    return [null, "Error interno del servidor"];
  }
}
