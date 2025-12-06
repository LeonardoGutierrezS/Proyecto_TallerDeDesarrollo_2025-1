"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getUserService(query) {
  try {
    const { rut, id, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ ID_Usuario: id }, { Rut: rut }, { Correo: email }],
      relations: ["rol", "carrera"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { Contrasenia, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find({
      relations: ["rol", "carrera"],
    });

    if (!users || users.length === 0) return [null, "No hay usuarios"];

    const usersData = users.map(({ Contrasenia, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService(query, body) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);
    const RolSchema = (await import("../entity/rol.entity.js")).default;
    const CarreraSchema = (await import("../entity/carrera.entity.js")).default;
    const rolRepository = AppDataSource.getRepository(RolSchema);
    const carreraRepository = AppDataSource.getRepository(CarreraSchema);

    const userFound = await userRepository.findOne({
      where: [{ ID_Usuario: id }, { Rut: rut }, { Correo: email }],
      relations: ["rol", "carrera"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const existingUser = await userRepository.findOne({
      where: [{ Rut: body.rut }, { Correo: body.email }],
    });

    if (existingUser && existingUser.ID_Usuario !== userFound.ID_Usuario) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    if (body.password) {
      const matchPassword = await comparePassword(
        body.password,
        userFound.Contrasenia,
      );

      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    // Actualizar campos básicos
    if (body.nombreCompleto) userFound.Nombre_Completo = body.nombreCompleto;
    if (body.rut) userFound.Rut = body.rut;
    if (body.email) userFound.Correo = body.email;
    if (body.vigente !== undefined) userFound.Vigente = body.vigente;

    // Actualizar rol si se proporciona
    if (body.rolId) {
      const rol = await rolRepository.findOne({ where: { ID_Rol: body.rolId } });
      if (!rol) return [null, "Rol no encontrado"];
      userFound.rol = rol;
    }

    // Actualizar carrera si se proporciona (0 = Ninguna)
    if (body.carreraId !== undefined) {
      if (body.carreraId === 0) {
        userFound.carrera = null;
      } else {
        const carrera = await carreraRepository.findOne({ where: { ID_Carrera: body.carreraId } });
        if (!carrera) return [null, "Carrera no encontrada"];
        userFound.carrera = carrera;
      }
    }

    // Actualizar contraseña si se proporciona una nueva
    if (body.newPassword && body.newPassword.trim() !== "") {
      userFound.Contrasenia = await encryptPassword(body.newPassword);
    }

    // Guardar los cambios
    const savedUser = await userRepository.save(userFound);

    // Recargar el usuario con las relaciones
    const userData = await userRepository.findOne({
      where: { ID_Usuario: savedUser.ID_Usuario },
      relations: ["rol", "carrera"],
    });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    const { Contrasenia, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUserService(query) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ ID_Usuario: id }, { Rut: rut }, { Correo: email }],
      relations: ["rol", "carrera"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol && userFound.rol.Rol === "Administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { Contrasenia, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getPendingUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find({
      where: { Vigente: false },
      relations: ["rol", "carrera"],
    });

    if (!users || users.length === 0) return [[], null];

    const usersData = users.map(({ Contrasenia, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener usuarios pendientes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function approveUserService(id) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { ID_Usuario: parseInt(id) },
      relations: ["rol", "carrera"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.Vigente) return [null, "El usuario ya está aprobado"];

    await userRepository.update({ ID_Usuario: parseInt(id) }, { Vigente: true });

    const userUpdated = await userRepository.findOne({
      where: { ID_Usuario: parseInt(id) },
      relations: ["rol", "carrera"],
    });

    const { Contrasenia, ...userData } = userUpdated;

    return [userData, null];
  } catch (error) {
    console.error("Error al aprobar usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function rejectUserService(id) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { ID_Usuario: parseInt(id) },
      relations: ["rol", "carrera"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.Vigente) return [null, "No se puede rechazar un usuario ya aprobado"];

    if (userFound.rol && userFound.rol.Rol === "Administrador") {
      return [null, "No se puede rechazar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { Contrasenia, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al rechazar usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserStatusService(id, vigente) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { ID_Usuario: parseInt(id) },
      relations: ["rol", "carrera"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol && userFound.rol.Rol === "Administrador") {
      return [null, "No se puede cambiar el estado de un administrador"];
    }

    await userRepository.update(
      { ID_Usuario: parseInt(id) },
      { Vigente: vigente }
    );

    const userUpdated = await userRepository.findOne({
      where: { ID_Usuario: parseInt(id) },
      relations: ["rol", "carrera"],
    });

    const { Contrasenia, ...userData } = userUpdated;

    return [userData, null];
  } catch (error) {
    console.error("Error al actualizar estado de usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createUserByAdminService(data) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findOne({
      where: [{ Rut: data.rut }, { Correo: data.correo }],
    });

    if (existingUser) {
      return [null, "Ya existe un usuario con el mismo RUT o correo"];
    }

    // Encriptar contraseña
    const hashedPassword = await encryptPassword(data.password);

    // Crear nuevo usuario
    const newUser = userRepository.create({
      Nombre_Completo: data.nombreCompleto,
      Rut: data.rut,
      Correo: data.correo,
      Contrasenia: hashedPassword,
      Vigente: true, // Usuarios creados por admin se aprueban automáticamente
      rol: { ID_Rol: data.rolId },
      carrera: data.carreraId ? { ID_Carrera: data.carreraId } : null,
    });

    await userRepository.save(newUser);

    const userCreated = await userRepository.findOne({
      where: { ID_Usuario: newUser.ID_Usuario },
      relations: ["rol", "carrera"],
    });

    const { Contrasenia, ...userData } = userCreated;

    return [userData, null];
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return [null, "Error interno del servidor"];
  }
}