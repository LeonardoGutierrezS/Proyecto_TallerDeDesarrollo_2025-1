import nodemailer from "nodemailer";
import { emailConfig } from "../config/configEnv.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const transporter = nodemailer.createTransport({
    service: emailConfig.service,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
    },
});

export const sendEmail = async (to, subject, text, html, attachments = []) => {
    try {
        const mailOptions = {
            from: `"Sistema de Reserva de Equipos Computacionales FACE UBB" <${emailConfig.user}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
            attachments: attachments,
        };
        await transporter.sendMail(mailOptions);

        return mailOptions;
    } catch (error) {
        console.error("Error enviando el correo: %s", error.message);
        throw new Error("Error enviando el correo: " + error.message);
    }
};

/**
 * =======================================================================
 * HELPERS DE DISEÑO Y NOTIFICACIONES
 * =======================================================================
 */

/**
 * Genera el HTML unificado para los correos del sistema
 */
function getUnifiedEmailTemplate({ title, greeting, intro, details, actions, color = "#003b7a", logoCid = "sirec-logo-blanco" }) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, ${color} 0%, #002855 100%); padding: 30px 20px; text-align: center; color: white; }
        .logo-container { margin-bottom: 15px; }
        .logo-container img { max-height: 80px; width: auto; }
        .header-title { margin: 0; font-size: 24px; font-weight: bold; }
        .content { padding: 35px 25px; background-color: #ffffff; }
        .details-box { background-color: #f8f9fa; border-left: 4px solid ${color}; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .detail-item { margin: 8px 0; font-size: 14px; }
        .detail-label { font-weight: bold; color: #555; }
        .action-container { text-align: center; margin: 30px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: ${color}; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; }
        .footer { background-color: #003b7a; color: white; text-align: center; padding: 25px 20px; font-size: 12px; }
        .footer-logo { margin-top: 15px; }
        .footer-logo img { max-height: 45px; width: auto; }
        .specs-list { margin-top: 10px; padding-left: 20px; font-size: 13px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-container">
            <img src="cid:${logoCid}" alt="SIREC" />
          </div>
          <h1 class="header-title">${title}</h1>
        </div>
        <div class="content">
          <p>Estimado/a <strong>${greeting}</strong>,</p>
          <p>${intro}</p>
          
          <div class="details-box">
            ${details}
          </div>
          
          ${actions ? `<div class="action-container">${actions}</div>` : ""}
          
          <p style="font-size: 13px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
            Este es un correo automático generado por SIREC, por favor no respondas a este mensaje.
          </p>
        </div>
        <div class="footer">
          <p><strong>Sistema de Reserva de Equipos Computacionales (SIREC)</strong><br>
          Facultad de Ciencias Empresariales<br>
          Universidad del Bío-Bío</p>
          <div class="footer-logo">
            <img src="cid:face-logo" alt="FACE UBB" />
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Formatea la información del equipo para el correo
 */
function formatEquipoDetails(equipo) {
  if (!equipo) return "<p>Información de equipo no disponible</p>";
  
  let specsHtml = "";
  if (equipo.especificaciones && equipo.especificaciones.length > 0) {
    specsHtml = '<ul class="specs-list">';
    equipo.especificaciones.forEach(spec => {
      specsHtml += `<li><strong>${spec.Tipo_Especificacion_HW}:</strong> ${spec.Descripcion}</li>`;
    });
    specsHtml += '</ul>';
  }

  return `
    <div class="detail-item"><span class="detail-label">N° de Inventario:</span> ${equipo.ID_Num_Inv}</div>
    <div class="detail-item"><span class="detail-label">Categoría:</span> ${equipo.categoria?.Nombre_Categoria || "No especificada"}</div>
    <div class="detail-item"><span class="detail-label">Modelo:</span> ${equipo.Modelo}</div>
    <div class="detail-item"><span class="detail-label">Marca:</span> ${equipo.marca?.Nombre_Marca || "No especificada"}</div>
    ${specsHtml}
  `;
}

/**
 * Adjuntos comunes (logos)
 */
const getCommonAttachments = async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  // Nota: Buscamos los logos en la carpeta public del backend (un nivel arriba de src)
  const logoPath = path.join(__dirname, '../../public/images');
  
  return [
    {
      filename: 'sirec-logo-blanco.png',
      path: path.join(logoPath, 'sirec-logo-blanco.png'),
      cid: 'sirec-logo-blanco'
    },
    {
      filename: 'face-logo.png',
      path: path.join(logoPath, 'face-logo.png'),
      cid: 'face-logo'
    }
  ];
};

/**
 * =======================================================================
 * NOTIFICACIONES DE SOLICITUDES DE PRÉSTAMO
 * =======================================================================
 */

/**
 * Enviar correo de solicitud creada
 */
export async function enviarEmailSolicitudCreada(solicitud) {
  try {
    const attachments = await getCommonAttachments();
    const equipmentInfo = formatEquipoDetails(solicitud.equipo);
    
    const tipoSolicitud = solicitud.Fecha_inicio_sol && solicitud.Fecha_termino_sol ? "Largo Plazo" : "Diaria";
    const fechasText = tipoSolicitud === "Largo Plazo" 
      ? `del ${new Date(solicitud.Fecha_inicio_sol).toLocaleDateString('es-CL')} al ${new Date(solicitud.Fecha_termino_sol).toLocaleDateString('es-CL')}`
      : `para el día ${new Date(solicitud.Fecha_Sol).toLocaleDateString('es-CL')}`;

    const html = getUnifiedEmailTemplate({
      title: "Solicitud Recibida",
      greeting: `${solicitud.usuario.Nombre_Completo}`,
      intro: `Tu solicitud de préstamo ha sido registrada exitosamente. A continuación, los detalles del equipo solicitado:`,
      details: `
        <h3 style="color: #003b7a; margin-top: 0;">Información del Equipo</h3>
        ${equipmentInfo}
        <h3 style="color: #003b7a; margin-bottom: 5px;">Detalles de la Solicitud</h3>
        <div class="detail-item"><span class="detail-label">ID Solicitud:</span> ${solicitud.ID_Solicitud}</div>
        <div class="detail-item"><span class="detail-label">Tipo:</span> ${tipoSolicitud}</div>
        <div class="detail-item"><span class="detail-label">Período:</span> ${fechasText}</div>
        <div class="detail-item"><span class="detail-label">Motivo:</span> ${solicitud.Motivo_Sol || 'No especificado'}</div>
      `,
      actions: `<p>Recibirás una notificación cuando tu solicitud sea procesada.</p>`,
      color: "#003b7a"
    });

    await transporter.sendMail({
      from: `"SIREC UBB" <${emailConfig.user}>`,
      to: solicitud.usuario.Correo,
      subject: "✅ Solicitud de Préstamo Recibida - SIREC UBB",
      html: html,
      attachments: attachments
    });

    console.log(`✉️ Email de solicitud creada enviado a: ${solicitud.usuario.Correo}`);
  } catch (error) {
    console.error("Error al enviar email de solicitud creada:", error);
  }
}

/**
 * Enviar correo de solicitud aprobada
 */
export async function enviarEmailSolicitudAprobada(solicitud, prestamo) {
  try {
    const attachments = await getCommonAttachments();
    const equipmentInfo = formatEquipoDetails(solicitud.equipo);

    const html = getUnifiedEmailTemplate({
      title: "Solicitud Aprobada",
      greeting: `${solicitud.usuario.Nombre_Completo}`,
      intro: `¡Buenas noticias! Tu solicitud de préstamo ha sido <strong>aprobada</strong>.`,
      details: `
        <h3 style="color: #28a745; margin-top: 0;">Equipo Autorizado</h3>
        ${equipmentInfo}
        <h3 style="color: #28a745; margin-bottom: 5px;">Información del Préstamo</h3>
        <div class="detail-item"><span class="detail-label">ID Préstamo:</span> ${prestamo.ID_Prestamo}</div>
        <div class="detail-item"><span class="detail-label">Fecha Límite:</span> ${new Date(prestamo.Fecha_fin_prestamo).toLocaleDateString('es-CL')}</div>
      `,
      actions: `
        <p>El equipo estará disponible para su retiro. Por favor, acércate a la unidad correspondiente.</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/mis-solicitudes" class="button" style="background-color: #28a745;">Ver mis solicitudes</a>
      `,
      color: "#28a745"
    });

    await transporter.sendMail({
      from: `"SIREC UBB" <${emailConfig.user}>`,
      to: solicitud.usuario.Correo,
      subject: "✅ Solicitud Aprobada - SIREC UBB",
      html: html,
      attachments: attachments
    });

    console.log(`✉️ Email de solicitud aprobada enviado a: ${solicitud.usuario.Correo}`);
  } catch (error) {
    console.error("Error al enviar email de solicitud aprobada:", error);
  }
}

/**
 * Enviar correo de equipo entregado
 */
export async function enviarEmailEquipoEntregado(solicitud, prestamo) {
  try {
    const attachments = await getCommonAttachments();
    const equipmentInfo = formatEquipoDetails(solicitud.equipo);

    const html = getUnifiedEmailTemplate({
      title: "Equipo Entregado",
      greeting: `${solicitud.usuario.Nombre_Completo}`,
      intro: `Se ha registrado la entrega del equipo bajo tu responsabilidad.`,
      details: `
        <h3 style="color: #003b7a; margin-top: 0;">Equipo en Préstamo</h3>
        ${equipmentInfo}
        <h3 style="color: #003b7a; margin-bottom: 5px;">Compromiso de Devolución</h3>
        <div class="detail-item"><span class="detail-label">Fecha de Devolución:</span> <strong>${new Date(prestamo.Fecha_fin_prestamo).toLocaleDateString('es-CL')}</strong></div>
      `,
      actions: `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; color: #856404; font-size: 13px; text-align: left;">
          <strong>Recordatorio:</strong>
          <ul>
            <li>Eres responsable del cuidado y buen uso del equipo.</li>
            <li>Cualquier avería debe ser informada inmediatamente.</li>
            <li>El retraso en la devolución puede generar sanciones.</li>
          </ul>
        </div>
      `,
      color: "#003b7a"
    });

    await transporter.sendMail({
      from: `"SIREC UBB" <${emailConfig.user}>`,
      to: solicitud.usuario.Correo,
      subject: "📦 Equipo Entregado - SIREC UBB",
      html: html,
      attachments: attachments
    });

    console.log(`✉️ Email de equipo entregado enviado a: ${solicitud.usuario.Correo}`);
  } catch (error) {
    console.error("Error al enviar email de equipo entregado:", error);
  }
}

/**
 * Enviar correo de equipo devuelto
 */
export async function enviarEmailEquipoDevuelto(solicitud, devolucion) {
  try {
    const attachments = await getCommonAttachments();
    const equipmentInfo = formatEquipoDetails(solicitud.equipo);

    const html = getUnifiedEmailTemplate({
      title: "Devolución Exitosa",
      greeting: `${solicitud.usuario.Nombre_Completo}`,
      intro: `Se ha registrado correctamente la devolución del equipo. El préstamo ha finalizado.`,
      details: `
        <h3 style="color: #28a745; margin-top: 0;">Equipo Devuelto</h3>
        ${equipmentInfo}
        <h3 style="color: #28a745; margin-bottom: 5px;">Detalles de Recepción</h3>
        <div class="detail-item"><span class="detail-label">Fecha de Devolución:</span> ${new Date(devolucion.Fecha_devolucion).toLocaleString('es-CL')}</div>
        <div class="detail-item"><span class="detail-label">Estado:</span> ${devolucion.Estado_equipo || "Recibido Conforme"}</div>
        ${devolucion.Observaciones ? `<div class="detail-item"><span class="detail-label">Observaciones:</span> ${devolucion.Observaciones}</div>` : ""}
      `,
      actions: `<p style="color: #28a745; font-weight: bold;">¡Gracias por utilizar el sistema y cuidar el equipo!</p>`,
      color: "#28a745"
    });

    await transporter.sendMail({
      from: `"SIREC UBB" <${emailConfig.user}>`,
      to: solicitud.usuario.Correo,
      subject: "✅ Devolución de Equipo Registrada - SIREC UBB",
      html: html,
      attachments: attachments
    });

    console.log(`✉️ Email de equipo devuelto enviado a: ${solicitud.usuario.Correo}`);
  } catch (error) {
    console.error("Error al enviar email de equipo devuelto:", error);
  }
}

/**
 * Enviar correo de solicitud rechazada
 */
export async function enviarEmailSolicitudRechazada(solicitud, observaciones) {
  try {
    const attachments = await getCommonAttachments();
    const equipmentInfo = formatEquipoDetails(solicitud.equipo);

    const html = getUnifiedEmailTemplate({
      title: "Solicitud Rechazada",
      greeting: `${solicitud.usuario.Nombre_Completo}`,
      intro: `Lamentamos informarte que tu solicitud de préstamo no ha sido autorizada en esta ocasión.`,
      details: `
        <h3 style="color: #dc3545; margin-top: 0;">Información de la Solicitud</h3>
        ${equipmentInfo}
        <div style="background-color: #ffebee; border-left: 4px solid #dc3545; padding: 15px; margin-top: 15px;">
          <p style="margin: 0; color: #c62828;"><strong>Motivo del Rechazo:</strong></p>
          <p style="margin: 5px 0 0 0;">${observaciones || "No especificado"}</p>
        </div>
      `,
      actions: `<p>Si tienes dudas, puedes consultar con la administración de equipos.</p>`,
      color: "#dc3545"
    });

    await transporter.sendMail({
      from: `"SIREC UBB" <${emailConfig.user}>`,
      to: solicitud.usuario.Correo,
      subject: "❌ Solicitud Rechazada - SIREC UBB",
      html: html,
      attachments: attachments
    });

    console.log(`✉️ Email de solicitud rechazada enviado a: ${solicitud.usuario.Correo}`);
  } catch (error) {
    console.error("Error al enviar email de solicitud rechazada:", error);
  }
}
