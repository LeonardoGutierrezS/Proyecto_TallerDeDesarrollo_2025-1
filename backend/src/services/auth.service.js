"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    console.log("Buscando usuario con email:", email);
    const userFound = await userRepository.findOne({
      where: { Correo: email },
      relations: ["tipoUsuario", "carrera", "poseesCargos", "poseesCargos.cargo"],
    });

    console.log("Usuario encontrado:", userFound ? "Sí" : "No");
    if (!userFound) {
      return [null, createErrorMessage("email", "Usuario y/o contraseña incorrectos")];
    }

    // Verificar si el usuario está vigente (aprobado y activo)
    if (!userFound.Vigente) {
      return [null, createErrorMessage("email", "Usuario inactivo. Contáctese con el administrador del sistema")];
    }

    const isMatch = await comparePassword(password, userFound.Contrasenia);

    if (!isMatch) {
      return [null, createErrorMessage("password", "Usuario y/o contraseña incorrectos")];
    }

    // Obtener cargo activo (sin fecha fin)
    const cargoActivo = userFound.poseesCargos?.find(pc => !pc.Fecha_Fin);
    const esDirectorEscuela = cargoActivo?.cargo?.ID_Cargo === 1;
    const descripcionCargo = cargoActivo?.Descripcion_Cargo || cargoActivo?.cargo?.Desc_Cargo || null;

    const payload = {
      rut: userFound.Rut,
      nombreCompleto: userFound.Nombre_Completo,
      email: userFound.Correo,
      tipoUsuario: userFound.tipoUsuario?.Descripcion || "Alumno",
      cargo: descripcionCargo,
      esDirectorEscuela: esDirectorEscuela,
      carrera: userFound.carrera?.Carrera || "",
      vigente: userFound.Vigente,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const TipoUsuarioSchema = AppDataSource.getRepository("TipoUsuario");
    const CarreraSchema = AppDataSource.getRepository("Carrera");
    const CargoSchema = AppDataSource.getRepository("Cargo");

    const { nombreCompleto, rut, email, tipoUsuario, carreraId, cargo } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        Correo: email,
      },
    });
    
    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    const existingRutUser = await userRepository.findOne({
      where: {
        Rut: rut,
      },
    });

    if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    // Obtener tipo de usuario según lo indicado
    const tipoUsuarioObj = await TipoUsuarioSchema.findOne({ where: { Descripcion: tipoUsuario } });
    
    if (!tipoUsuarioObj) {
      return [null, "Error: Tipo de usuario no encontrado en el sistema"];
    }

    const userData = {
      Rut: rut,
      Nombre_Completo: nombreCompleto,
      Correo: email,
      Contrasenia: await encryptPassword(user.password),
      Vigente: false, // Los usuarios registrados quedan inactivos hasta ser aprobados
      Cod_TipoUsuario: tipoUsuarioObj.Cod_TipoUsuario,
    };

    // Si es alumno, verificar y asignar carrera
    if (tipoUsuario === 'Alumno') {
      const carrera = await CarreraSchema.findOne({ where: { ID_Carrera: carreraId } });
      
      if (!carrera) {
        return [null, createErrorMessage("carreraId", "La carrera seleccionada no existe")];
      }
      
      userData.ID_Carrera = carrera.ID_Carrera;
    }

    const newUser = userRepository.create(userData);
    await userRepository.save(newUser);

    // Si es profesor, crear el cargo asociado
    if (tipoUsuario === 'Profesor' && cargo) {
      const newCargo = CargoSchema.create({
        Rut: rut,
        Desc_Cargo: cargo,
      });
      await CargoSchema.save(newCargo);
      
      // Actualizar el usuario con el ID del cargo
      newUser.ID_Cargo = newCargo.ID_Cargo;
      await userRepository.save(newUser);
    }

    const { Contrasenia, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}
