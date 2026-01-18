import nodemailer from "nodemailer";
import { emailConfig } from "../config/configEnv.js";

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
 * NOTIFICACIONES DE SOLICITUDES DE PRÉSTAMO
 * =======================================================================
 */

/**
 * Enviar correo de solicitud creada
 */
export async function enviarEmailSolicitudCreada(solicitud) {
  try {
    const tipoSolicitud = solicitud.Fecha_inicio_sol && solicitud.Fecha_termino_sol
      ? "Largo Plazo"
      : "Diaria";

    const fechasInfo = tipoSolicitud === "Largo Plazo"
      ? `
        <p><strong>Fecha Inicio:</strong> ${new Date(solicitud.Fecha_inicio_sol).toLocaleDateString('es-CL')}</p>
        <p><strong>Fecha Término:</strong> ${new Date(solicitud.Fecha_termino_sol).toLocaleDateString('es-CL')}</p>
      `
      : `<p><strong>Tipo:</strong> Solicitud para el día</p>`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #003366 0%, #006edf 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0;">SIREC - UBB</h1>
          <p style="margin: 5px 0 0 0;">Sistema de Registro y Control de Equipos</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #003366; margin-top: 0;">Solicitud de Préstamo Registrada</h2>
          
          <p>Estimado/a <strong>${solicitud.usuario.Nombre} ${solicitud.usuario.Apellido}</strong>,</p>
          
          <p>Tu solicitud de préstamo ha sido registrada exitosamente en el sistema.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #006edf; margin-top: 0;">Detalles de la Solicitud</h3>
            <p><strong>ID Solicitud:</strong> ${solicitud.ID_Solicitud}</p>
            <p><strong>Equipo:</strong> ${solicitud.ID_Num_Inv}</p>
            <p><strong>Tipo de Préstamo:</strong> ${tipoSolicitud}</p>
            ${fechasInfo}
            <p><strong>Motivo:</strong> ${solicitud.Motivo_Sol || 'No especificado'}</p>
            <p><strong>Fecha de Solicitud:</strong> ${new Date(solicitud.Fecha_Sol).toLocaleString('es-CL')}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📌 Próximos Pasos:</strong></p>
            <ul style="margin: 10px 0;">
              ${tipoSolicitud === "Largo Plazo" 
                ? "<li>Tu solicitud será revisada por el Director de Escuela</li>"
                : "<li>Tu solicitud será procesada por el administrador</li>"
              }
              <li>Recibirás una notificación cuando haya una actualización</li>
              <li>Puedes revisar el estado de tu solicitud en el sistema</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Este es un correo automático, por favor no responder.
          </p>
        </div>
        
        <div style="background: #003366; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">Universidad del Bío-Bío - Escuela de Ingeniería Civil Informática</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: emailConfig.user,
      to: solicitud.usuario.Correo,
      subject: "✅ Solicitud de Préstamo Recibida - SIREC UBB",
      html: html,
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
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0;">✅ Solicitud Aprobada</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #2e7d32; margin-top: 0;">¡Tu solicitud ha sido aprobada!</h2>
          
          <p>Estimado/a <strong>${solicitud.usuario.Nombre} ${solicitud.usuario.Apellido}</strong>,</p>
          
          <p>Nos complace informarte que tu solicitud de préstamo ha sido aprobada.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4caf50; margin-top: 0;">Detalles del Préstamo</h3>
            <p><strong>ID Préstamo:</strong> ${prestamo.ID_Prestamo}</p>
            <p><strong>Equipo:</strong> ${solicitud.ID_Num_Inv}</p>
            <p><strong>Período:</strong></p>
            <p style="padding-left: 20px;">
              Desde: ${new Date(prestamo.Fecha_inicio_prestamo).toLocaleDateString('es-CL')}<br>
              Hasta: ${new Date(prestamo.Fecha_fin_prestamo).toLocaleDateString('es-CL')}
            </p>
          </div>
          
          <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📌 Próximos Pasos:</strong></p>
            <ul style="margin: 10px 0;">
              <li>El equipo estará listo para ser retirado próximamente</li>
              <li>Deberás presentarte en la oficina de administración</li>
              <li>Recibirás una notificación cuando el equipo esté listo para entrega</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Este es un correo automático, por favor no responder.
          </p>
        </div>
        
        <div style="background: #2e7d32; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">Universidad del Bío-Bío - Escuela de Ingeniería Civil Informática</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: emailConfig.user,
      to: solicitud.usuario.Correo,
      subject: "✅ Solicitud Aprobada - SIREC UBB",
      html: html,
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
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0;">📦 Equipo Entregado</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #2e7d32; margin-top: 0;">Equipo entregado exitosamente</h2>
          
          <p>Estimado/a <strong>${solicitud.usuario.Nombre} ${solicitud.usuario.Apellido}</strong>,</p>
          
          <p>Confirmamos que el equipo ha sido entregado correctamente.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4caf50; margin-top: 0;">Información de la Entrega</h3>
            <p><strong>Equipo:</strong> ${solicitud.ID_Num_Inv}</p>
            <p><strong>ID Préstamo:</strong> ${prestamo.ID_Prestamo}</p>
            <p><strong>Período del Préstamo:</strong></p>
            <p style="padding-left: 20px;">
              Desde: ${new Date(prestamo.Fecha_inicio_prestamo).toLocaleDateString('es-CL')}<br>
              Hasta: ${new Date(prestamo.Fecha_fin_prestamo).toLocaleDateString('es-CL')}
            </p>
          </div>
          
          <div style="background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚠️ Responsabilidades:</strong></p>
            <ul style="margin: 10px 0; font-size: 14px;">
              <li>Eres responsable del equipo durante todo el período del préstamo</li>
              <li>Debes cuidar el equipo y usarlo adecuadamente</li>
              <li>Cualquier daño debe ser reportado inmediatamente</li>
              <li><strong>Debes devolver el equipo en la fecha indicada</strong></li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 16px;"><strong>📅 Fecha Límite de Devolución:</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 20px; color: #1565c0; font-weight: bold;">
              ${new Date(prestamo.Fecha_fin_prestamo).toLocaleDateString('es-CL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Este es un correo automático, por favor no responder.
          </p>
        </div>
        
        <div style="background: #2e7d32; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">Universidad del Bío-Bío - Escuela de Ingeniería Civil Informática</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: emailConfig.user,
      to: solicitud.usuario.Correo,
      subject: "📦 Equipo Entregado - SIREC UBB",
      html: html,
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
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0;">✅ Devolución Completada</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #2e7d32; margin-top: 0;">Equipo devuelto exitosamente</h2>
          
          <p>Estimado/a <strong>${solicitud.usuario.Nombre} ${solicitud.usuario.Apellido}</strong>,</p>
          
          <p>Confirmamos que la devolución del equipo ha sido registrada correctamente.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4caf50; margin-top: 0;">Información de la Devolución</h3>
            <p><strong>Equipo:</strong> ${solicitud.ID_Num_Inv}</p>
            <p><strong>Fecha de Devolución:</strong> ${new Date(devolucion.Fecha_devolucion).toLocaleString('es-CL')}</p>
            <p><strong>Recibido por:</strong> ${devolucion.usuario?.Nombre || 'Administrador'} ${devolucion.usuario?.Apellido || ''}</p>
            ${devolucion.Estado_equipo ? `<p><strong>Estado del Equipo:</strong> ${devolucion.Estado_equipo}</p>` : ''}
            ${devolucion.Observaciones ? `
              <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px;">
                <p style="margin: 0;"><strong>Observaciones:</strong></p>
                <p style="margin: 5px 0 0 0;">${devolucion.Observaciones}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; border-radius: 4px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 18px; color: #2e7d32;">
              <strong>¡Gracias por cuidar el equipo!</strong>
            </p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">
              El préstamo ha sido finalizado correctamente.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Este es un correo automático, por favor no responder.
          </p>
        </div>
        
        <div style="background: #2e7d32; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">Universidad del Bío-Bío - Escuela de Ingeniería Civil Informática</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: emailConfig.user,
      to: solicitud.usuario.Correo,
      subject: "✅ Devolución de Equipo Registrada - SIREC UBB",
      html: html,
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
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #f44336 0%, #c62828 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0;">❌ Solicitud Rechazada</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #c62828; margin-top: 0;">Tu solicitud no ha sido aprobada</h2>
          
          <p>Estimado/a <strong>${solicitud.usuario.Nombre} ${solicitud.usuario.Apellido}</strong>,</p>
          
          <p>Lamentamos informarte que tu solicitud de préstamo no ha sido aprobada.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f44336; margin-top: 0;">Información de la Solicitud</h3>
            <p><strong>ID Solicitud:</strong> ${solicitud.ID_Solicitud}</p>
            <p><strong>Equipo:</strong> ${solicitud.ID_Num_Inv}</p>
            <p><strong>Fecha de Solicitud:</strong> ${new Date(solicitud.Fecha_Sol).toLocaleString('es-CL')}</p>
          </div>
          
          ${observaciones ? `
            <div style="background: #ffebee; padding: 15px; border-left: 4px solid #f44336; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Motivo del Rechazo:</strong></p>
              <p style="margin: 10px 0 0 0;">${observaciones}</p>
            </div>
          ` : ''}
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
              Si tienes dudas sobre el rechazo de tu solicitud, puedes contactar con la administración de equipos para obtener más información.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Este es un correo automático, por favor no responder.
          </p>
        </div>
        
        <div style="background: #c62828; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">Universidad del Bío-Bío - Escuela de Ingeniería Civil Informática</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: emailConfig.user,
      to: solicitud.usuario.Correo,
      subject: "❌ Solicitud Rechazada - SIREC UBB",
      html: html,
    });

    console.log(`✉️ Email de solicitud rechazada enviado a: ${solicitud.usuario.Correo}`);
  } catch (error) {
    console.error("Error al enviar email de solicitud rechazada:", error);
  }
}