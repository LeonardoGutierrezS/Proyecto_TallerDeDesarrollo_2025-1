// Script de prueba para verificar el funcionamiento de las notificaciones por email
import { sendSolicitudCreatedNotification, sendSolicitudStatusUpdateNotification } from "./src/services/prestamo-notifications.service.js";

// Datos de prueba para una solicitud
const solicitudDataPrueba = {
    id: 123,
    equipo: {
        marca: { nombre: "HP" },
        modelo: "EliteBook 840 G8",
        numeroDeSerie: "HP002234"
    },
    categoria: { nombre: "Notebooks" },
    fechaInicioPrestamo: new Date("2025-08-05"),
    fechaFinPrestamo: new Date("2025-08-07"),
    horaInicioPrestamo: "09:00",
    horaFinPrestamo: "17:00",
    estadoPrestamo: { nombre: "Pendiente" }
};

async function probarNotificaciones() {
    try {
        console.log("🧪 Iniciando prueba de notificaciones...");
        
        // Cambiar este email por el tuyo para probar
        const emailPrueba = "leonardo@gmail.cl"; // Cambia por tu email
        const nombreUsuario = "Leonardo Gutiérrez";
        
        console.log("📧 Enviando notificación de solicitud creada...");
        const resultadoCreacion = await sendSolicitudCreatedNotification(
            emailPrueba,
            nombreUsuario,
            solicitudDataPrueba
        );
        console.log("✅ Notificación de creación enviada:", resultadoCreacion);
        
        // Esperar 2 segundos
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simular cambio de estado a aprobado
        const solicitudAprobada = {
            ...solicitudDataPrueba,
            estadoPrestamo: { nombre: "Aprobado" }
        };
        
        console.log("📧 Enviando notificación de estado actualizado...");
        const resultadoActualizacion = await sendSolicitudStatusUpdateNotification(
            emailPrueba,
            nombreUsuario,
            solicitudAprobada,
            "Pendiente"
        );
        console.log("✅ Notificación de actualización enviada:", resultadoActualizacion);
        
        console.log("🎉 ¡Prueba de notificaciones completada exitosamente!");
        
    } catch (error) {
        console.error("❌ Error en la prueba de notificaciones:", error);
    }
}

// Ejecutar la prueba
probarNotificaciones();
