"use strict";
import Rol from "../entity/rol.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createRolService(body) {
  try {
    const rolRepository = AppDataSource.getRepository(Rol);

    const existingRol = await rolRepository.findOne({
      where: { Rol: body.Rol },
    });

    if (existingRol) {
      return [null, "El rol ya existe"];
    }

    const newRol = rolRepository.create({
      Rol: body.Rol,
    });

    const rolSaved = await rolRepository.save(newRol);

    return [rolSaved, null];
  } catch (error) {
    console.error("Error al crear el rol:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getRolService(id) {
  try {
    const rolRepository = AppDataSource.getRepository(Rol);

    const rolFound = await rolRepository.findOne({
      where: { ID_Rol: id },
    });

    if (!rolFound) return [null, "Rol no encontrado"];

    return [rolFound, null];
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getRolesService() {
  try {
    const rolRepository = AppDataSource.getRepository(Rol);

    const roles = await rolRepository.find();

    if (!roles || roles.length === 0) return [null, "No hay roles"];

    return [roles, null];
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateRolService(id, body) {
  try {
    const rolRepository = AppDataSource.getRepository(Rol);

    const rolFound = await rolRepository.findOne({
      where: { ID_Rol: id },
    });

    if (!rolFound) return [null, "Rol no encontrado"];

    const existingRol = await rolRepository.findOne({
      where: { Rol: body.Rol },
    });

    if (existingRol && existingRol.ID_Rol !== id) {
      return [null, "Ya existe otro rol con el mismo nombre"];
    }

    await rolRepository.update({ ID_Rol: id }, { Rol: body.Rol });

    const rolUpdated = await rolRepository.findOne({
      where: { ID_Rol: id },
    });

    return [rolUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteRolService(id) {
  try {
    const rolRepository = AppDataSource.getRepository(Rol);

    const rolFound = await rolRepository.findOne({
      where: { ID_Rol: id },
    });

    if (!rolFound) return [null, "Rol no encontrado"];

    const rolDeleted = await rolRepository.remove(rolFound);

    return [rolDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    return [null, "Error interno del servidor"];
  }
}
