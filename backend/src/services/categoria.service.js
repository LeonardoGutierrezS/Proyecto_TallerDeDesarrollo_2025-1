"use strict";
import Categoria from "../entity/categoria.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createCategoriaService(body) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const existingCategoria = await categoriaRepository.findOne({
      where: { Descripcion: body.Descripcion },
    });

    if (existingCategoria) {
      return [null, "La categoría ya existe"];
    }

    const newCategoria = categoriaRepository.create({
      Descripcion: body.Descripcion,
    });

    const categoriaSaved = await categoriaRepository.save(newCategoria);

    return [categoriaSaved, null];
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getCategoriaService(id) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const categoriaFound = await categoriaRepository.findOne({
      where: { ID_Categoria: id },
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

    const categorias = await categoriaRepository.find();

    if (!categorias || categorias.length === 0) {
      return [null, "No hay categorías"];
    }

    return [categorias, null];
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateCategoriaService(id, body) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const categoriaFound = await categoriaRepository.findOne({
      where: { ID_Categoria: id },
    });

    if (!categoriaFound) return [null, "Categoría no encontrada"];

    const existingCategoria = await categoriaRepository.findOne({
      where: { Descripcion: body.Descripcion },
    });

    if (existingCategoria && existingCategoria.ID_Categoria !== id) {
      return [null, "Ya existe otra categoría con el mismo nombre"];
    }

    await categoriaRepository.update(
      { ID_Categoria: id },
      { Categoria: body.Categoria },
    );

    const categoriaUpdated = await categoriaRepository.findOne({
      where: { ID_Categoria: id },
    });

    return [categoriaUpdated, null];
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteCategoriaService(id) {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const categoriaFound = await categoriaRepository.findOne({
      where: { ID_Categoria: id },
    });

    if (!categoriaFound) return [null, "Categoría no encontrada"];

    const categoriaDeleted = await categoriaRepository.remove(categoriaFound);

    return [categoriaDeleted, null];
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}
