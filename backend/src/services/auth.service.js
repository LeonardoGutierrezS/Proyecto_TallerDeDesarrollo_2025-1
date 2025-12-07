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
      relations: ["tipoUsuario", "carrera", "cargo"],
    });

    console.log("Usuario encontrado:", userFound ? "Sí" : "No");
    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    // Verificar si el usuario está vigente (aprobado)
    if (!userFound.Vigente) {
      return [null, createErrorMessage("email", "Tu cuenta está pendiente de aprobación por el administrador")];
    }

    const isMatch = await comparePassword(password, userFound.Contrasenia);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      rut: userFound.Rut,
      nombreCompleto: userFound.Nombre_Completo,
      email: userFound.Correo,
      tipoUsuario: userFound.tipoUsuario?.Descripcion || "Alumno",
      cargo: userFound.cargo?.Desc_Cargo || null,
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

    const { nombreCompleto, rut, email, carreraId } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });
    
    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    const existingRutUser = await userRepository.findOne({
      where: {
        rut,
      },
    });

    if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    // Obtener tipo de usuario Alumno (usuarios registrados desde el frontend son alumnos)
    const tipoAlumno = await TipoUsuarioSchema.findOne({ where: { Descripcion: "Alumno" } });
    
    if (!tipoAlumno) {
      return [null, "Error: Tipo de usuario Alumno no encontrado en el sistema"];
    }

    // Verificar que la carrera exista
    const carrera = await CarreraSchema.findOne({ where: { ID_Carrera: carreraId } });
    
    if (!carrera) {
      return [null, createErrorMessage("carrera", "La carrera seleccionada no existe")];
    }

    const newUser = userRepository.create({
      Rut: rut,
      Nombre_Completo: nombreCompleto,
      Correo: email,
      Contrasenia: await encryptPassword(user.password),
      Vigente: false, // Los alumnos registrados quedan inactivos hasta ser aprobados
      Cod_TipoUsuario: tipoAlumno.Cod_TipoUsuario,
      ID_Carrera: carrera.ID_Carrera,
    });

    await userRepository.save(newUser);

    const { Contrasenia, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}
