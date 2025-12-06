"use strict";
import User from "../entity/user.entity.js";
import RolSchema from "../entity/rol.entity.js";
import CarreraSchema from "../entity/carrera.entity.js";
import MarcaSchema from "../entity/marca.entity.js";
import CategoriaSchema from "../entity/categoria.entity.js";
import EstadoSchema from "../entity/estado.entity.js";
import EquiposSchema from "../entity/equipos.entity.js";
import EstadoPrestamoSchema from "../entity/estado_prestamo.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

/**
 * Crea los roles iniciales del sistema
 */
async function createRoles() {
  try {
    const rolRepository = AppDataSource.getRepository(RolSchema);

    const count = await rolRepository.count();
    if (count > 0) return;

    await Promise.all([
      rolRepository.save(
        rolRepository.create({
          Rol: "Administrador",
        }),
      ),
      rolRepository.save(
        rolRepository.create({
          Rol: "Alumno",
        }),
      ),
      rolRepository.save(
        rolRepository.create({
          Rol: "Profesor",
        }),
      ),
      rolRepository.save(
        rolRepository.create({
          Rol: "Director de Escuela",
        }),
      ),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error("Error al crear roles:", error);
  }
}

/**
 * Crea las carreras iniciales del sistema
 */
async function createCarreras() {
  try {
    const carreraRepository = AppDataSource.getRepository(CarreraSchema);

    const count = await carreraRepository.count();
    if (count > 0) return;

    await Promise.all([
      carreraRepository.save(
        carreraRepository.create({
          Carrera: "Ingeniería Civil en Informática",
        }),
      ),
      carreraRepository.save(
        carreraRepository.create({
          Carrera: "Ingeniería Ejecución en Computación e Informática",
        }),
      ),
    ]);
    console.log("* => Carreras creadas exitosamente");
  } catch (error) {
    console.error("Error al crear carreras:", error);
  }
}

/**
 * Crea los usuarios iniciales del sistema
 */
async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const rolRepository = AppDataSource.getRepository(RolSchema);
    const carreraRepository = AppDataSource.getRepository(CarreraSchema);

    const count = await userRepository.count();
    console.log(`* => Usuarios existentes en la base de datos: ${count}`);
    if (count > 0) return;

    // Obtener roles y carreras
    const adminRol = await rolRepository.findOne({ where: { Rol: "Administrador" } });
    const alumnoRol = await rolRepository.findOne({ where: { Rol: "Alumno" } });
    const profesorRol = await rolRepository.findOne({ where: { Rol: "Profesor" } });
    const directorRol = await rolRepository.findOne({ where: { Rol: "Director de Escuela" } });
    const carreraInformatica = await carreraRepository.findOne({ 
      where: { Carrera: "Ingeniería Civil en Informática" } 
    });
    const carreraEjecucion = await carreraRepository.findOne({ 
      where: { Carrera: "Ingeniería Ejecución en Computación e Informática" } 
    });

    if (!adminRol || !alumnoRol || !profesorRol || !directorRol || !carreraInformatica) {
      console.error("Error: No se encontraron los roles o carreras necesarios");
      return;
    }

    await Promise.all([
      // Administrador
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "Administrador Principal",
          Rut: "21.308.770-3",
          Correo: "administrador@gmail.cl",
          Contrasenia: await encryptPassword("admin1234"),
          Vigente: true,
          rol: adminRol,
          carrera: carreraInformatica,
        }),
      ),
      // Director de Escuela
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "María Elena González Pérez",
          Rut: "15.234.567-8",
          Correo: "director2024@gmail.cl",
          Contrasenia: await encryptPassword("director1234"),
          Vigente: true,
          rol: directorRol,
          carrera: carreraInformatica,
        }),
      ),
      // Profesores
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "Carlos Alberto Fernández López",
          Rut: "16.789.012-3",
          Correo: "profesor1.2024@gmail.cl",
          Contrasenia: await encryptPassword("profesor1234"),
          Vigente: true,
          rol: profesorRol,
          carrera: carreraInformatica,
        }),
      ),
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "Ana María Rodríguez Silva",
          Rut: "17.345.678-9",
          Correo: "profesor2.2024@gmail.cl",
          Contrasenia: await encryptPassword("profesor1234"),
          Vigente: true,
          rol: profesorRol,
          carrera: carreraEjecucion,
        }),
      ),
      // Alumnos
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "Diego Sebastián Ampuero Belmar",
          Rut: "21.151.897-9",
          Correo: "alumno1.2024@gmail.cl",
          Contrasenia: await encryptPassword("alumno1234"),
          Vigente: true,
          rol: alumnoRol,
          carrera: carreraInformatica,
        }),
      ),
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "Alexander Benjamín Marcelo Carrasco Fuentes",
          Rut: "20.630.735-8",
          Correo: "alumno2.2024@gmail.cl",
          Contrasenia: await encryptPassword("alumno1234"),
          Vigente: true,
          rol: alumnoRol,
          carrera: carreraInformatica,
        }),
      ),
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "Pablo Andrés Castillo Fernández",
          Rut: "20.738.450-K",
          Correo: "alumno3.2024@gmail.cl",
          Contrasenia: await encryptPassword("alumno1234"),
          Vigente: true,
          rol: alumnoRol,
          carrera: carreraEjecucion,
        }),
      ),
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "Felipe Andrés Henríquez Zapata",
          Rut: "20.976.635-3",
          Correo: "alumno4.2024@gmail.cl",
          Contrasenia: await encryptPassword("alumno1234"),
          Vigente: true,
          rol: alumnoRol,
          carrera: carreraInformatica,
        }),
      ),
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "Diego Alexis Meza Ortega",
          Rut: "21.172.447-1",
          Correo: "alumno5.2024@gmail.cl",
          Contrasenia: await encryptPassword("alumno1234"),
          Vigente: true,
          rol: alumnoRol,
          carrera: carreraEjecucion,
        }),
      ),
      userRepository.save(
        userRepository.create({
          Nombre_Completo: "Juan Pablo Rosas Martin",
          Rut: "20.738.415-1",
          Correo: "alumno6.2024@gmail.cl",
          Contrasenia: await encryptPassword("alumno1234"),
          Vigente: true,
          rol: alumnoRol,
          carrera: carreraInformatica,
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

/**
 * Crea las marcas iniciales del sistema
 */
async function createMarcas() {
  try {
    const marcaRepository = AppDataSource.getRepository(MarcaSchema);

    const count = await marcaRepository.count();
    if (count > 0) return;

    await Promise.all([
      marcaRepository.save(marcaRepository.create({ Marca: "HP" })),
      marcaRepository.save(marcaRepository.create({ Marca: "Dell" })),
      marcaRepository.save(marcaRepository.create({ Marca: "Lenovo" })),
      marcaRepository.save(marcaRepository.create({ Marca: "Asus" })),
      marcaRepository.save(marcaRepository.create({ Marca: "Acer" })),
      marcaRepository.save(marcaRepository.create({ Marca: "Apple" })),
      marcaRepository.save(marcaRepository.create({ Marca: "Samsung" })),
      marcaRepository.save(marcaRepository.create({ Marca: "Epson" })),
      marcaRepository.save(marcaRepository.create({ Marca: "Canon" })),
      marcaRepository.save(marcaRepository.create({ Marca: "Logitech" })),
    ]);
    console.log("* => Marcas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear marcas:", error);
  }
}

/**
 * Crea las categorías iniciales del sistema
 */
async function createCategorias() {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);

    const count = await categoriaRepository.count();
    if (count > 0) return;

    await Promise.all([
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Notebook" })),
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Desktop" })),
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Tablet" })),
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Proyector" })),
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Impresora" })),
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Monitor" })),
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Teclado" })),
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Mouse" })),
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Cámara Web" })),
      categoriaRepository.save(categoriaRepository.create({ Categoria: "Otro" })),
    ]);
    console.log("* => Categorías creadas exitosamente");
  } catch (error) {
    console.error("Error al crear categorías:", error);
  }
}

/**
 * Crea los estados iniciales del sistema
 */
async function createEstados() {
  try {
    const estadoRepository = AppDataSource.getRepository(EstadoSchema);

    const count = await estadoRepository.count();
    if (count > 0) return;

    await Promise.all([
      estadoRepository.save(estadoRepository.create({ Estado: "Nuevo" })),
      estadoRepository.save(estadoRepository.create({ Estado: "Bueno" })),
      estadoRepository.save(estadoRepository.create({ Estado: "Regular" })),
      estadoRepository.save(estadoRepository.create({ Estado: "Malo" })),
      estadoRepository.save(estadoRepository.create({ Estado: "En Reparación" })),
      estadoRepository.save(estadoRepository.create({ Estado: "Dado de Baja" })),
    ]);
    console.log("* => Estados creados exitosamente");
  } catch (error) {
    console.error("Error al crear estados:", error);
  }
}

/**
 * Crea equipos de prueba
 */
async function createEquipos() {
  try {
    const equipoRepository = AppDataSource.getRepository(EquiposSchema);
    const marcaRepository = AppDataSource.getRepository(MarcaSchema);
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
    const estadoRepository = AppDataSource.getRepository(EstadoSchema);

    const count = await equipoRepository.count();
    console.log(`* => Equipos existentes en la base de datos: ${count}`);
    if (count > 0) return;

    // Obtener marcas, categorías y estados
    const hp = await marcaRepository.findOne({ where: { Marca: "HP" } });
    const dell = await marcaRepository.findOne({ where: { Marca: "Dell" } });
    const lenovo = await marcaRepository.findOne({ where: { Marca: "Lenovo" } });
    const asus = await marcaRepository.findOne({ where: { Marca: "Asus" } });
    const epson = await marcaRepository.findOne({ where: { Marca: "Epson" } });

    const notebook = await categoriaRepository.findOne({ where: { Categoria: "Notebook" } });
    const desktop = await categoriaRepository.findOne({ where: { Categoria: "Desktop" } });
    const proyector = await categoriaRepository.findOne({ where: { Categoria: "Proyector" } });
    const impresora = await categoriaRepository.findOne({ where: { Categoria: "Impresora" } });

    const bueno = await estadoRepository.findOne({ where: { Estado: "Bueno" } });
    const nuevo = await estadoRepository.findOne({ where: { Estado: "Nuevo" } });

    if (!hp || !notebook || !bueno) {
      console.error("Error: No se encontraron las entidades necesarias para crear equipos");
      return;
    }

    await Promise.all([
      equipoRepository.save(
        equipoRepository.create({
          ID_Num_Inv: "NB-2024-001",
          Modelo: "HP Pavilion 15",
          Numero_Serie: "5CD1234ABC",
          Comentarios: "Notebook para préstamo a estudiantes",
          Disponible: true,
          marca: hp,
          categoria: notebook,
          estado: bueno,
        }),
      ),
      equipoRepository.save(
        equipoRepository.create({
          ID_Num_Inv: "NB-2024-002",
          Modelo: "Dell Latitude 5420",
          Numero_Serie: "DELL5420XYZ",
          Comentarios: "Notebook para profesores",
          Disponible: true,
          marca: dell,
          categoria: notebook,
          estado: nuevo,
        }),
      ),
      equipoRepository.save(
        equipoRepository.create({
          ID_Num_Inv: "NB-2024-003",
          Modelo: "Lenovo ThinkPad E14",
          Numero_Serie: "LEN14GEN3",
          Comentarios: null,
          Disponible: false,
          marca: lenovo,
          categoria: notebook,
          estado: bueno,
        }),
      ),
      equipoRepository.save(
        equipoRepository.create({
          ID_Num_Inv: "DT-2024-001",
          Modelo: "Asus Desktop D500",
          Numero_Serie: "ASUS500DT",
          Comentarios: "Desktop para laboratorio",
          Disponible: true,
          marca: asus,
          categoria: desktop,
          estado: bueno,
        }),
      ),
      equipoRepository.save(
        equipoRepository.create({
          ID_Num_Inv: "PY-2024-001",
          Modelo: "Epson PowerLite",
          Numero_Serie: "EPSPWLT2024",
          Comentarios: "Proyector sala 401",
          Disponible: true,
          marca: epson,
          categoria: proyector,
          estado: bueno,
        }),
      ),
      equipoRepository.save(
        equipoRepository.create({
          ID_Num_Inv: "IP-2024-001",
          Modelo: "Epson L3250",
          Numero_Serie: "EPSL3250ABC",
          Comentarios: "Impresora oficina",
          Disponible: true,
          marca: epson,
          categoria: impresora,
          estado: nuevo,
        }),
      ),
    ]);
    console.log("* => Equipos creados exitosamente");
  } catch (error) {
    console.error("Error al crear equipos:", error);
  }
}

/**
 * Crea los estados de préstamo iniciales del sistema
 */
async function createEstadosPrestamo() {
  try {
    const estadoPrestamoRepository = AppDataSource.getRepository(EstadoPrestamoSchema);

    const count = await estadoPrestamoRepository.count();
    console.log(`* => Estados de préstamo existentes en la base de datos: ${count}`);
    if (count > 0) return;

    await Promise.all([
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          Estado_Prestamo: "Pendiente",
        }),
      ),
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          Estado_Prestamo: "Aprobado",
        }),
      ),
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          Estado_Prestamo: "Rechazado",
        }),
      ),
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          Estado_Prestamo: "Entregado",
        }),
      ),
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          Estado_Prestamo: "Devuelto",
        }),
      ),
    ]);
    console.log("* => Estados de préstamo creados exitosamente");
  } catch (error) {
    console.error("Error al crear estados de préstamo:", error);
  }
}

export { createRoles, createCarreras, createUsers, createMarcas, createCategorias, createEstados, createEquipos, createEstadosPrestamo };