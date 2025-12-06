"use strict";
import { AppDataSource } from "../config/configDb.js";
import ListaNegra from "../entity/lista_negra.entity.js";
import User from "../entity/user.entity.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

/**
 * Middleware para verificar que un usuario no está en lista negra
 */
export async function noEnListaNegra(req, res, next) {
  try {
    const usuarioId = req.params.usuarioId || req.body.ID_Usuario || req.user.id;

    if (!usuarioId) {
      return handleErrorClient(
        res,
        400,
        "ID del usuario es requerido",
      );
    }

    const listaNegraRepository = AppDataSource.getRepository(ListaNegra);

    // Buscar si el usuario tiene lista negra activa
    const listaNegraActiva = await listaNegraRepository
      .createQueryBuilder("ln")
      .where("ln.ID_Usuario = :userId", { userId: usuarioId })
      .andWhere("ln.fecha_termino >= :today", { today: new Date() })
      .getOne();

    if (listaNegraActiva) {
      return handleErrorClient(
        res,
        403,
        "Usuario en lista negra",
        `El usuario está en lista negra hasta ${listaNegraActiva.fecha_termino}`,
      );
    }

    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

/**
 * Middleware para verificar que un usuario está vigente
 */
export async function usuarioVigente(req, res, next) {
  try {
    const usuarioId = req.params.usuarioId || req.body.ID_Usuario;

    if (!usuarioId) {
      return handleErrorClient(
        res,
        400,
        "ID del usuario es requerido",
      );
    }

    const userRepository = AppDataSource.getRepository(User);

    const usuario = await userRepository.findOne({
      where: { ID_Usuario: usuarioId },
    });

    if (!usuario) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado",
      );
    }

    if (!usuario.Vigente) {
      return handleErrorClient(
        res,
        403,
        "Usuario no vigente",
        "El usuario no está habilitado para realizar préstamos.",
      );
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
