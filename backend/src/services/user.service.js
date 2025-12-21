"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getUserService(query) {
  try {
    const { rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ Rut: rut }, { Correo: email }],
      relations: ["tipoUsuario", "carrera", "cargo"],
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
      relations: ["tipoUsuario", "carrera", "cargo"],
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
    const { rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);
    const TipoUsuarioSchema = AppDataSource.getRepository("TipoUsuario");
    const CargoSchema = AppDataSource.getRepository("Cargo");
    const CarreraSchema = AppDataSource.getRepository("Carrera");

    const userFound = await userRepository.findOne({
      where: [{ Rut: rut }, { Correo: email }],
      relations: ["tipoUsuario", "carrera", "cargo"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const existingUser = await userRepository.findOne({
      where: [{ Rut: body.rut }, { Correo: body.email }],
    });

    if (existingUser && existingUser.Rut !== userFound.Rut) {
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
    if (body.rut && body.rut !== userFound.Rut) {
      // No se puede cambiar el RUT ya que es PK
      return [null, "No se puede cambiar el RUT del usuario"];
    }
    if (body.email) userFound.Correo = body.email;
    if (body.vigente !== undefined) userFound.Vigente = body.vigente;

    // Actualizar tipo de usuario si se proporciona
    if (body.codTipoUsuario !== undefined) {
      console.log('Actualizando tipo de usuario. Valor recibido:', body.codTipoUsuario);
      console.log('Tipo de usuario actual:', userFound.Cod_TipoUsuario);
      
      const tipoUsuario = await TipoUsuarioSchema.findOne({ where: { Cod_TipoUsuario: body.codTipoUsuario } });
      if (!tipoUsuario) return [null, "Tipo de usuario no encontrado"];
      userFound.Cod_TipoUsuario = tipoUsuario.Cod_TipoUsuario;
      console.log('Tipo de usuario establecido a:', tipoUsuario.Cod_TipoUsuario);
    }

    // Actualizar cargo si se proporciona
    if (body.idCargo !== undefined) {
      if (body.idCargo === null) {
        userFound.ID_Cargo = null;
      } else {
        const cargo = await CargoSchema.findOne({ where: { ID_Cargo: body.idCargo } });
        if (!cargo) return [null, "Cargo no encontrado"];
        userFound.ID_Cargo = cargo.ID_Cargo;
      }
    }

    // Actualizar carrera si se proporciona
    if (body.idCarrera !== undefined) {
      console.log('Actualizando carrera. Valor recibido:', body.idCarrera);
      console.log('Carrera actual del usuario:', userFound.ID_Carrera);
      
      if (body.idCarrera === null) {
        userFound.ID_Carrera = null;
        console.log('Carrera establecida a null');
      } else {
        const carrera = await CarreraSchema.findOne({ where: { ID_Carrera: body.idCarrera } });
        if (!carrera) return [null, "Carrera no encontrada"];
        userFound.ID_Carrera = carrera.ID_Carrera;
        console.log('Carrera establecida a:', carrera.ID_Carrera);
      }
    }

    // Actualizar contraseña si se proporciona una nueva
    if (body.newPassword && body.newPassword.trim() !== "") {
      userFound.Contrasenia = await encryptPassword(body.newPassword);
    }

    // Guardar los cambios
    console.log('Antes de guardar - userFound.ID_Carrera:', userFound.ID_Carrera);
    console.log('Antes de guardar - userFound.Cod_TipoUsuario:', userFound.Cod_TipoUsuario);
    const savedUser = await userRepository.save(userFound);
    console.log('Usuario guardado. ID_Carrera:', savedUser.ID_Carrera);
    console.log('Usuario guardado. Cod_TipoUsuario:', savedUser.Cod_TipoUsuario);

    // Forzar actualización con query directa si es necesario
    if (body.idCarrera === null || body.codTipoUsuario !== undefined) {
      const updates = [];
      const params = [];
      let paramIndex = 1;

      if (body.idCarrera === null) {
        updates.push(`"ID_Carrera" = NULL`);
        console.log('Añadido ID_Carrera = NULL al update');
      }

      if (body.codTipoUsuario !== undefined) {
        updates.push(`"Cod_TipoUsuario" = $${paramIndex}`);
        params.push(body.codTipoUsuario);
        paramIndex++;
        console.log('Añadido Cod_TipoUsuario =', body.codTipoUsuario, 'al update');
      }

      if (updates.length > 0) {
        params.push(savedUser.Rut);
        const query = `UPDATE usuario SET ${updates.join(', ')} WHERE "Rut" = $${paramIndex}`;
        console.log('Ejecutando query:', query, 'con params:', params);
        await AppDataSource.query(query, params);
        console.log('Forzado UPDATE con query directa');
      }
    }

    // Recargar el usuario con las relaciones
    const userData = await userRepository.findOne({
      where: { Rut: savedUser.Rut },
      relations: ["tipoUsuario", "carrera", "cargo"],
    });

    console.log('Usuario recargado. ID_Carrera:', userData.ID_Carrera);
    console.log('Usuario recargado. carrera:', userData.carrera);

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
    const { rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ Rut: rut }, { Correo: email }],
      relations: ["tipoUsuario"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.tipoUsuario && userFound.tipoUsuario.Descripcion === "Administrador") {
      return [null, "No se puede eliminar un usuario con tipo Administrador"];
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

    const pendingUsers = await userRepository.find({
      where: { Vigente: false },
      relations: ["tipoUsuario", "carrera", "cargo"],
    });

    if (!pendingUsers || pendingUsers.length === 0) return [[], null];

    const usersData = pendingUsers.map(({ Contrasenia, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener usuarios pendientes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function approveUserService(rut) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { Rut: rut },
      relations: ["tipoUsuario", "carrera", "cargo"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.Vigente) return [null, "El usuario ya está aprobado"];

    await userRepository.update({ Rut: rut }, { Vigente: true });

    const userUpdated = await userRepository.findOne({
      where: { Rut: rut },
      relations: ["tipoUsuario", "carrera", "cargo"],
    });

    const { Contrasenia, ...userData } = userUpdated;

    return [userData, null];
  } catch (error) {
    console.error("Error al aprobar usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function rejectUserService(rut) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { Rut: rut },
      relations: ["tipoUsuario"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.Vigente) return [null, "No se puede rechazar un usuario ya aprobado"];

    if (userFound.tipoUsuario && userFound.tipoUsuario.Descripcion === "Administrador") {
      return [null, "No se puede rechazar un usuario con tipo Administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { Contrasenia, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al rechazar usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserStatusService(rut, vigente) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { Rut: rut },
      relations: ["tipoUsuario"],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.tipoUsuario && userFound.tipoUsuario.Descripcion === "Administrador") {
      return [null, "No se puede cambiar el estado de un administrador"];
    }

    await userRepository.update(
      { Rut: rut },
      { Vigente: vigente }
    );

    const userUpdated = await userRepository.findOne({
      where: { Rut: rut },
      relations: ["tipoUsuario", "carrera", "cargo"],
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
    const TipoUsuarioSchema = AppDataSource.getRepository("TipoUsuario");
    const CargoSchema = AppDataSource.getRepository("Cargo");
    const CarreraSchema = AppDataSource.getRepository("Carrera");

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findOne({
      where: [{ Rut: data.rut }, { Correo: data.correo }],
    });

    if (existingUser) {
      return [null, "Ya existe un usuario con el mismo RUT o correo"];
    }

    // Validar que el tipo de usuario exista
    const tipoUsuario = await TipoUsuarioSchema.findOne({ 
      where: { Cod_TipoUsuario: data.codTipoUsuario } 
    });
    if (!tipoUsuario) return [null, "Tipo de usuario no encontrado"];

    // Validar que el cargo exista si se proporciona
    if (data.idCargo) {
      const cargo = await CargoSchema.findOne({ where: { ID_Cargo: data.idCargo } });
      if (!cargo) return [null, "Cargo no encontrado"];
    }

    // Validar que la carrera exista si se proporciona
    if (data.idCarrera) {
      const carrera = await CarreraSchema.findOne({ where: { ID_Carrera: data.idCarrera } });
      if (!carrera) return [null, "Carrera no encontrada"];
    }

    // Encriptar contraseña
    const hashedPassword = await encryptPassword(data.password);

    // Crear nuevo usuario
    const newUser = userRepository.create({
      Rut: data.rut,
      Nombre_Completo: data.nombreCompleto,
      Correo: data.correo,
      Contrasenia: hashedPassword,
      Vigente: true, // Usuarios creados por admin se aprueban automáticamente
      Cod_TipoUsuario: data.codTipoUsuario,
      ID_Cargo: data.idCargo || null,
      ID_Carrera: data.idCarrera || null,
    });

    await userRepository.save(newUser);

    const userCreated = await userRepository.findOne({
      where: { Rut: newUser.Rut },
      relations: ["tipoUsuario", "carrera", "cargo"],
    });

    const { Contrasenia, ...userData } = userCreated;

    return [userData, null];
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return [null, "Error interno del servidor"];
  }
}