"use strict";
import { sendEmail } from "./email.service.js";

/**
 * Servicio especializado para notificaciones de préstamos/solicitudes
 */

export async function sendSolicitudCreatedNotification(userEmail, userName, solicitudData) {
    try {
        const subject = "Solicitud de Préstamo Registrada - SIREC";
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; padding: 20px; background-color: #2563eb; color: white;">
                    <h2>✅ Solicitud Registrada Exitosamente</h2>
                    <p>Tu solicitud ha sido recibida y está siendo procesada</p>
                </div>
                
                <div style="padding: 20px;">
                    <p>Hola <strong>${userName}</strong>,</p>
                    <p>Tu solicitud de préstamo ha sido registrada correctamente en nuestro sistema.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1e40af; margin-top: 0;">📋 Detalles de tu Solicitud</h3>
                        
                        <p><strong>Número de Solicitud:</strong> #${solicitudData.id}</p>
                        <p><strong>Equipo:</strong> ${solicitudData.equipo?.marca?.nombre || "N/A"} ${solicitudData.equipo?.modelo || "N/A"}</p>
                        <p><strong>Categoría:</strong> ${solicitudData.categoria?.nombre || "N/A"}</p>
                        <p><strong>Fecha Inicio:</strong> ${new Date(solicitudData.fechaInicioPrestamo).toLocaleDateString("es-ES")}</p>
                        <p><strong>Fecha Fin:</strong> ${new Date(solicitudData.fechaFinPrestamo).toLocaleDateString("es-ES")}</p>
                        <p><strong>Horario:</strong> ${solicitudData.horaInicioPrestamo} - ${solicitudData.horaFinPrestamo}</p>
                        <p><strong>Estado:</strong> ${solicitudData.estadoPrestamo?.nombre || "Pendiente"}</p>
                    </div>

                    <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="color: #1e40af; margin-top: 0;">📌 Próximos Pasos</h4>
                        <ul>
                            <li>Tu solicitud está siendo revisada por nuestro equipo</li>
                            <li>Recibirás una notificación cuando cambie el estado</li>
                            <li>Puedes consultar el estado en "Mis Solicitudes"</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/mis-solicitudes" 
                           style="background-color: #2563eb; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 6px; display: inline-block;">
                            Ver Mis Solicitudes
                        </a>
                    </div>

                    <div style="text-align: center; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
                        <p style="color: #6b7280; font-size: 14px; margin: 0;">
                            Sistema SIREC - Universidad del Bío-Bío<br>
                            Este es un mensaje automático, no responder.
                        </p>
                    </div>
                </div>
            </div>
        `;

        const text = `
Hola ${userName},

Tu solicitud de préstamo ha sido registrada exitosamente.

DETALLES:
- Número: #${solicitudData.id}
- Equipo: ${solicitudData.equipo?.marca?.nombre || "N/A"} ${solicitudData.equipo?.modelo || "N/A"}
- Categoría: ${solicitudData.categoria?.nombre || "N/A"}
- Período: ${new Date(solicitudData.fechaInicioPrestamo).toLocaleDateString("es-ES")} - ${new Date(solicitudData.fechaFinPrestamo).toLocaleDateString("es-ES")}
- Horario: ${solicitudData.horaInicioPrestamo} - ${solicitudData.horaFinPrestamo}
- Estado: ${solicitudData.estadoPrestamo?.nombre || "Pendiente"}

Tu solicitud está siendo revisada. Recibirás actualizaciones por correo.

Sistema SIREC - Universidad del Bío-Bío
        `;

        return await sendEmail(userEmail, subject, text, html);
    } catch (error) {
        console.error("Error enviando notificación de solicitud creada:", error);
        throw error;
    }
}

export async function sendSolicitudStatusUpdateNotification(userEmail, userName, solicitudData, estadoAnterior) {
    try {
        const estadoActual = solicitudData.estadoPrestamo?.nombre || "Desconocido";
        const subject = `Actualización de Solicitud #${solicitudData.id} - SIREC`;
        
        let estadoColor = "#6b7280";
        let iconoEstado = "📄";
        let mensajePersonalizado = "";

        switch (estadoActual.toLowerCase()) {
            case "aprobado":
            case "aprobada":
                estadoColor = "#059669";
                iconoEstado = "✅";
                mensajePersonalizado = "¡Excelente! Tu solicitud ha sido aprobada.";
                break;
            case "rechazado":
            case "rechazada":
                estadoColor = "#dc2626";
                iconoEstado = "❌";
                mensajePersonalizado = "Tu solicitud ha sido rechazada.";
                break;
            case "entregado":
            case "entregada":
                estadoColor = "#2563eb";
                iconoEstado = "📦";
                mensajePersonalizado = "El equipo ha sido entregado exitosamente.";
                break;
            case "devuelto":
            case "devuelta":
                estadoColor = "#7c3aed";
                iconoEstado = "🔄";
                mensajePersonalizado = "Préstamo completado. ¡Gracias!";
                break;
            default:
                mensajePersonalizado = `Estado actualizado a: ${estadoActual}`;
        }

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; padding: 20px; background-color: ${estadoColor}; color: white;">
                    <h2>${iconoEstado} Actualización de Solicitud</h2>
                    <p>Solicitud #${solicitudData.id}</p>
                </div>
                
                <div style="padding: 20px;">
                    <p>Hola <strong>${userName}</strong>,</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <h3 style="color: ${estadoColor}; margin: 0;">Estado: ${estadoActual}</h3>
                        <p>${mensajePersonalizado}</p>
                        ${solicitudData.motivoRechazo ? `
                            <div style="background-color: #fee2e2; padding: 15px; margin-top: 15px; border-radius: 6px;">
                                <strong>Motivo del rechazo:</strong><br>
                                ${solicitudData.motivoRechazo}
                            </div>
                        ` : ""}
                    </div>

                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1e40af; margin-top: 0;">📋 Resumen</h3>
                        <p><strong>Equipo:</strong> ${solicitudData.equipo?.marca?.nombre || "N/A"} ${solicitudData.equipo?.modelo || "N/A"}</p>
                        <p><strong>Período:</strong> ${new Date(solicitudData.fechaInicioPrestamo).toLocaleDateString("es-ES")} - ${new Date(solicitudData.fechaFinPrestamo).toLocaleDateString("es-ES")}</p>
                        <p><strong>Horario:</strong> ${solicitudData.horaInicioPrestamo} - ${solicitudData.horaFinPrestamo}</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/mis-solicitudes" 
                           style="background-color: ${estadoColor}; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 6px; display: inline-block;">
                            Ver Detalles Completos
                        </a>
                    </div>

                    <div style="text-align: center; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
                        <p style="color: #6b7280; font-size: 14px; margin: 0;">
                            Sistema SIREC - Universidad del Bío-Bío<br>
                            Este es un mensaje automático, no responder.
                        </p>
                    </div>
                </div>
            </div>
        `;

        const text = `
Hola ${userName},

El estado de tu solicitud #${solicitudData.id} ha sido actualizado.

ESTADO ANTERIOR: ${estadoAnterior || "N/A"}
ESTADO ACTUAL: ${estadoActual}

${mensajePersonalizado}

${solicitudData.motivoRechazo ? `MOTIVO: ${solicitudData.motivoRechazo}` : ""}

RESUMEN:
- Equipo: ${solicitudData.equipo?.marca?.nombre || "N/A"} ${solicitudData.equipo?.modelo || "N/A"}
- Período: ${new Date(solicitudData.fechaInicioPrestamo).toLocaleDateString("es-ES")} - ${new Date(solicitudData.fechaFinPrestamo).toLocaleDateString("es-ES")}
- Horario: ${solicitudData.horaInicioPrestamo} - ${solicitudData.horaFinPrestamo}

Sistema SIREC - Universidad del Bío-Bío
        `;

        return await sendEmail(userEmail, subject, text, html);
    } catch (error) {
        console.error("Error enviando notificación de actualización de estado:", error);
        throw error;
    }
}
