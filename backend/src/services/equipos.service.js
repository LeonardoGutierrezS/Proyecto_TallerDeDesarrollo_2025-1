"use strict";
import Equipos from "../entity/equipos.entity.js";
import EspecificacionesHW from "../entity/especificaciones_hw.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createEquipoService(body) {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipos);
    const especificacionesRepository = AppDataSource.getRepository(EspecificacionesHW);

    const existingEquipo = await equipoRepository.findOne({
      where: [
        { ID_Num_Inv: body.ID_Num_Inv },
        { Numero_Serie: body.Numero_Serie },
      ],
    });

    if (existingEquipo) {
      return [null, "El equipo ya existe con ese número de inventario o número de serie"];
    }

    const newEquipo = equipoRepository.create({
      ID_Num_Inv: body.ID_Num_Inv,
      Modelo: body.Modelo,
      Numero_Serie: body.Numero_Serie,
      Comentarios: body.Comentarios || null,
      Disponible: body.Disponible !== undefined ? body.Disponible : true,
      ID_Marca: body.ID_Marca,
      ID_Categoria: body.ID_Categoria,
      ID_Estado: body.ID_Estado,
    });

    const equipoSaved = await equipoRepository.save(newEquipo);

    // Si hay especificaciones (para Notebooks), crearlas
    if (body.especificaciones) {
      const specs = body.especificaciones;
      const especificacionesToCreate = [];

      if (specs.Procesador) {
        especificacionesToCreate.push(
          especificacionesRepository.create({
            ID_Num_Inv: equipoSaved.ID_Num_Inv,
            Tipo_Especificacion_HW: "Procesador",
            Descripcion: specs.Procesador,
          })
        );
      }

      if (specs.RAM) {
        especificacionesToCreate.push(
          especificacionesRepository.create({
            ID_Num_Inv: equipoSaved.ID_Num_Inv,
            Tipo_Especificacion_HW: "RAM",
            Descripcion: specs.RAM,
          })
        );
      }

      if (specs.Almacenamiento) {
        especificacionesToCreate.push(
          especificacionesRepository.create({
            ID_Num_Inv: equipoSaved.ID_Num_Inv,
            Tipo_Especificacion_HW: "Almacenamiento",
            Descripcion: specs.Almacenamiento,
          })
        );
      }

      if (especificacionesToCreate.length > 0) {
        await especificacionesRepository.save(especificacionesToCreate);
      }
    }

    const equipoWithRelations = await equipoRepository.findOne({
      where: { ID_Num_Inv: equipoSaved.ID_Num_Inv },
      relations: ["marca", "categoria", "estado", "especificaciones"],
    });

    return [equipoWithRelations, null];
  } catch (error) {
    console.error("Error al crear el equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEquipoService(id) {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const equipoFound = await equipoRepository.findOne({
      where: { ID_Num_Inv: id },
      relations: ["marca", "categoria", "estado", "especificaciones"],
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
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const equipos = await equipoRepository.find({
      relations: ["marca", "categoria", "estado", "especificaciones"],
    });

    return [equipos || [], null];
  } catch (error) {
    console.error("Error al obtener los equipos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEquiposDisponiblesService() {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const equiposDisponibles = await equipoRepository.find({
      where: { Disponible: true },
      relations: ["marca", "categoria", "estado", "especificaciones"],
    });

    if (!equiposDisponibles || equiposDisponibles.length === 0) {
      return [null, "No hay equipos disponibles"];
    }

    return [equiposDisponibles, null];
  } catch (error) {
    console.error("Error al obtener los equipos disponibles:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getEquiposPorCategoriaService(categoriaId) {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const equipos = await equipoRepository.find({
      where: { categoria: { ID_Categoria: categoriaId } },
      relations: ["marca", "categoria", "estado", "especificaciones"],
    });

    if (!equipos || equipos.length === 0) {
      return [null, "No hay equipos en esta categoría"];
    }

    return [equipos, null];
  } catch (error) {
    console.error("Error al obtener los equipos por categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateEquipoService(id, body) {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const equipoFound = await equipoRepository.findOne({
      where: { ID_Num_Inv: id },
    });

    if (!equipoFound) return [null, "Equipo no encontrado"];

    if (body.Numero_Serie && body.Numero_Serie !== equipoFound.Numero_Serie) {
      const existingEquipo = await equipoRepository.findOne({
        where: { Numero_Serie: body.Numero_Serie },
      });

      if (existingEquipo) {
        return [null, "Ya existe un equipo con ese número de serie"];
      }
    }

    const dataEquipoUpdate = {
      Modelo: body.Modelo || equipoFound.Modelo,
      Numero_Serie: body.Numero_Serie || equipoFound.Numero_Serie,
      Comentarios: body.Comentarios !== undefined ? body.Comentarios : equipoFound.Comentarios,
      Disponible: body.Disponible !== undefined ? body.Disponible : equipoFound.Disponible,
    };

    if (body.ID_Marca) {
      dataEquipoUpdate.ID_Marca = body.ID_Marca;
    }
    if (body.ID_Categoria) {
      dataEquipoUpdate.ID_Categoria = body.ID_Categoria;
    }
    if (body.ID_Estado) {
      dataEquipoUpdate.ID_Estado = body.ID_Estado;
    }

    await equipoRepository.save({
      ID_Num_Inv: id,
      ...dataEquipoUpdate,
    });

    // Actualizar especificaciones si vienen en el body
    if (body.especificaciones) {
      const especificacionesRepository = AppDataSource.getRepository(EspecificacionesHW);
      const specs = body.especificaciones;

      // Buscar especificaciones existentes para este equipo
      const existingSpecs = await especificacionesRepository.find({
        where: { ID_Num_Inv: id }
      });

      // Función auxiliar para actualizar o crear una especificación
      const upsertSpec = async (tipo, valor) => {
        if (!valor) return;
        const spec = existingSpecs.find(s => s.Tipo_Especificacion_HW === tipo);
        if (spec) {
          spec.Descripcion = valor;
          await especificacionesRepository.save(spec);
        } else {
          await especificacionesRepository.save(
            especificacionesRepository.create({
              ID_Num_Inv: id,
              Tipo_Especificacion_HW: tipo,
              Descripcion: valor
            })
          );
        }
      };

      await Promise.all([
        upsertSpec("Procesador", specs.Procesador),
        upsertSpec("RAM", specs.RAM),
        upsertSpec("Almacenamiento", specs.Almacenamiento)
      ]);
    }

    const equipoUpdated = await equipoRepository.findOne({
      where: { ID_Num_Inv: id },
      relations: ["marca", "categoria", "estado", "especificaciones"],
    });

    return [equipoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteEquipoService(id) {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const equipoFound = await equipoRepository.findOne({
      where: { ID_Num_Inv: id },
      relations: ["marca", "categoria", "estado", "especificaciones"],
    });

    if (!equipoFound) return [null, "Equipo no encontrado"];

    const equipoDeleted = await equipoRepository.remove(equipoFound);

    return [equipoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el equipo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function cambiarDisponibilidadEquipoService(id, disponible) {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipos);

    const equipoFound = await equipoRepository.findOne({
      where: { ID_Num_Inv: id },
    });

    if (!equipoFound) return [null, "Equipo no encontrado"];

    await equipoRepository.update(
      { ID_Num_Inv: id },
      { Disponible: disponible },
    );

    const equipoUpdated = await equipoRepository.findOne({
      where: { ID_Num_Inv: id },
      relations: ["marca", "categoria", "estado", "especificaciones"],
    });

    return [equipoUpdated, null];
  } catch (error) {
    console.error("Error al cambiar disponibilidad del equipo:", error);
    return [null, "Error interno del servidor"];
  }
}
