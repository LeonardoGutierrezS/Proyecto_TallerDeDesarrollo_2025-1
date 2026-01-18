"use strict";
import PDFDocument from "pdfkit";
import { AppDataSource } from "../config/configDb.js";
import Solicitud from "../entity/solicitud.entity.js";

/**
 * Generar PDF de autorización de préstamo
 * @param {number} idSolicitud - ID de la solicitud aprobada
 * @returns {Promise<PDFDocument>} - Documento PDF generado
 */
export async function generarPDFAutorizacion(idSolicitud) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);

    // Obtener la solicitud con todas sus relaciones
    const solicitud = await solicitudRepository.findOne({
      where: { ID_Solicitud: idSolicitud },
      relations: [
        "usuario",
        "usuario.carrera",
        "equipo",
        "equipo.marca",
        "equipo.categoria",
        "prestamo",
        "prestamo.autorizacion",
        "prestamo.autorizacion.usuario",
        "prestamo.autorizacion.usuario.cargo",
      ],
    });

    if (!solicitud) {
      throw new Error("Solicitud no encontrada");
    }

    if (!solicitud.prestamo || !solicitud.prestamo.autorizacion) {
      throw new Error("La solicitud no tiene autorización asociada");
    }

    // Validar que sea un préstamo de largo plazo (tiene fechas de inicio y término)
    if (!solicitud.Fecha_inicio_sol || !solicitud.Fecha_termino_sol) {
      throw new Error("El PDF de autorización solo se genera para préstamos de largo plazo");
    }

    const doc = new PDFDocument({ size: "letter", margin: 50 });

    // Configuración de fuentes
    const titleSize = 18;
    const headerSize = 14;
    const normalSize = 11;
    const smallSize = 9;

    // Encabezado
    doc
      .fontSize(titleSize)
      .font("Helvetica-Bold")
      .text("AUTORIZACIÓN DE PRÉSTAMO DE EQUIPO", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(smallSize)
      .font("Helvetica")
      .text("UNIVERSIDAD DEL BÍO-BÍO", { align: "center" })
      .text("FACULTAD DE CIENCIAS EMPRESARIALES", { align: "center" })
      .text("DEPARTAMENTO DE SISTEMAS DE INFORMACIÓN", { align: "center" })
      .moveDown(1.5);

    // Información de la solicitud
    const fechaAutorizacion = new Date(solicitud.prestamo.autorizacion.Fecha_Aut);
    const fechaFormateada = fechaAutorizacion.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    doc
      .fontSize(normalSize)
      .font("Helvetica-Bold")
      .text(`Nº Solicitud: ${solicitud.ID_Solicitud}`, { continued: true })
      .font("Helvetica")
      .text(`     Fecha: ${fechaFormateada}`, { align: "left" })
      .moveDown(1);

    // Datos del alumno
    doc
      .fontSize(headerSize)
      .font("Helvetica-Bold")
      .text("DATOS DEL SOLICITANTE")
      .moveDown(0.5);

    const usuario = solicitud.usuario;
    doc
      .fontSize(normalSize)
      .font("Helvetica-Bold")
      .text("Nombre: ", { continued: true })
      .font("Helvetica")
      .text(usuario.Nombre_Completo)
      .font("Helvetica-Bold")
      .text("RUT: ", { continued: true })
      .font("Helvetica")
      .text(usuario.Rut)
      .font("Helvetica-Bold")
      .text("Correo: ", { continued: true })
      .font("Helvetica")
      .text(usuario.Correo)
      .font("Helvetica-Bold")
      .text("Carrera: ", { continued: true })
      .font("Helvetica")
      .text(usuario.carrera?.Nombre_Carrera || "No especificada")
      .moveDown(1);

    // Datos del equipo
    doc
      .fontSize(headerSize)
      .font("Helvetica-Bold")
      .text("EQUIPO AUTORIZADO")
      .moveDown(0.5);

    const equipo = solicitud.equipo;
    doc
      .fontSize(normalSize)
      .font("Helvetica-Bold")
      .text("Nº Inventario: ", { continued: true })
      .font("Helvetica")
      .text(equipo.ID_Num_Inv)
      .font("Helvetica-Bold")
      .text("Categoría: ", { continued: true })
      .font("Helvetica")
      .text(equipo.categoria?.Descripcion || "No especificada")
      .font("Helvetica-Bold")
      .text("Marca: ", { continued: true })
      .font("Helvetica")
      .text(equipo.marca?.Descripcion || "No especificada")
      .font("Helvetica-Bold")
      .text("Modelo: ", { continued: true })
      .font("Helvetica")
      .text(equipo.Modelo || "No especificado")
      .font("Helvetica-Bold")
      .text("Nº Serie: ", { continued: true })
      .font("Helvetica")
      .text(equipo.Numero_Serie || "No especificado")
      .moveDown(1);

    // Periodo del préstamo
    doc
      .fontSize(headerSize)
      .font("Helvetica-Bold")
      .text("PERIODO DEL PRÉSTAMO")
      .moveDown(0.5);

    const fechaInicio = new Date(solicitud.prestamo.Fecha_inicio_prestamo);
    const fechaFin = solicitud.prestamo.Fecha_fin_prestamo 
      ? new Date(solicitud.prestamo.Fecha_fin_prestamo)
      : null;

    doc
      .fontSize(normalSize)
      .font("Helvetica-Bold")
      .text("Fecha Inicio: ", { continued: true })
      .font("Helvetica")
      .text(fechaInicio.toLocaleDateString('es-CL'))
      .font("Helvetica-Bold")
      .text("Fecha Término: ", { continued: true })
      .font("Helvetica")
      .text(fechaFin ? fechaFin.toLocaleDateString('es-CL') : "Mismo día")
      .moveDown(1);

    // Motivo
    doc
      .fontSize(headerSize)
      .font("Helvetica-Bold")
      .text("MOTIVO DE LA SOLICITUD")
      .moveDown(0.5);

    doc
      .fontSize(normalSize)
      .font("Helvetica")
      .text(solicitud.Motivo_Sol || "No especificado", { align: "justify" })
      .moveDown(1);

    // Condiciones (si hay)
    if (solicitud.prestamo.Condiciones_Prestamo) {
      doc
        .fontSize(headerSize)
        .font("Helvetica-Bold")
        .text("CONDICIONES DEL PRÉSTAMO")
        .moveDown(0.5);

      doc
        .fontSize(normalSize)
        .font("Helvetica")
        .text(solicitud.prestamo.Condiciones_Prestamo, { align: "justify" })
        .moveDown(1);
    }

    // Responsabilidades
    doc
      .fontSize(headerSize)
      .font("Helvetica-Bold")
      .text("RESPONSABILIDADES DEL USUARIO")
      .moveDown(0.5);

    doc
      .fontSize(smallSize)
      .font("Helvetica")
      .list([
        "El usuario se compromete a hacer uso responsable del equipo prestado.",
        "El usuario debe devolver el equipo en las mismas condiciones en que lo recibió.",
        "En caso de daño o pérdida, el usuario deberá responder según el reglamento institucional.",
        "El equipo debe ser devuelto en la fecha acordada.",
        "El equipo es de uso exclusivo del solicitante y no puede ser transferido a terceros.",
      ])
      .moveDown(1.5);

    // Firmas
    const autorizador = solicitud.prestamo.autorizacion.usuario;
    const cargoAutorizador = autorizador.cargo?.Desc_Cargo || "Director de Escuela";

    doc.moveDown(2);

    // Firma del director (ya firmado)
    const leftMargin = 80;
    const rightMargin = 350;
    const lineY = doc.y;

    doc
      .fontSize(normalSize)
      .font("Helvetica-Bold")
      .text("_________________________", leftMargin, lineY)
      .moveDown(0.3)
      .text(autorizador.Nombre_Completo, leftMargin, doc.y, { width: 200, align: "center" })
      .moveDown(0.2)
      .font("Helvetica")
      .fontSize(smallSize)
      .text(`RUT: ${autorizador.Rut}`, leftMargin, doc.y, { width: 200, align: "center" })
      .moveDown(0.2)
      .text(cargoAutorizador, leftMargin, doc.y, { width: 200, align: "center" });

    // Espacio para firma del alumno
    doc
      .fontSize(normalSize)
      .font("Helvetica-Bold")
      .text("_________________________", rightMargin, lineY)
      .moveDown(0.3)
      .text(usuario.Nombre_Completo, rightMargin, doc.y, { width: 200, align: "center" })
      .moveDown(0.2)
      .font("Helvetica")
      .fontSize(smallSize)
      .text(`RUT: ${usuario.Rut}`, rightMargin, doc.y, { width: 200, align: "center" })
      .moveDown(0.2)
      .text("Firma del Solicitante", rightMargin, doc.y, { width: 200, align: "center" });

    // Pie de página
    doc
      .moveDown(2)
      .fontSize(smallSize)
      .font("Helvetica-Oblique")
      .text(
        `Documento generado el ${new Date().toLocaleString('es-CL')}`,
        { align: "center" }
      );

    return doc;
  } catch (error) {
    console.error("Error al generar PDF de autorización:", error);
    throw error;
  }
}
