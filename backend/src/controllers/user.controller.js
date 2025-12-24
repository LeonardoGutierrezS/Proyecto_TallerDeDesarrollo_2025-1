"use strict";
import {
  approveUserService,
  createUserByAdminService,
  deleteUserService,
  getPendingUsersService,
  getUserService,
  getUsersService,
  rejectUserService,
  updateUserService,
  updateUserStatusService,
} from "../services/user.service.js";
import { sendEmail } from "../services/email.service.js";
import {
  userBodyValidation,
  userQueryValidation,
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getUser(req, res) {
  try {
    const { rut, email } = req.query;

    const { error } = userQueryValidation.validate({ rut, email });

    if (error) return handleErrorClient(res, 400, error.message);

    const [user, errorUser] = await getUserService({ rut, email });

    if (errorUser) return handleErrorClient(res, 404, errorUser);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    users.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      error.message,
    );
  }
}

export async function updateUser(req, res) {
  try {
    const { rut, email } = req.query;
    const { body } = req;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = userBodyValidation.validate(body);

    if (bodyError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );
    }

    const [user, userError] = await updateUserService({ rut, email }, body);

    if (userError) {
      return handleErrorClient(res, 400, "Error modificando al usuario", userError);
    }

    handleSuccess(res, 200, "Usuario modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const { rut, email } = req.query;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [userDelete, errorUserDelete] = await deleteUserService({
      rut,
      email,
    });

    if (errorUserDelete) return handleErrorClient(res, 404, "Error eliminado al usuario", errorUserDelete);

    handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getPendingUsers(req, res) {
  try {
    const [users, error] = await getPendingUsersService();

    if (error) return handleErrorClient(res, 404, error);

    handleSuccess(res, 200, "Usuarios pendientes encontrados", users);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function approveUser(req, res) {
  try {
    const { rut } = req.params;
    const [user, error] = await approveUserService(rut);

    if (error) return handleErrorClient(res, 400, "Error al aprobar usuario", error);

    // Enviar correo de aprobación
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #003b7a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 30px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Registro Aprobado!</h1>
            </div>
            <div class="content">
              <p>Estimado/a <strong>${user.Nombre_Completo}</strong>,</p>
              <p>Nos complace informarte que tu solicitud de registro en el Sistema de Reserva de Equipos Computacionales (SIREC) ha sido <strong>aprobada</strong>.</p>
              <p>Ya puedes iniciar sesión en el sistema con las credenciales que registraste.</p>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth" class="button">Iniciar Sesión</a>
              </div>
              <p>Si tienes alguna consulta, no dudes en contactarnos.</p>
            </div>
            <div class="footer">
              <p>Sistema de Reserva de Equipos Computacionales<br>Facultad de Ciencias Empresariales - Universidad del Bío-Bío</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      await sendEmail(
        user.Correo,
        'Registro Aprobado - SIREC',
        htmlContent
      );
    } catch (emailError) {
      console.error('Error al enviar correo de aprobación:', emailError);
      // No fallar la aprobación si el email falla
    }

    handleSuccess(res, 200, "Usuario aprobado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function rejectUser(req, res) {
  try {
    const { rut } = req.params;
    const { motivo } = req.body;

    if (!motivo || motivo.trim().length === 0) {
      return handleErrorClient(res, 400, "Error al rechazar usuario", "El motivo de rechazo es obligatorio");
    }

    const [user, error] = await rejectUserService(rut, motivo);

    if (error) return handleErrorClient(res, 400, "Error al rechazar usuario", error);

    // Enviar correo de rechazo
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .motivo-box { background-color: #fff; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registro No Aprobado</h1>
            </div>
            <div class="content">
              <p>Estimado/a <strong>${user.Nombre_Completo}</strong>,</p>
              <p>Lamentamos informarte que tu solicitud de registro en el Sistema de Reserva de Equipos Computacionales (SIREC) no ha sido aprobada.</p>
              <div class="motivo-box">
                <strong>Motivo:</strong><br>
                ${motivo}
              </div>
              <p>Si consideras que esto es un error o deseas más información, por favor contacta con el administrador del sistema.</p>
            </div>
            <div class="footer">
              <p>Sistema de Reserva de Equipos Computacionales<br>Facultad de Ciencias Empresariales - Universidad del Bío-Bío</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      await sendEmail(
        user.Correo,
        'Registro No Aprobado - SIREC',
        htmlContent
      );
    } catch (emailError) {
      console.error('Error al enviar correo de rechazo:', emailError);
      // No fallar el rechazo si el email falla
    }

    handleSuccess(res, 200, "Usuario rechazado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateUserStatus(req, res) {
  try {
    const { rut } = req.params;
    const { vigente } = req.body;
    const [user, error] = await updateUserStatusService(rut, vigente);

    if (error) return handleErrorClient(res, 400, "Error al actualizar estado", error);

    handleSuccess(res, 200, "Estado actualizado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createUserByAdmin(req, res) {
  try {
    const { body } = req;
    const [newUser, error] = await createUserByAdminService(body);

    if (error) return handleErrorClient(res, 400, "Error al crear usuario", error);

    // Enviar correo con contraseña provisional
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #003b5c; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
            .password-box { 
              background-color: #fff; 
              border: 2px solid #003b5c; 
              padding: 20px; 
              text-align: center; 
              font-size: 24px; 
              font-weight: bold; 
              letter-spacing: 2px;
              margin: 20px 0;
            }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .warning { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SIREC - Bienvenido</h1>
            </div>
            
            <div class="content">
              <h2>Cuenta Creada Exitosamente</h2>
              <p>Hola <strong>${newUser.Nombre_Completo}</strong>,</p>
              <p>Tu cuenta en SIREC UBB ha sido creada por el administrador del sistema.</p>
              
              <p><strong>Tus credenciales de acceso son:</strong></p>
              <p><strong>Correo:</strong> ${newUser.Correo}</p>
              <p><strong>Contraseña Provisional:</strong></p>
              
              <div class="password-box">
                ${newUser.provisionalPassword}
              </div>
              
              <div class="warning">
                <strong>⚠️ Importante - Seguridad</strong>
                <ul>
                  <li>Esta es una <strong>contraseña provisional</strong></li>
                  <li>Te recomendamos cambiarla después de tu primer inicio de sesión</li>
                  <li>No compartas esta contraseña con nadie</li>
                  <li>Si no solicitaste esta cuenta, contacta al administrador</li>
                </ul>
              </div>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                   style="display: inline-block; padding: 12px 30px; background-color: #003b5c; color: white; text-decoration: none; border-radius: 5px;">
                  Iniciar Sesión
                </a>
              </p>
            </div>
            
            <div class="footer">
              <p>Universidad del Bío-Bío - Facultad de Ciencias Empresariales</p>
              <p>Este es un correo automático, por favor no respondas a este mensaje</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
Bienvenido a SIREC UBB

Hola ${newUser.Nombre_Completo},

Tu cuenta ha sido creada exitosamente.

Credenciales de acceso:
Correo: ${newUser.Correo}
Contraseña Provisional: ${newUser.provisionalPassword}

IMPORTANTE:
- Esta es una contraseña provisional
- Te recomendamos cambiarla después de tu primer inicio de sesión
- No compartas esta contraseña con nadie

Universidad del Bío-Bío
      `;

      await sendEmail(
        newUser.Correo,
        "Bienvenido a SIREC UBB - Credenciales de Acceso",
        textContent,
        htmlContent
      );
    } catch (emailError) {
      console.error("Error al enviar correo:", emailError);
      // Continuar aunque falle el envío del correo
    }

    // Remover la contraseña provisional de la respuesta
    const { provisionalPassword, ...userWithoutPassword } = newUser;

    handleSuccess(res, 201, "Usuario creado correctamente. Se ha enviado un correo con las credenciales.", userWithoutPassword);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}