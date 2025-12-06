"use strict";
import Motivo from "../entity/motivo.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createMotivoService(body) {
  try {
    const motivoRepository = AppDataSource.getRepository(Motivo);

    const existingMotivo = await motivoRepository.findOne({
      where: { Motivo: body.Motivo },
    });

    if (existingMotivo) {
      return [null, "El motivo ya existe"];
    }

    const newMotivo = motivoRepository.create({
      Motivo: body.Motivo,
    });

    const motivoSaved = await motivoRepository.save(newMotivo);

    return [motivoSaved, null];
  } catch (error) {
    console.error("Error al crear el motivo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getMotivoService(id) {
  try {
    const motivoRepository = AppDataSource.getRepository(Motivo);

    const motivoFound = await motivoRepository.findOne({
      where: { ID_Motivo: id },
    });

    if (!motivoFound) return [null, "Motivo no encontrado"];

    return [motivoFound, null];
  } catch (error) {
    console.error("Error al obtener el motivo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getMotivosService() {
  try {
    const motivoRepository = AppDataSource.getRepository(Motivo);

    const motivos = await motivoRepository.find();

    if (!motivos || motivos.length === 0) return [null, "No hay motivos"];

    return [motivos, null];
  } catch (error) {
    console.error("Error al obtener los motivos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateMotivoService(id, body) {
  try {
    const motivoRepository = AppDataSource.getRepository(Motivo);

    const motivoFound = await motivoRepository.findOne({
      where: { ID_Motivo: id },
    });

    if (!motivoFound) return [null, "Motivo no encontrado"];

    const existingMotivo = await motivoRepository.findOne({
      where: { Motivo: body.Motivo },
    });

    if (existingMotivo && existingMotivo.ID_Motivo !== id) {
      return [null, "Ya existe otro motivo con el mismo nombre"];
    }

    await motivoRepository.update(
      { ID_Motivo: id },
      { Motivo: body.Motivo },
    );

    const motivoUpdated = await motivoRepository.findOne({
      where: { ID_Motivo: id },
    });

    return [motivoUpdated, null];
  } catch (error) {
    console.error("Error al actualizar el motivo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteMotivoService(id) {
  try {
    const motivoRepository = AppDataSource.getRepository(Motivo);

    const motivoFound = await motivoRepository.findOne({
      where: { ID_Motivo: id },
    });

    if (!motivoFound) return [null, "Motivo no encontrado"];

    const motivoDeleted = await motivoRepository.remove(motivoFound);

    return [motivoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el motivo:", error);
    return [null, "Error interno del servidor"];
  }
}
