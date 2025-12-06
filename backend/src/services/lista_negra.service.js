"use strict";
import ListaNegra from "../entity/lista_negra.entity.js";
import User from "../entity/user.entity.js";
import Prestamo from "../entity/prestamo.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createListaNegraService(body) {
  try {
    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);
    const userRepository = AppDataSource.getRepository(User);
    const prestamoRepository = AppDataSource.getRepository(Prestamo);

    // Verificar que el usuario existe
    const userFound = await userRepository.findOne({
      where: { ID_Usuario: body.ID_Usuario },
    });

    if (!userFound) {
      return [null, "El usuario no existe"];
    }

    // Verificar que el préstamo existe
    const prestamoFound = await prestamoRepository.findOne({
      where: { ID_Prestamo: body.ID_Prestamo },
    });

    if (!prestamoFound) {
      return [null, "El préstamo no existe"];
    }

    // Verificar que el usuario no esté ya en lista negra activa
    const listaNegraActiva = await listaNegraRepository
      .createQueryBuilder("ln")
      .where("ln.ID_Usuario = :userId", { userId: body.ID_Usuario })
      .andWhere("ln.fecha_termino >= :today", { today: new Date() })
      .getOne();

    if (listaNegraActiva) {
      return [null, "El usuario ya está en lista negra"];
    }

    const newListaNegra = listaNegraRepository.create({
      fecha_inicio: body.fecha_inicio || new Date(),
      fecha_termino: body.fecha_termino,
      usuario: { ID_Usuario: body.ID_Usuario },
      prestamo: { ID_Prestamo: body.ID_Prestamo },
      motivo: { ID_Motivo: body.ID_Motivo },
    });

    const listaNegraGuardada = await listaNegraRepository.save(newListaNegra);

    // Marcar usuario como no vigente
    await userRepository.update(
      { ID_Usuario: body.ID_Usuario },
      { Vigente: false },
    );

    const listaNegraWithRelations = await listaNegraRepository.findOne({
      where: { ID_Lista_Negra: listaNegraGuardada.ID_Lista_Negra },
      relations: ["usuario", "usuario.rol", "usuario.carrera", "prestamo", "motivo"],
    });

    return [listaNegraWithRelations, null];
  } catch (error) {
    console.error("Error al crear el registro de lista negra:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getListaNegraService(id) {
  try {
    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);

    const listaNegraFound = await listaNegraRepository.findOne({
      where: { ID_Lista_Negra: id },
      relations: ["usuario", "usuario.rol", "usuario.carrera", "prestamo", "motivo"],
    });

    if (!listaNegraFound) return [null, "Registro de lista negra no encontrado"];

    return [listaNegraFound, null];
  } catch (error) {
    console.error("Error al obtener el registro de lista negra:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getListaNegrasService() {
  try {
    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);

    const listasNegras = await listaNegraRepository.find({
      relations: ["usuario", "usuario.rol", "usuario.carrera", "prestamo", "motivo"],
      order: { fecha_inicio: "DESC" },
    });

    if (!listasNegras || listasNegras.length === 0) {
      return [null, "No hay registros en lista negra"];
    }

    return [listasNegras, null];
  } catch (error) {
    console.error("Error al obtener los registros de lista negra:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getListaNegrasActivasService() {
  try {
    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);

    const listasNegrasActivas = await listaNegraRepository
      .createQueryBuilder("ln")
      .leftJoinAndSelect("ln.usuario", "usuario")
      .leftJoinAndSelect("usuario.rol", "rol")
      .leftJoinAndSelect("usuario.carrera", "carrera")
      .leftJoinAndSelect("ln.prestamo", "prestamo")
      .leftJoinAndSelect("ln.motivo", "motivo")
      .where("ln.fecha_termino >= :today", { today: new Date() })
      .orderBy("ln.fecha_inicio", "DESC")
      .getMany();

    if (!listasNegrasActivas || listasNegrasActivas.length === 0) {
      return [null, "No hay usuarios en lista negra activa"];
    }

    return [listasNegrasActivas, null];
  } catch (error) {
    console.error("Error al obtener las listas negras activas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getListaNegraPorUsuarioService(usuarioId) {
  try {
    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);

    const listasNegras = await listaNegraRepository.find({
      where: { usuario: { ID_Usuario: usuarioId } },
      relations: ["usuario", "usuario.rol", "usuario.carrera", "prestamo", "motivo"],
      order: { fecha_inicio: "DESC" },
    });

    if (!listasNegras || listasNegras.length === 0) {
      return [null, "El usuario no tiene registros en lista negra"];
    }

    return [listasNegras, null];
  } catch (error) {
    console.error("Error al obtener la lista negra por usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function verificarUsuarioEnListaNegraService(usuarioId) {
  try {
    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);

    const listaNegraActiva = await listaNegraRepository
      .createQueryBuilder("ln")
      .where("ln.ID_Usuario = :userId", { userId: usuarioId })
      .andWhere("ln.fecha_termino >= :today", { today: new Date() })
      .getOne();

    if (listaNegraActiva) {
      return [{ enListaNegra: true, detalle: listaNegraActiva }, null];
    }

    return [{ enListaNegra: false, detalle: null }, null];
  } catch (error) {
    console.error("Error al verificar usuario en lista negra:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateListaNegraService(id, body) {
  try {
    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);

    const listaNegraFound = await listaNegraRepository.findOne({
      where: { ID_Lista_Negra: id },
    });

    if (!listaNegraFound) return [null, "Registro de lista negra no encontrado"];

    const dataListaNegraUpdate = {
      fecha_inicio: body.fecha_inicio || listaNegraFound.fecha_inicio,
      fecha_termino: body.fecha_termino || listaNegraFound.fecha_termino,
    };

    if (body.ID_Motivo) {
      dataListaNegraUpdate.motivo = { ID_Motivo: body.ID_Motivo };
    }

    await listaNegraRepository.save({
      ID_Lista_Negra: id,
      ...dataListaNegraUpdate,
    });

    const listaNegraUpdated = await listaNegraRepository.findOne({
      where: { ID_Lista_Negra: id },
      relations: ["usuario", "usuario.rol", "usuario.carrera", "prestamo", "motivo"],
    });

    return [listaNegraUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el registro de lista negra:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function levantarListaNegraService(id) {
  try {
    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);
    const userRepository = AppDataSource.getRepository(User);

    const listaNegraFound = await listaNegraRepository.findOne({
      where: { ID_Lista_Negra: id },
      relations: ["usuario"],
    });

    if (!listaNegraFound) return [null, "Registro de lista negra no encontrado"];

    // Establecer fecha de término como hoy
    await listaNegraRepository.update(
      { ID_Lista_Negra: id },
      { fecha_termino: new Date() },
    );

    // Verificar si el usuario tiene otras listas negras activas
    const otrasListasActivas = await listaNegraRepository
      .createQueryBuilder("ln")
      .where("ln.ID_Usuario = :userId", { userId: listaNegraFound.usuario.ID_Usuario })
      .andWhere("ln.ID_Lista_Negra != :listId", { listId: id })
      .andWhere("ln.fecha_termino >= :today", { today: new Date() })
      .getOne();

    // Si no tiene otras listas negras activas, marcar usuario como vigente
    if (!otrasListasActivas) {
      await userRepository.update(
        { ID_Usuario: listaNegraFound.usuario.ID_Usuario },
        { Vigente: true },
      );
    }

    const listaNegraUpdated = await listaNegraRepository.findOne({
      where: { ID_Lista_Negra: id },
      relations: ["usuario", "usuario.rol", "usuario.carrera", "prestamo", "motivo"],
    });

    return [listaNegraUpdated, null];
  } catch (error) {
    console.error("Error al levantar lista negra:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteListaNegraService(id) {
  try {
    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);
    const userRepository = AppDataSource.getRepository(User);

    const listaNegraFound = await listaNegraRepository.findOne({
      where: { ID_Lista_Negra: id },
      relations: ["usuario", "prestamo", "motivo"],
    });

    if (!listaNegraFound) return [null, "Registro de lista negra no encontrado"];

    const usuarioId = listaNegraFound.usuario.ID_Usuario;

    const listaNegraDeleted = await listaNegraRepository.remove(listaNegraFound);

    // Verificar si el usuario tiene otras listas negras activas
    const otrasListasActivas = await listaNegraRepository
      .createQueryBuilder("ln")
      .where("ln.ID_Usuario = :userId", { userId: usuarioId })
      .andWhere("ln.fecha_termino >= :today", { today: new Date() })
      .getOne();

    // Si no tiene otras listas negras activas, marcar usuario como vigente
    if (!otrasListasActivas) {
      await userRepository.update(
        { ID_Usuario: usuarioId },
        { Vigente: true },
      );
    }

    return [listaNegraDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el registro de lista negra:", error);
    return [null, "Error interno del servidor"];
  }
}
