"use strict";
import Equipo from "../entity/equipo.entity.js";
import Marca from "../entity/marca.entity.js";
import Categoria from "../entity/categoria.entity.js";
import EstadoAltaBaja from "../entity/estado-alta-baja.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getEquipoService(query) {
  try {
    const { id, marcaId, modelo, numeroDeSerie, categoriaId, estadoAltaBajaId } = query;

    const equipoRepository = AppDataSource.getRepository(Equipo);

    const whereConditions = [];
    if (id) whereConditions.push({ id });
    if (marcaId) whereConditions.push({ marcaId });
    if (modelo) whereConditions.push({ modelo });
    if (numeroDeSerie) whereConditions.push({ numeroDeSerie });
    if (categoriaId) whereConditions.push({ categoriaId });
    if (estadoAltaBajaId) whereConditions.push({ estadoAltaBajaId });

    const equipoFound = await equipoRepository.findOne({
      where: whereConditions,
      relations: ["marca", "categoria", "estadoAltaBaja", "horasDisponibles"],
    });

    if (!equipoFound) return [null, "Equipo no encontrado"];

    return [equipoFound, null];
  } catch (error) {
    console.error("Error al obtener el equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEquiposService() {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipo);

    const equipos = await equipoRepository.find({
      relations: ["marca", "categoria", "estadoAltaBaja"],
      order: { modelo: "ASC" },
    });

    if (!equipos || equipos.length === 0) return [null, "No hay equipos"];

    return [equipos, null];
  } catch (error) {
    console.error("Error al obtener los equipos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createEquipoService(body) {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipo);
    const marcaRepository = AppDataSource.getRepository(Marca);
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const estadoRepository = AppDataSource.getRepository(EstadoAltaBaja);

    // Verificar que existan las entidades relacionadas
    const marcaExists = await marcaRepository.findOne({
      where: { id: body.marcaId },
    });
    if (!marcaExists) return [null, "La marca especificada no existe"];

    const categoriaExists = await categoriaRepository.findOne({
      where: { id: body.categoriaId },
    });
    if (!categoriaExists) return [null, "La categoría especificada no existe"];

    const estadoExists = await estadoRepository.findOne({
      where: { id: body.estadoAltaBajaId },
    });
    if (!estadoExists) return [null, "El estado especificado no existe"];

    // Verificar que el número de serie sea único
    const existingEquipo = await equipoRepository.findOne({
      where: { numeroDeSerie: body.numeroDeSerie },
    });
    if (existingEquipo) {
      return [null, "Ya existe un equipo con ese número de serie"];
    }

    const newEquipo = equipoRepository.create({
      marcaId: body.marcaId,
      modelo: body.modelo,
      numeroDeSerie: body.numeroDeSerie,
      categoriaId: body.categoriaId,
      estadoAltaBajaId: body.estadoAltaBajaId,
      fechaAltaLab: body.fechaAltaLab,
      fechaBajaLab: body.fechaBajaLab || null,
    });

    const equipoCreated = await equipoRepository.save(newEquipo);

    // Obtener el equipo con sus relaciones
    const equipoWithRelations = await equipoRepository.findOne({
      where: { id: equipoCreated.id },
      relations: ["marca", "categoria", "estadoAltaBaja"],
    });

    return [equipoWithRelations, null];
  } catch (error) {
    console.error("Error al crear el equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateEquipoService(query, body) {
  try {
    const { id, marcaId, modelo, numeroDeSerie, categoriaId, estadoAltaBajaId } = query;

    const equipoRepository = AppDataSource.getRepository(Equipo);
    const marcaRepository = AppDataSource.getRepository(Marca);
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const estadoRepository = AppDataSource.getRepository(EstadoAltaBaja);

    const whereConditions = [];
    if (id) whereConditions.push({ id });
    if (marcaId) whereConditions.push({ marcaId });
    if (modelo) whereConditions.push({ modelo });
    if (numeroDeSerie) whereConditions.push({ numeroDeSerie });
    if (categoriaId) whereConditions.push({ categoriaId });
    if (estadoAltaBajaId) whereConditions.push({ estadoAltaBajaId });

    const equipoFound = await equipoRepository.findOne({
      where: whereConditions,
    });

    if (!equipoFound) return [null, "Equipo no encontrado"];

    // Verificar entidades relacionadas si se proporcionan
    if (body.marcaId) {
      const marcaExists = await marcaRepository.findOne({
        where: { id: body.marcaId },
      });
      if (!marcaExists) return [null, "La marca especificada no existe"];
    }

    if (body.categoriaId) {
      const categoriaExists = await categoriaRepository.findOne({
        where: { id: body.categoriaId },
      });
      if (!categoriaExists) return [null, "La categoría especificada no existe"];
    }

    if (body.estadoAltaBajaId) {
      const estadoExists = await estadoRepository.findOne({
        where: { id: body.estadoAltaBajaId },
      });
      if (!estadoExists) return [null, "El estado especificado no existe"];
    }

    // Verificar número de serie único si se proporciona
    if (body.numeroDeSerie) {
      const existingEquipo = await equipoRepository.findOne({
        where: { numeroDeSerie: body.numeroDeSerie },
      });
      if (existingEquipo && existingEquipo.id !== equipoFound.id) {
        return [null, "Ya existe un equipo con ese número de serie"];
      }
    }

    const dataEquipoUpdate = {
      marcaId: body.marcaId,
      modelo: body.modelo,
      numeroDeSerie: body.numeroDeSerie,
      categoriaId: body.categoriaId,
      estadoAltaBajaId: body.estadoAltaBajaId,
      fechaAltaLab: body.fechaAltaLab,
      fechaBajaLab: body.fechaBajaLab,
    };

    // Remover propiedades undefined
    Object.keys(dataEquipoUpdate).forEach(key => {
      if (dataEquipoUpdate[key] === undefined) {
        delete dataEquipoUpdate[key];
      }
    });

    await equipoRepository.update({ id: equipoFound.id }, dataEquipoUpdate);

    const equipoUpdated = await equipoRepository.findOne({
      where: { id: equipoFound.id },
      relations: ["marca", "categoria", "estadoAltaBaja"],
    });

    return [equipoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteEquipoService(query) {
  try {
    const { id, marcaId, modelo, numeroDeSerie, categoriaId, estadoAltaBajaId } = query;

    const equipoRepository = AppDataSource.getRepository(Equipo);

    const whereConditions = [];
    if (id) whereConditions.push({ id });
    if (marcaId) whereConditions.push({ marcaId });
    if (modelo) whereConditions.push({ modelo });
    if (numeroDeSerie) whereConditions.push({ numeroDeSerie });
    if (categoriaId) whereConditions.push({ categoriaId });
    if (estadoAltaBajaId) whereConditions.push({ estadoAltaBajaId });

    const equipoFound = await equipoRepository.findOne({
      where: whereConditions,
      relations: ["horasDisponibles", "prestamos"],
    });

    if (!equipoFound) return [null, "Equipo no encontrado"];

    // Verificar si el equipo tiene horas disponibles o préstamos asociados
    if ((equipoFound.horasDisponibles && equipoFound.horasDisponibles.length > 0)
        || (equipoFound.prestamos && equipoFound.prestamos.length > 0)) {
      return [null, "No se puede eliminar el equipo porque tiene horas disponibles o préstamos asociados"];
    }

    const equipoDeleted = await equipoRepository.remove(equipoFound);

    return [equipoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEquiposByMarcaService(marcaId) {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipo);

    const equipos = await equipoRepository.find({
      where: { marcaId },
      relations: ["marca", "categoria", "estadoAltaBaja"],
      order: { modelo: "ASC" },
    });

    if (!equipos || equipos.length === 0) {
      return [null, "No hay equipos para esta marca"];
    }

    return [equipos, null];
  } catch (error) {
    console.error("Error al obtener equipos por marca:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEquiposByCategoriaService(categoriaId) {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipo);

    const equipos = await equipoRepository.find({
      where: { categoriaId },
      relations: ["marca", "categoria", "estadoAltaBaja"],
      order: { modelo: "ASC" },
    });

    if (!equipos || equipos.length === 0) {
      return [null, "No hay equipos para esta categoría"];
    }

    return [equipos, null];
  } catch (error) {
    console.error("Error al obtener equipos por categoría:", error);
    return [null, "Error interno del servidor"];
  }
}
