"use strict";
import HoraDisponible from "../entity/hora-disponible.entity.js";
import Equipo from "../entity/equipo.entity.js";
import Prestamo from "../entity/prestamo.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm";

export async function getHoraDisponibleService(query) {
  try {
    const { id, equipoId, fecha, disponible } = query;

    const horaRepository = AppDataSource.getRepository(HoraDisponible);

    const whereConditions = {};
    if (id) whereConditions.id = id;
    if (equipoId) whereConditions.equipoId = equipoId;
    if (fecha) whereConditions.fecha = fecha;
    if (disponible !== undefined) whereConditions.disponible = disponible;

    const horaFound = await horaRepository.findOne({
      where: whereConditions,
      relations: ["equipo"],
    });

    if (!horaFound) return [null, "Hora disponible no encontrada"];

    return [horaFound, null];
  } catch (error) {
    console.error("Error al obtener la hora disponible:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getHorasDisponiblesService() {
  try {
    const horaRepository = AppDataSource.getRepository(HoraDisponible);

    const horas = await horaRepository.find({
      relations: ["equipo"],
      order: { fecha: "ASC", hora: "ASC" },
    });

    if (!horas || horas.length === 0) return [null, "No hay horas disponibles"];

    return [horas, null];
  } catch (error) {
    console.error("Error al obtener las horas disponibles:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getHorasDisponiblesByEquipoService(equipoId) {
  try {
    const horaRepository = AppDataSource.getRepository(HoraDisponible);

    const horas = await horaRepository.find({
      where: { equipoId },
      relations: ["equipo"],
      order: { fecha: "ASC", hora: "ASC" },
    });

    if (!horas || horas.length === 0) {
      return [null, "No hay horas disponibles para este equipo"];
    }

    return [horas, null];
  } catch (error) {
    console.error("Error al obtener horas por equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getHorasRealmenterDisponiblesByEquipoService(equipoId, fecha = null) {
  try {
    const horaRepository = AppDataSource.getRepository(HoraDisponible);
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    // Obtener todas las horas disponibles para el equipo
    const whereConditions = { equipoId };
    if (fecha) {
      whereConditions.fecha = fecha;
    }

    const horas = await horaRepository.find({
      where: whereConditions,
      relations: ["equipo"],
      order: { fecha: "ASC", hora: "ASC" },
    });

    if (!horas || horas.length === 0) {
      return [[], null];
    }

    // Obtener todos los préstamos pendientes (1) y aprobados (2) y entregados (4) para el equipo
    const prestamos = await prestamoRepository.find({
      where: {
        equipoId,
        estadoPrestamoId: In([1, 2, 4]), // Pendiente, Aprobado, Entregado
      },
    });

    // Filtrar horas que NO están ocupadas por préstamos
    const horasDisponibles = horas.filter(hora => {
      return !prestamos.some(prestamo => {
        // Verificar si esta hora está dentro del rango de algún préstamo
        const fechaHora = new Date(`${hora.fecha}T${hora.hora}`);
        const fechaInicioPrestamo = new Date(`${prestamo.fechaInicioPrestamo}T${prestamo.horaInicioPrestamo}`);
        const fechaFinPrestamo = new Date(`${prestamo.fechaFinPrestamo}T${prestamo.horaFinPrestamo}`);
        
        return fechaHora >= fechaInicioPrestamo && fechaHora < fechaFinPrestamo;
      });
    });

    return [horasDisponibles, null];
  } catch (error) {
    console.error("Error al obtener horas realmente disponibles:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getRangosHorariosDisponiblesService(equipoId, fecha) {
  try {
    // Obtener horas realmente disponibles
    const [horasDisponibles, error] = await getHorasRealmenterDisponiblesByEquipoService(equipoId, fecha);
    
    if (error) {
      return [null, error];
    }

    if (!horasDisponibles || horasDisponibles.length === 0) {
      return [[], null];
    }

    // Agrupar por fecha
    const horasPorFecha = {};
    horasDisponibles.forEach(hora => {
      if (!horasPorFecha[hora.fecha]) {
        horasPorFecha[hora.fecha] = [];
      }
      horasPorFecha[hora.fecha].push(hora.hora);
    });

    // Generar rangos continuos para cada fecha
    const rangos = [];
    
    Object.keys(horasPorFecha).forEach(fecha => {
      const horas = horasPorFecha[fecha].sort();
      const rangosFecha = generarRangosContinuos(horas, fecha);
      rangos.push(...rangosFecha);
    });

    return [rangos, null];
  } catch (error) {
    console.error("Error al obtener rangos horarios:", error);
    return [null, "Error interno del servidor"];
  }
}

function generarRangosContinuos(horas, fecha) {
  if (!horas || horas.length === 0) return [];

  const rangos = [];
  let inicioRango = horas[0];
  let finRango = horas[0];

  for (let i = 1; i < horas.length; i++) {
    const horaActual = horas[i];
    const horaAnterior = horas[i - 1];
    
    // Convertir horas a minutos para comparar
    const minutosActual = horaAMinutos(horaActual);
    const minutosAnterior = horaAMinutos(horaAnterior);
    
    // Si la diferencia es exactamente 60 minutos (1 hora), es continuo
    if (minutosActual - minutosAnterior === 60) {
      finRango = horaActual;
    } else {
      // No es continuo, guardar el rango actual y empezar uno nuevo
      rangos.push({
        fecha,
        horaInicio: inicioRango,
        horaFin: sumarUnaHora(finRango),
        tipo: inicioRango === finRango ? "individual" : "rango"
      });
      
      inicioRango = horaActual;
      finRango = horaActual;
    }
  }

  // Agregar el último rango
  rangos.push({
    fecha,
    horaInicio: inicioRango,
    horaFin: sumarUnaHora(finRango),
    tipo: inicioRango === finRango ? "individual" : "rango"
  });

  return rangos;
}

function horaAMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function sumarUnaHora(hora) {
  const [h, m] = hora.split(":").map(Number);
  const nuevaHora = h + 1;
  return `${String(nuevaHora).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function getHorasDisponiblesByFechaService(fecha) {
  try {
    const horaRepository = AppDataSource.getRepository(HoraDisponible);

    const horas = await horaRepository.find({
      where: { fecha },
      relations: ["equipo"],
      order: { hora: "ASC" },
    });

    if (!horas || horas.length === 0) {
      return [null, "No hay horas disponibles para esta fecha"];
    }

    return [horas, null];
  } catch (error) {
    console.error("Error al obtener horas por fecha:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getHorasDisponiblesByRangoService(equipoId, fechaInicio, fechaFin) {
  try {
    const horaRepository = AppDataSource.getRepository(HoraDisponible);

    const horas = await horaRepository
      .createQueryBuilder("hora")
      .leftJoinAndSelect("hora.equipo", "equipo")
      .where("hora.equipoId = :equipoId", { equipoId })
      .andWhere("hora.fecha >= :fechaInicio", { fechaInicio })
      .andWhere("hora.fecha <= :fechaFin", { fechaFin })
      .orderBy("hora.fecha", "ASC")
      .addOrderBy("hora.hora", "ASC")
      .getMany();

    if (!horas || horas.length === 0) {
      return [null, "No hay horas disponibles en el rango especificado"];
    }

    return [horas, null];
  } catch (error) {
    console.error("Error al obtener horas por rango:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createHoraDisponibleService(body) {
  try {
    const horaRepository = AppDataSource.getRepository(HoraDisponible);
    const equipoRepository = AppDataSource.getRepository(Equipo);

    // Verificar que el equipo existe
    const equipoExists = await equipoRepository.findOne({
      where: { id: body.equipoId },
    });
    if (!equipoExists) return [null, "El equipo especificado no existe"];

    // Verificar que no exista una hora duplicada para el mismo equipo, fecha y hora
    const existingHora = await horaRepository.findOne({
      where: {
        equipoId: body.equipoId,
        fecha: body.fecha,
        hora: body.hora,
      },
    });

    if (existingHora) {
      return [null, "Ya existe una hora registrada para este equipo en esta fecha y hora"];
    }

    const newHora = horaRepository.create({
      equipoId: body.equipoId,
      hora: body.hora,
      fecha: body.fecha,
      disponible: body.disponible !== undefined ? body.disponible : true,
    });

    const horaCreated = await horaRepository.save(newHora);

    // Obtener la hora con sus relaciones
    const horaWithRelations = await horaRepository.findOne({
      where: { id: horaCreated.id },
      relations: ["equipo"],
    });

    return [horaWithRelations, null];
  } catch (error) {
    console.error("Error al crear la hora disponible:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createMultipleHorasService(equipoId, fecha, horas) {
  try {
    const horaRepository = AppDataSource.getRepository(HoraDisponible);
    const equipoRepository = AppDataSource.getRepository(Equipo);

    // Verificar que el equipo existe
    const equipoExists = await equipoRepository.findOne({
      where: { id: equipoId },
    });
    if (!equipoExists) return [null, "El equipo especificado no existe"];

    const horasCreadas = [];
    const errores = [];

    for (const hora of horas) {
      // Verificar que no exista una hora duplicada
      const existingHora = await horaRepository.findOne({
        where: {
          equipoId,
          fecha,
          hora,
        },
      });

      if (!existingHora) {
        const newHora = horaRepository.create({
          equipoId,
          hora,
          fecha,
          disponible: true,
        });

        const horaCreated = await horaRepository.save(newHora);
        horasCreadas.push(horaCreated);
      } else {
        errores.push(`Hora ${hora} ya existe`);
      }
    }

    if (horasCreadas.length === 0) {
      return [null, "No se pudo crear ninguna hora: " + errores.join(", ")];
    }

    return [horasCreadas, errores.length > 0 ? errores : null];
  } catch (error) {
    console.error("Error al crear múltiples horas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateHoraDisponibleService(query, body) {
  try {
    const { id, equipoId, fecha, disponible } = query;

    const horaRepository = AppDataSource.getRepository(HoraDisponible);
    const equipoRepository = AppDataSource.getRepository(Equipo);

    const whereConditions = {};
    if (id) whereConditions.id = id;
    if (equipoId) whereConditions.equipoId = equipoId;
    if (fecha) whereConditions.fecha = fecha;
    if (disponible !== undefined) whereConditions.disponible = disponible;

    const horaFound = await horaRepository.findOne({
      where: whereConditions,
    });

    if (!horaFound) return [null, "Hora disponible no encontrada"];

    // Verificar equipo si se proporciona
    if (body.equipoId) {
      const equipoExists = await equipoRepository.findOne({
        where: { id: body.equipoId },
      });
      if (!equipoExists) return [null, "El equipo especificado no existe"];
    }

    // Verificar duplicados si se cambia equipoId, fecha u hora
    if (body.equipoId || body.fecha || body.hora) {
      const newEquipoId = body.equipoId || horaFound.equipoId;
      const newFecha = body.fecha || horaFound.fecha;
      const newHora = body.hora || horaFound.hora;

      const existingHora = await horaRepository.findOne({
        where: {
          equipoId: newEquipoId,
          fecha: newFecha,
          hora: newHora,
        },
      });

      if (existingHora && existingHora.id !== horaFound.id) {
        return [null, "Ya existe una hora registrada para este equipo en esta fecha y hora"];
      }
    }

    const dataHoraUpdate = {
      equipoId: body.equipoId,
      hora: body.hora,
      fecha: body.fecha,
      disponible: body.disponible,
      updatedAt: new Date(),
    };

    // Remover propiedades undefined
    Object.keys(dataHoraUpdate).forEach(key => {
      if (dataHoraUpdate[key] === undefined) {
        delete dataHoraUpdate[key];
      }
    });

    await horaRepository.update({ id: horaFound.id }, dataHoraUpdate);

    const horaUpdated = await horaRepository.findOne({
      where: { id: horaFound.id },
      relations: ["equipo"],
    });

    return [horaUpdated, null];
  } catch (error) {
    console.error("Error al actualizar la hora disponible:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteHoraDisponibleService(query) {
  try {
    const { id, equipoId, fecha, disponible } = query;

    const horaRepository = AppDataSource.getRepository(HoraDisponible);

    const whereConditions = {};
    if (id) whereConditions.id = id;
    if (equipoId) whereConditions.equipoId = equipoId;
    if (fecha) whereConditions.fecha = fecha;
    if (disponible !== undefined) whereConditions.disponible = disponible;

    const horaFound = await horaRepository.findOne({
      where: whereConditions,
    });

    if (!horaFound) return [null, "Hora disponible no encontrada"];

    const horaDeleted = await horaRepository.remove(horaFound);

    return [horaDeleted, null];
  } catch (error) {
    console.error("Error al eliminar la hora disponible:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function marcarHoraNoDisponibleService(equipoId, fecha, hora) {
  try {
    const horaRepository = AppDataSource.getRepository(HoraDisponible);

    const horaFound = await horaRepository.findOne({
      where: {
        equipoId,
        fecha,
        hora,
      },
    });

    if (!horaFound) return [null, "Hora no encontrada"];

    await horaRepository.update(
      { id: horaFound.id },
      { disponible: false, updatedAt: new Date() }
    );

    const horaUpdated = await horaRepository.findOne({
      where: { id: horaFound.id },
      relations: ["equipo"],
    });

    return [horaUpdated, null];
  } catch (error) {
    console.error("Error al marcar hora como no disponible:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createMultipleHorasServiceBulk(params) {
  try {
    const { equipos, fechaInicio, fechaFin, horaInicio, horaFin, diasSemana, duracion } = params;
    
    const horaRepository = AppDataSource.getRepository(HoraDisponible);
    const equipoRepository = AppDataSource.getRepository(Equipo);

    // Verificar que todos los equipos existen
    const equiposValidos = await equipoRepository.findByIds(equipos);
    if (equiposValidos.length !== equipos.length) {
      return [null, "Uno o más equipos especificados no existen"];
    }

    const horasCreadas = [];
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    // Mapeo de días de la semana
    const diasSemanaMap = {
      "domingo": 0,
      "lunes": 1,
      "martes": 2,
      "miercoles": 3,
      "jueves": 4,
      "viernes": 5,
      "sabado": 6
    };

    // Función para generar horarios entre hora inicio y fin
    const generarHorarios = (horaInicio, horaFin, duracion) => {
      const horarios = [];
      const [horaInicioHour, horaInicioMin] = horaInicio.split(":").map(Number);
      const [horaFinHour, horaFinMin] = horaFin.split(":").map(Number);
      
      let currentHour = horaInicioHour;
      let currentMin = horaInicioMin;
      
      while (currentHour < horaFinHour || (currentHour === horaFinHour && currentMin < horaFinMin)) {
        const horaStr = `${currentHour.toString().padStart(2, "0")}:${currentMin.toString().padStart(2, "0")}`;
        horarios.push(horaStr);
        
        currentMin += duracion;
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60);
          currentMin = currentMin % 60;
        }
      }
      
      return horarios;
    };

    const horarios = generarHorarios(horaInicio, horaFin, duracion);

    // Iterar por cada fecha en el rango
    for (let fecha = new Date(fechaInicioDate); fecha <= fechaFinDate; fecha.setDate(fecha.getDate() + 1)) {
      const diaSemana = fecha.getDay();
      const nombreDia = Object.keys(diasSemanaMap).find(key => diasSemanaMap[key] === diaSemana);
      
      // Solo procesar si el día está en los días seleccionados
      if (diasSemana.includes(nombreDia)) {
        const fechaStr = fecha.toISOString().split("T")[0];
        
        // Iterar por cada equipo
        for (const equipoId of equipos) {
          // Iterar por cada horario
          for (const hora of horarios) {
            // Verificar que no exista una hora duplicada
            const existingHora = await horaRepository.findOne({
              where: {
                equipoId: parseInt(equipoId),
                fecha: fechaStr,
                hora: hora,
              },
            });

            if (!existingHora) {
              const newHora = horaRepository.create({
                equipoId: parseInt(equipoId),
                hora: hora,
                fecha: fechaStr,
                disponible: true,
              });

              const horaCreated = await horaRepository.save(newHora);
              horasCreadas.push(horaCreated);
            }
          }
        }
      }
    }

    return [horasCreadas, null];
  } catch (error) {
    console.error("Error al crear múltiples horas disponibles:", error);
    return [null, "Error interno del servidor"];
  }
}
