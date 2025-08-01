"use strict";
import User from "../entity/user.entity.js";
import Marca from "../entity/marca.entity.js";
import Categoria from "../entity/categoria.entity.js";
import Equipo from "../entity/equipo.entity.js";
import EstadoAltaBaja from "../entity/estado-alta-baja.entity.js";
import EstadoPrestamo from "../entity/estado-prestamo.entity.js";
import TipoDocumento from "../entity/tipo-documento.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21.308.770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
            rut: "20.630.735-8",
            email: "usuario2.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Leonardo Gutiérrez Sánchez",
          rut: "19.876.543-2",
          email: "leonardogutierrez25@gmail.com",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

async function createMarcas() {
  try {
    const marcaRepository = AppDataSource.getRepository(Marca);

    const count = await marcaRepository.count();
    if (count > 0) return;

    await Promise.all([
      marcaRepository.save(
        marcaRepository.create({
          nombre: "HP",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Dell",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Lenovo",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "ASUS",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Acer",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Apple",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Microsoft",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Samsung",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Canon",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Epson",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Brother",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Cisco",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "TP-Link",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Logitech",
        }),
      ),
      marcaRepository.save(
        marcaRepository.create({
          nombre: "Generic",
        }),
      ),
    ]);
    console.log("* => Marcas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear marcas:", error);
  }
}

async function createTiposDocumento() {
  try {
    const tipoDocumentoRepository = AppDataSource.getRepository(TipoDocumento);

    const count = await tipoDocumentoRepository.count();
    if (count > 0) return;

    await Promise.all([
      tipoDocumentoRepository.save(
        tipoDocumentoRepository.create({
          nombre: "Cédula de Identidad",
        }),
      ),
      tipoDocumentoRepository.save(
        tipoDocumentoRepository.create({
          nombre: "Pase Escolar",
        }),
      ),
    ]);
    console.log("* => Tipos de documento creados exitosamente");
  } catch (error) {
    console.error("Error al crear tipos de documento:", error);
  }
}

async function createCategorias() {
  try {
    const categoriaRepository = AppDataSource.getRepository(Categoria);

    const count = await categoriaRepository.count();
    if (count > 0) return;

    await Promise.all([
      categoriaRepository.save(
        categoriaRepository.create({
          nombre: "Notebooks",
        }),
      ),
      categoriaRepository.save(
        categoriaRepository.create({
          nombre: "Monitores",
        }),
      ),
      categoriaRepository.save(
        categoriaRepository.create({
          nombre: "Proyectores",
        }),
      ),
      categoriaRepository.save(
        categoriaRepository.create({
          nombre: "Cámaras",
        }),
      ),
      categoriaRepository.save(
        categoriaRepository.create({
          nombre: "Audio",
        }),
      ),
      categoriaRepository.save(
        categoriaRepository.create({
          nombre: "Equipos de Red",
        }),
      ),
      categoriaRepository.save(
        categoriaRepository.create({
          nombre: "Periféricos",
        }),
      ),
    ]);
    console.log("* => Categorías creadas exitosamente");
  } catch (error) {
    console.error("Error al crear categorías:", error);
  }
}

async function createEstadosAltaBaja() {
  try {
    const estadoRepository = AppDataSource.getRepository(EstadoAltaBaja);

    const count = await estadoRepository.count();
    if (count > 0) return;

    await Promise.all([
      estadoRepository.save(
        estadoRepository.create({
          nombre: "Activo",
        }),
      ),
      estadoRepository.save(
        estadoRepository.create({
          nombre: "Inactivo",
        }),
      ),
      estadoRepository.save(
        estadoRepository.create({
          nombre: "En Mantenimiento",
        }),
      ),
      estadoRepository.save(
        estadoRepository.create({
          nombre: "Dado de Baja",
        }),
      ),
    ]);
    console.log("* => Estados de Alta/Baja creados exitosamente");
  } catch (error) {
    console.error("Error al crear estados de alta/baja:", error);
  }
}

async function createEstadosPrestamo() {
  try {
    const estadoPrestamoRepository = AppDataSource.getRepository(EstadoPrestamo);

    const count = await estadoPrestamoRepository.count();
    if (count > 0) return;

    await Promise.all([
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          nombre: "Pendiente",
        }),
      ),
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          nombre: "Aprobado",
        }),
      ),
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          nombre: "Rechazado",
        }),
      ),
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          nombre: "Entregado",
        }),
      ),
      estadoPrestamoRepository.save(
        estadoPrestamoRepository.create({
          nombre: "Devuelto",
        }),
      ),
    ]);
    console.log("* => Estados de Préstamo creados exitosamente");
  } catch (error) {
    console.error("Error al crear estados de préstamo:", error);
  }
}

async function createEquipos() {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipo);
    const marcaRepository = AppDataSource.getRepository(Marca);
    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const estadoRepository = AppDataSource.getRepository(EstadoAltaBaja);

    const count = await equipoRepository.count();
    if (count > 0) return;

    // Obtener el estado activo
    const estadoActivo = await estadoRepository.findOne({ where: { nombre: "Activo" } });
    if (!estadoActivo) {
      console.error("Estado 'Activo' no encontrado");
      return;
    }

    // Obtener marcas por nombre para asociar correctamente
    const hp = await marcaRepository.findOne({ where: { nombre: "HP" } });
    const dell = await marcaRepository.findOne({ where: { nombre: "Dell" } });
    const lenovo = await marcaRepository.findOne({ where: { nombre: "Lenovo" } });
    const asus = await marcaRepository.findOne({ where: { nombre: "ASUS" } });
    const acer = await marcaRepository.findOne({ where: { nombre: "Acer" } });
    const apple = await marcaRepository.findOne({ where: { nombre: "Apple" } });
    const samsung = await marcaRepository.findOne({ where: { nombre: "Samsung" } });
    const canon = await marcaRepository.findOne({ where: { nombre: "Canon" } });
    const epson = await marcaRepository.findOne({ where: { nombre: "Epson" } });
    const logitech = await marcaRepository.findOne({ where: { nombre: "Logitech" } });
    const cisco = await marcaRepository.findOne({ where: { nombre: "Cisco" } });
    const tpLink = await marcaRepository.findOne({ where: { nombre: "TP-Link" } });

    // Obtener categorías por nombre (solo las necesarias)
    const notebooks = await categoriaRepository.findOne({ where: { nombre: "Notebooks" } });
    const monitores = await categoriaRepository.findOne({ where: { nombre: "Monitores" } });
    const proyectores = await categoriaRepository.findOne({ where: { nombre: "Proyectores" } });
    const camaras = await categoriaRepository.findOne({ where: { nombre: "Cámaras" } });
    const audio = await categoriaRepository.findOne({ where: { nombre: "Audio" } });
    const equiposRed = await categoriaRepository.findOne({ where: { nombre: "Equipos de Red" } });
    const perifericos = await categoriaRepository.findOne({ where: { nombre: "Periféricos" } });

    const equipos = [
      // Notebooks
      {
        marcaId: hp?.id,
        modelo: "EliteBook 840 G8",
        numeroDeSerie: "HP002234",
        categoriaId: notebooks?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-02-01"),
        fechaBajaLab: null,
      },
      {
        marcaId: dell?.id,
        modelo: "Latitude 5520",
        numeroDeSerie: "DL002235",
        categoriaId: notebooks?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-02-02"),
        fechaBajaLab: null,
      },
      {
        marcaId: lenovo?.id,
        modelo: "ThinkPad T14",
        numeroDeSerie: "LN002236",
        categoriaId: notebooks?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-02-03"),
        fechaBajaLab: null,
      },

      // Monitores
      {
        marcaId: hp?.id,
        modelo: "E24 G5",
        numeroDeSerie: "HP004234",
        categoriaId: monitores?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-03-01"),
        fechaBajaLab: null,
      },
      {
        marcaId: dell?.id,
        modelo: "UltraSharp U2422H",
        numeroDeSerie: "DL004235",
        categoriaId: monitores?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-03-02"),
        fechaBajaLab: null,
      },
      {
        marcaId: asus?.id,
        modelo: "ProArt PA248QV",
        numeroDeSerie: "AS004236",
        categoriaId: monitores?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-03-03"),
        fechaBajaLab: null,
      },

      // Proyectores
      {
        marcaId: epson?.id,
        modelo: "PowerLite 2247U",
        numeroDeSerie: "EP005234",
        categoriaId: proyectores?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-03-15"),
        fechaBajaLab: null,
      },
      {
        marcaId: canon?.id,
        modelo: "LX-MU500Z",
        numeroDeSerie: "CN005235",
        categoriaId: proyectores?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-03-16"),
        fechaBajaLab: null,
      },
      {
        marcaId: hp?.id,
        modelo: "Elite Dragonfly Max",
        numeroDeSerie: "HP005236",
        categoriaId: proyectores?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-03-17"),
        fechaBajaLab: null,
      },

      // Cámaras
      {
        marcaId: canon?.id,
        modelo: "EOS R6 Mark II",
        numeroDeSerie: "CN008234",
        categoriaId: camaras?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-05-01"),
        fechaBajaLab: null,
      },
      {
        marcaId: canon?.id,
        modelo: "PowerShot G7X",
        numeroDeSerie: "CN008235",
        categoriaId: camaras?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-05-02"),
        fechaBajaLab: null,
      },
      {
        marcaId: canon?.id,
        modelo: "VIXIA HF G50",
        numeroDeSerie: "CN008236",
        categoriaId: camaras?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-05-03"),
        fechaBajaLab: null,
      },

      // Audio
      {
        marcaId: logitech?.id,
        modelo: "Blue Yeti",
        numeroDeSerie: "LG009234",
        categoriaId: audio?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-05-15"),
        fechaBajaLab: null,
      },
      {
        marcaId: logitech?.id,
        modelo: "Z623 2.1",
        numeroDeSerie: "LG009235",
        categoriaId: audio?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-05-16"),
        fechaBajaLab: null,
      },
      {
        marcaId: logitech?.id,
        modelo: "H390 Headset",
        numeroDeSerie: "LG009236",
        categoriaId: audio?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-05-17"),
        fechaBajaLab: null,
      },

      // Equipos de Red
      {
        marcaId: cisco?.id,
        modelo: "Catalyst 2960-X",
        numeroDeSerie: "CS010234",
        categoriaId: equiposRed?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-06-01"),
        fechaBajaLab: null,
      },
      {
        marcaId: tpLink?.id,
        modelo: "Archer AX73",
        numeroDeSerie: "TP010235",
        categoriaId: equiposRed?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-06-02"),
        fechaBajaLab: null,
      },
      {
        marcaId: cisco?.id,
        modelo: "RV340W",
        numeroDeSerie: "CS010236",
        categoriaId: equiposRed?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-06-03"),
        fechaBajaLab: null,
      },

      // Periféricos
      {
        marcaId: logitech?.id,
        modelo: "MX Master 3S",
        numeroDeSerie: "LG011234",
        categoriaId: perifericos?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-06-15"),
        fechaBajaLab: null,
      },
      {
        marcaId: logitech?.id,
        modelo: "MX Keys",
        numeroDeSerie: "LG011235",
        categoriaId: perifericos?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-06-16"),
        fechaBajaLab: null,
      },
      {
        marcaId: logitech?.id,
        modelo: "C920 HD Pro",
        numeroDeSerie: "LG011236",
        categoriaId: perifericos?.id,
        estadoAltaBajaId: estadoActivo.id,
        fechaAltaLab: new Date("2024-06-17"),
        fechaBajaLab: null,
      },
    ];

    // Filtrar equipos válidos (que tengan marca y categoría)
    const equiposValidos = equipos.filter(equipo => 
      equipo.marcaId && equipo.categoriaId
    );

    if (equiposValidos.length === 0) {
      console.error("No se pudieron crear equipos: faltan marcas o categorías");
      return;
    }

    // Crear equipos
    const equiposCreados = equiposValidos.map(equipoData => 
      equipoRepository.create(equipoData)
    );

    await equipoRepository.save(equiposCreados);

    console.log(`* => ${equiposValidos.length} equipos creados exitosamente`);
  } catch (error) {
    console.error("Error al crear equipos:", error);
  }
}

export { 
  createUsers, 
  createMarcas, 
  createTiposDocumento, 
  createCategorias, 
  createEstadosAltaBaja, 
  createEstadosPrestamo, 
  createEquipos 
};