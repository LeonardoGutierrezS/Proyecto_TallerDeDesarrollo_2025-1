import { AppDataSource } from "./src/config/configDb.js";
import { User } from "./src/entity/user.entity.js";
import { EstadoPrestamo } from "./src/entity/estado-prestamo.entity.js";

async function testDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("=== Conexión a la base de datos exitosa ===\n");

    // Verificar usuarios
    console.log("📋 USUARIOS EN LA BASE DE DATOS:");
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nombreCompleto} - ${user.email} (${user.rut})`);
    });

    // Verificar estados de préstamo
    console.log("\n🔄 ESTADOS DE PRÉSTAMO:");
    const estadoPrestamoRepository = AppDataSource.getRepository(EstadoPrestamo);
    const estados = await estadoPrestamoRepository.find();
    
    if (estados.length > 0) {
      estados.forEach((estado, index) => {
        console.log(`${index + 1}. ${estado.nombre}`);
      });
    } else {
      console.log("No se encontraron estados de préstamo en la base de datos");
    }

    console.log("\n✅ Verificación completada");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
}

testDatabase();
