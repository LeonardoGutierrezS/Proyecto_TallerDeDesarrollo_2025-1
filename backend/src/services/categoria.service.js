"use strict";
import Categoria from "../entity/categoria.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getCategoriaService(query) {
  try {
    const { id, nombre } = query;

    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const categoriaFound = await categoriaRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!categoriaFound) return [null, "Categoría no encontrada"];

    return [categoriaFound, null];
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getCategoriasService() {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const categorias = await categoriaRepository.find({
      order: { nombre: "ASC" },
    });

    if (!categorias || categorias.length === 0) return [null, "No hay categorías"];

    return [categorias, null];
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createCategoriaService(body) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const existingCategoria = await categoriaRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingCategoria) {
      return [null, "Ya existe una categoría con ese nombre"];
    }

    const newCategoria = categoriaRepository.create({
      nombre: body.nombre,
    });

    const categoriaCreated = await categoriaRepository.save(newCategoria);

    return [categoriaCreated, null];
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateCategoriaService(query, body) {
  try {
    const { id, nombre } = query;

    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const categoriaFound = await categoriaRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
    });

    if (!categoriaFound) return [null, "Categoría no encontrada"];

    if (body.nombre) {
      const existingCategoria = await categoriaRepository.findOne({
        where: { nombre: body.nombre },
      });

      if (existingCategoria && existingCategoria.id !== categoriaFound.id) {
        return [null, "Ya existe una categoría con ese nombre"];
      }
    }

    const dataCategoriaUpdate = {
      nombre: body.nombre,
    };

    await categoriaRepository.update({ id: categoriaFound.id }, dataCategoriaUpdate);

    const categoriaUpdated = await categoriaRepository.findOne({
      where: { id: categoriaFound.id },
    });

    return [categoriaUpdated, null];
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteCategoriaService(query) {
  try {
    const { id, nombre } = query;

    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const categoriaFound = await categoriaRepository.findOne({
      where: [{ id: id }, { nombre: nombre }],
      relations: ["equipos", "prestamos"],
    });

    if (!categoriaFound) return [null, "Categoría no encontrada"];

    // Verificar si la categoría tiene equipos o préstamos asociados
    if ((categoriaFound.equipos && categoriaFound.equipos.length > 0)
        || (categoriaFound.prestamos && categoriaFound.prestamos.length > 0)) {
      return [null, "No se puede eliminar la categoría porque tiene equipos o préstamos asociados"];
    }

    const categoriaDeleted = await categoriaRepository.remove(categoriaFound);

    return [categoriaDeleted, null];
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}
