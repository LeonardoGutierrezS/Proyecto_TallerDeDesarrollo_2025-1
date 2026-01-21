"use strict";
import PDFDocument from "pdfkit";
import { AppDataSource } from "../config/configDb.js";
import Solicitud from "../entity/solicitud.entity.js";
import Prestamo from "../entity/prestamo.entity.js";
import Equipos from "../entity/equipos.entity.js";
import User from "../entity/user.entity.js";
import Devolucion from "../entity/devolucion.entity.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGO_SIREC = path.join(__dirname, '../assets/images/sirec-logo-blanco.png');
const LOGO_FACE = path.join(__dirname, '../assets/images/face-logo.png');

/**
 * Función auxiliar para dibujar el encabezado institucional con logos
 */
const dibujarEncabezadoInstitucional = (doc, titulo, isLandscape = false) => {
  const pageWidth = isLandscape ? 792 : 612;
  const margin = 40;
  const contentWidth = pageWidth - (margin * 2);

  try {
    // Franja azul superior
    doc.rect(0, 0, pageWidth, 60).fill("#003366");

    // Logo SIREC (Izquierda)
    doc.image(LOGO_SIREC, margin, 10, { height: 40 });
  } catch (e) {
    console.error("No se pudo cargar logo SIREC:", e);
  }

  try {
    // Logo Facultad (Derecha) - Ajustado para que no tope con el borde
    doc.image(LOGO_FACE, pageWidth - margin - 120, 10, { height: 40 });
  } catch (e) {
    console.error("No se pudo cargar logo FACE:", e);
  }

  doc
    .fillColor("#003366")
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(titulo, margin, 70, { align: "center", width: contentWidth })
    .moveDown(0.2);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#64748b")
    .text("Universidad del Bío-Bío - Facultad de Ciencias Empresariales", { align: "center", width: contentWidth })
    .text(`Fecha de generación: ${new Date().toLocaleString("es-CL")}`, { align: "center", width: contentWidth })
    .moveDown(1.5);
  
  // Línea divisoria
  doc
    .moveTo(margin, doc.y - 10)
    .lineTo(pageWidth - margin, doc.y - 10)
    .strokeColor("#e2e8f0")
    .lineWidth(1)
    .stroke();
  
  return doc.y;
};

/**
 * Generar reporte de solicitudes en PDF
 */
export async function generarReporteSolicitudesPDF(filtros = {}) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    
    // Construir query con filtros
    let queryBuilder = solicitudRepository
      .createQueryBuilder("solicitud")
      .leftJoinAndSelect("solicitud.usuario", "usuario")
      .leftJoinAndSelect("solicitud.equipo", "equipo")
      .leftJoinAndSelect("equipo.categoria", "categoria")
      .leftJoinAndSelect("solicitud.prestamo", "prestamo")
      .leftJoinAndSelect("prestamo.tieneEstados", "tieneEstados")
      .leftJoinAndSelect("tieneEstados.estadoPrestamo", "estadoPrestamo")
      .orderBy("solicitud.Fecha_Sol", "DESC");

    // Aplicar filtros
    if (filtros.fechaInicio) {
      queryBuilder.andWhere("solicitud.Fecha_Sol >= :fechaInicio", { 
        fechaInicio: filtros.fechaInicio 
      });
    }
    
    if (filtros.fechaFin) {
      queryBuilder.andWhere("solicitud.Fecha_Sol <= :fechaFin", { 
        fechaFin: filtros.fechaFin 
      });
    }

    const solicitudes = await queryBuilder.getMany();

    // Crear PDF
    const doc = new PDFDocument({ size: "letter", margin: 40 });

    // Encabezado
    dibujarEncabezadoInstitucional(doc, "REPORTE DE SOLICITUDES");

    // Filtros aplicados
    if (filtros.fechaInicio || filtros.fechaFin) {
      doc.fontSize(9).font("Helvetica-Bold").text("Filtros aplicados:", { underline: true });
      if (filtros.fechaInicio) {
        doc.font("Helvetica").text(`Desde: ${new Date(filtros.fechaInicio).toLocaleDateString("es-CL")}`);
      }
      if (filtros.fechaFin) {
        doc.text(`Hasta: ${new Date(filtros.fechaFin).toLocaleDateString("es-CL")}`);
      }
      doc.moveDown(1);
    }

    // Resumen
    doc.fontSize(11).font("Helvetica-Bold").text(`Total de Solicitudes: ${solicitudes.length}`);
    doc.moveDown(1);

    // Tabla de solicitudes
    solicitudes.forEach((solicitud, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      const estado = obtenerEstadoSolicitud(solicitud);
      const tipo = solicitud.Fecha_inicio_sol && solicitud.Fecha_termino_sol ? "Largo Plazo" : "Diaria";

      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(`${index + 1}. Solicitud #${solicitud.ID_Solicitud}`, { continued: false })
        .font("Helvetica")
        .text(`Usuario: ${solicitud.usuario?.Nombre_Completo || ''}`)
        .text(`RUT: ${solicitud.Rut}`)
        .text(`Equipo: ${solicitud.ID_Num_Inv} - ${solicitud.equipo?.Modelo || "N/A"}`)
        .text(`Tipo: ${tipo}`)
        .text(`Estado: ${estado}`)
        .text(`Fecha Solicitud: ${new Date(solicitud.Fecha_Sol).toLocaleString("es-CL")}`)
        .text(`Motivo: ${solicitud.Motivo_Sol || "No especificado"}`)
        .moveDown(0.5);
    });

    return doc;
  } catch (error) {
    console.error("Error al generar reporte de solicitudes PDF:", error);
    throw error;
  }
}

/**
 * Generar reporte de solicitudes en CSV
 */
export async function generarReporteSolicitudesCSV(filtros = {}) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    
    let queryBuilder = solicitudRepository
      .createQueryBuilder("solicitud")
      .leftJoinAndSelect("solicitud.usuario", "usuario")
      .leftJoinAndSelect("solicitud.equipo", "equipo")
      .leftJoinAndSelect("solicitud.prestamo", "prestamo")
      .leftJoinAndSelect("prestamo.tieneEstados", "tieneEstados")
      .leftJoinAndSelect("tieneEstados.estadoPrestamo", "estadoPrestamo")
      .orderBy("solicitud.Fecha_Sol", "DESC");

    if (filtros.fechaInicio) {
      queryBuilder.andWhere("solicitud.Fecha_Sol >= :fechaInicio", { 
        fechaInicio: filtros.fechaInicio 
      });
    }
    
    if (filtros.fechaFin) {
      queryBuilder.andWhere("solicitud.Fecha_Sol <= :fechaFin", { 
        fechaFin: filtros.fechaFin 
      });
    }

    const solicitudes = await queryBuilder.getMany();

    // Crear CSV
    let csv = "ID Solicitud,Usuario,RUT,Equipo,Modelo,Tipo,Estado,Fecha Solicitud,Motivo\n";
    
    solicitudes.forEach(solicitud => {
      const estado = obtenerEstadoSolicitud(solicitud);
      const tipo = solicitud.Fecha_inicio_sol && solicitud.Fecha_termino_sol ? "Largo Plazo" : "Diaria";
      
      csv += `${solicitud.ID_Solicitud},`;
      csv += `"${solicitud.usuario?.Nombre_Completo || ''}",`;
      csv += `${solicitud.Rut},`;
      csv += `${solicitud.ID_Num_Inv},`;
      csv += `"${solicitud.equipo?.Modelo || "N/A"}",`;
      csv += `${tipo},`;
      csv += `${estado},`;
      csv += `"${new Date(solicitud.Fecha_Sol).toLocaleString("es-CL")}",`;
      csv += `"${solicitud.Motivo_Sol || "No especificado"}"\n`;
    });

    return csv;
  } catch (error) {
    console.error("Error al generar reporte de solicitudes CSV:", error);
    throw error;
  }
}

/**
 * Generar reporte de préstamos en PDF
 */
export async function generarReportePrestamosPDF(filtros = {}) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    
    let queryBuilder = prestamoRepository
      .createQueryBuilder("prestamo")
      .leftJoinAndSelect("prestamo.equipos", "equipo")
      .leftJoinAndSelect("equipo.categoria", "categoria")
      .leftJoinAndSelect("prestamo.solicitudes", "solicitud")
      .leftJoinAndSelect("solicitud.usuario", "usuario")
      .leftJoinAndSelect("prestamo.tieneEstados", "tieneEstados")
      .leftJoinAndSelect("tieneEstados.estadoPrestamo", "estadoPrestamo")
      .leftJoinAndSelect("prestamo.devolucion", "devolucion")
      .orderBy("prestamo.Fecha_inicio_prestamo", "DESC");

    if (filtros.fechaInicio) {
      queryBuilder.andWhere("prestamo.Fecha_inicio_prestamo >= :fechaInicio", { 
        fechaInicio: filtros.fechaInicio 
      });
    }
    
    if (filtros.fechaFin) {
      queryBuilder.andWhere("prestamo.Fecha_inicio_prestamo <= :fechaFin", { 
        fechaFin: filtros.fechaFin 
      });
    }

    const prestamos = await queryBuilder.getMany();

    const doc = new PDFDocument({ size: "letter", margin: 40 });

    // Encabezado
    dibujarEncabezadoInstitucional(doc, "REPORTE DE PRÉSTAMOS");

    doc.fontSize(11).font("Helvetica-Bold").text(`Total de Préstamos: ${prestamos.length}`);
    doc.moveDown(1);

    prestamos.forEach((prestamo, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      const estado = obtenerEstadoPrestamo(prestamo);
      const solicitud = prestamo.solicitudes && prestamo.solicitudes.length > 0 ? prestamo.solicitudes[0] : null;

      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(`${index + 1}. Préstamo #${prestamo.ID_Prestamo}`)
        .font("Helvetica")
        .text(`Usuario: ${solicitud?.usuario?.Nombre_Completo || ''}`)
        .text(`Equipo: ${prestamo.ID_Num_Inv}`)
        .text(`Estado: ${estado}`)
        .text(`Fecha Inicio: ${new Date(prestamo.Fecha_inicio_prestamo).toLocaleString("es-CL")}`)
        .text(`Fecha Fin: ${new Date(prestamo.Fecha_fin_prestamo).toLocaleString("es-CL")}`)
        .moveDown(0.5);
    });

    return doc;
  } catch (error) {
    console.error("Error al generar reporte de préstamos PDF:", error);
    throw error;
  }
}

/**
 * Generar reporte de préstamos en CSV
 */
export async function generarReportePrestamosCSV(filtros = {}) {
  try {
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    
    let queryBuilder = prestamoRepository
      .createQueryBuilder("prestamo")
      .leftJoinAndSelect("prestamo.equipos", "equipo")
      .leftJoinAndSelect("prestamo.solicitudes", "solicitud")
      .leftJoinAndSelect("solicitud.usuario", "usuario")
      .leftJoinAndSelect("prestamo.tieneEstados", "tieneEstados")
      .leftJoinAndSelect("tieneEstados.estadoPrestamo", "estadoPrestamo")
      .orderBy("prestamo.Fecha_inicio_prestamo", "DESC");

    if (filtros.fechaInicio) {
      queryBuilder.andWhere("prestamo.Fecha_inicio_prestamo >= :fechaInicio", { 
        fechaInicio: filtros.fechaInicio 
      });
    }
    
    if (filtros.fechaFin) {
      queryBuilder.andWhere("prestamo.Fecha_inicio_prestamo <= :fechaFin", { 
        fechaFin: filtros.fechaFin 
      });
    }

    const prestamos = await queryBuilder.getMany();

    let csv = "ID Prestamo,Usuario,RUT,Equipo,Estado,Fecha Inicio,Fecha Fin\n";
    
    prestamos.forEach(prestamo => {
      const estado = obtenerEstadoPrestamo(prestamo);
      const solicitud = prestamo.solicitudes && prestamo.solicitudes.length > 0 ? prestamo.solicitudes[0] : null;
      
      csv += `${prestamo.ID_Prestamo},`;
      csv += `"${solicitud?.usuario?.Nombre_Completo || ''}",`;
      csv += `${solicitud?.Rut || "N/A"},`;
      csv += `${prestamo.ID_Num_Inv},`;
      csv += `${estado},`;
      csv += `"${new Date(prestamo.Fecha_inicio_prestamo).toLocaleString("es-CL")}",`;
      csv += `"${new Date(prestamo.Fecha_fin_prestamo).toLocaleString("es-CL")}"\n`;
    });

    return csv;
  } catch (error) {
    console.error("Error al generar reporte de préstamos CSV:", error);
    throw error;
  }
}

export async function generarReporteEquiposPDF() {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipos);
    
    const equipos = await equipoRepository.find({
      relations: ["categoria", "marca", "estado", "especificaciones"],
      order: { ID_Num_Inv: "ASC" }
    });

    const doc = new PDFDocument({ size: "letter", layout: "landscape", margin: 40 });

    // Encabezado
    dibujarEncabezadoInstitucional(doc, "REPORTE DE EQUIPOS", true);

    // Estadísticas
    const disponibles = equipos.filter(e => e.Disponible).length;
    const enPrestamo = equipos.filter(e => !e.Disponible).length;

    doc.fontSize(11).font("Helvetica-Bold").text("Resumen:");
    doc.fontSize(10).font("Helvetica")
      .text(`Total de Equipos: ${equipos.length} | Disponibles: ${disponibles} | En Préstamo: ${enPrestamo}`)
      .moveDown(1);

    // Configuración de la tabla
    const tableTop = doc.y;
    const colWidths = [25, 80, 110, 80, 80, 80, 60, 197]; 
    const colNames = ["#", "Inventario", "Modelo", "Categoría", "Marca", "Estado", "Disp.", "Especificaciones"];
    const startX = 40;
    let currentY = tableTop;

    // Función para dibujar encabezado de tabla
    const drawTableHeader = (y) => {
      doc.rect(startX, y, 712, 20).fill("#f1f5f9").stroke("#cbd5e1");
      doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(8);
      
      let x = startX;
      colNames.forEach((name, i) => {
        doc.text(name, x + 5, y + 6, { width: colWidths[i] - 10, align: "left" });
        x += colWidths[i];
      });
      return y + 20;
    };

    currentY = drawTableHeader(currentY);

    // Filas de equipos
    equipos.forEach((equipo, index) => {
      // Formatear especificaciones
      let specsText = "-";
      if (equipo.especificaciones && equipo.especificaciones.length > 0) {
        specsText = equipo.especificaciones
          .map(s => `${s.Tipo_Especificacion_HW}: ${s.Descripcion}`)
          .join(", ");
      }

      const data = [
        (index + 1).toString(),
        equipo.ID_Num_Inv || "N/A",
        equipo.Modelo || "N/A",
        equipo.categoria?.Descripcion || "N/A",
        equipo.marca?.Descripcion || "N/A",
        equipo.estado?.Descripcion || "N/A",
        equipo.Disponible ? "Sí" : "No",
        specsText
      ];

      // Altura dinámica basada en el texto de especificaciones
      const rowHeight = Math.max(25, doc.heightOfString(specsText, { width: colWidths[7] - 10 }) + 10);

      if (currentY + rowHeight > 550) {
        doc.addPage({ size: "letter", layout: "landscape", margin: 40 });
        const nextY = dibujarEncabezadoInstitucional(doc, "REPORTE DE EQUIPOS", true);
        currentY = drawTableHeader(nextY);
      }

      doc.font("Helvetica").fontSize(8).fillColor("#334155");
      let x = startX;
      data.forEach((text, i) => {
        doc.rect(x, currentY, colWidths[i], rowHeight).stroke("#e2e8f0");
        doc.text(text, x + 5, currentY + 7, { 
          width: colWidths[i] - 10,
          height: rowHeight - 10
        });
        x += colWidths[i];
      });

      currentY += rowHeight;
    });

    return doc;
  } catch (error) {
    console.error("Error al generar reporte de equipos PDF:", error);
    throw error;
  }
}

/**
 * Generar reporte de equipos en CSV
 */
export async function generarReporteEquiposCSV() {
  try {
    const equipoRepository = AppDataSource.getRepository(Equipos);
    
    const equipos = await equipoRepository.find({
      relations: ["categoria", "marca", "estado"],
      order: { ID_Num_Inv: "ASC" }
    });

    let csv = "ID Inventario,Modelo,Categoria,Marca,Estado,Disponible\n";
    
    equipos.forEach(equipo => {
      csv += `${equipo.ID_Num_Inv},`;
      csv += `"${equipo.Modelo || "N/A"}",`;
      csv += `"${equipo.categoria?.Descripcion || "N/A"}",`;
      csv += `"${equipo.marca?.Descripcion || "N/A"}",`;
      csv += `"${equipo.estado?.Descripcion || "N/A"}",`;
      csv += `${equipo.Disponible ? "Sí" : "No"}\n`;
    });

    return csv;
  } catch (error) {
    console.error("Error al generar reporte de equipos CSV:", error);
    throw error;
  }
}

/**
 * Generar reporte de estadísticas generales en PDF con gráficos
 */
export async function generarReporteEstadisticasPDF(filtros = {}) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const equipoRepository = AppDataSource.getRepository(Equipos);
    const devolucionRepository = AppDataSource.getRepository(Devolucion);
    const userRepository = AppDataSource.getRepository(User);

    const mesesHistorial = filtros.meses || 6;

    // 1. Obtención de datos exhaustiva
    const solicitudes = await solicitudRepository
      .createQueryBuilder("solicitud")
      .leftJoinAndSelect("solicitud.prestamo", "prestamo")
      .leftJoinAndSelect("prestamo.tieneEstados", "tieneEstados")
      .leftJoinAndSelect("tieneEstados.estadoPrestamo", "estadoPrestamo")
      .getMany();

    const equipos = await equipoRepository
      .createQueryBuilder("equipo")
      .leftJoinAndSelect("equipo.categoria", "categoria")
      .getMany();

    const usuarios = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.tipoUsuario", "tipoUsuario")
      .getMany();

    // Solicitudes por mes
    const fechaCorte = new Date();
    fechaCorte.setMonth(fechaCorte.getMonth() - mesesHistorial);
    fechaCorte.setDate(1);

    const solicitudesPorMes = await solicitudRepository
      .createQueryBuilder("solicitud")
      .select("DATE_TRUNC('month', solicitud.Fecha_Sol)", "mes")
      .addSelect("COUNT(*)", "cantidad")
      .where("solicitud.Fecha_Sol >= :fecha", { fecha: fechaCorte })
      .groupBy("DATE_TRUNC('month', solicitud.Fecha_Sol)")
      .orderBy("DATE_TRUNC('month', solicitud.Fecha_Sol)", "ASC")
      .getRawMany();

    // Solicitudes por carrera
    const solicitudesPorCarreraRaw = await solicitudRepository
      .createQueryBuilder("solicitud")
      .leftJoin("solicitud.usuario", "usuario")
      .leftJoin("usuario.carrera", "carrera")
      .select("COALESCE(carrera.Nombre_Carrera, 'Personal/Docente')", "carrera")
      .addSelect("COUNT(*)", "cantidad")
      .groupBy("carrera.Nombre_Carrera")
      .orderBy("COUNT(*)", "DESC")
      .getRawMany();

    // 2. Procesamiento de métricas
    const totalSolicitudes = solicitudes.length;
    const totalEquipos = equipos.length;
    const equiposDisponibles = equipos.filter(eq => eq.Disponible).length;
    
    const estados = { pendientes: 0, listoParaEntregar: 0, entregados: 0, devueltos: 0, rechazados: 0 };
    solicitudes.forEach(sol => {
      const e = obtenerEstadoSolicitud(sol);
      if (e === "Pendiente") estados.pendientes++;
      else if (e === "Listo para Entregar") estados.listoParaEntregar++;
      else if (e === "Listo para recepcionar") estados.entregados++;
      else if (e === "Devuelto") estados.devueltos++;
      else if (e === "Rechazado") estados.rechazados++;
    });

    const categorias = {};
    equipos.forEach(eq => {
      const cat = eq.categoria?.Descripcion || "Otro";
      categorias[cat] = (categorias[cat] || 0) + 1;
    });

    const doc = new PDFDocument({ size: "letter", margin: 40 });

    // --- PÁGINA 1: RESUMEN EJECUTIVO ---
    dibujarEncabezadoInstitucional(doc, "REPORTE ESTADÍSTICO DE GESTIÓN");
    
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#1e293b").text("Resumen Ejecutivo", { underline: true });
    doc.moveDown(1);

    // Grid de KPIs Básicos
    const startY = doc.y;
    const boxWidth = 250;
    const boxHeight = 60;

    // Caja 1: Solicitudes
    doc.rect(40, startY, boxWidth, boxHeight).fill("#eff6ff").stroke("#3b82f6");
    doc.fillColor("#1e40af").fontSize(12).font("Helvetica-Bold").text("TOTAL SOLICITUDES", 50, startY + 15);
    doc.fontSize(20).text(totalSolicitudes.toString(), 50, startY + 32);

    // Caja 2: Equipos
    doc.rect(305, startY, boxWidth, boxHeight).fill("#fff7ed").stroke("#f97316");
    doc.fillColor("#9a3412").fontSize(12).font("Helvetica-Bold").text("INVENTARIO TOTAL", 315, startY + 15);
    doc.fontSize(20).text(totalEquipos.toString(), 315, startY + 32);

    doc.moveDown(4);

    // Tabla de Estados
    doc.fillColor("#1e293b").fontSize(14).font("Helvetica-Bold").text("Estado Actual de Solicitudes");
    doc.moveDown(0.5);
    
    const tableTop = doc.y;
    const col1 = 60, col2 = 250, col3 = 350;
    
    doc.rect(40, tableTop, 520, 20).fill("#f1f5f9");
    doc.fillColor("#475569").fontSize(10).font("Helvetica-Bold");
    doc.text("ESTADO", col1, tableTop + 5);
    doc.text("CANTIDAD", col2, tableTop + 5);
    doc.text("PORCENTAJE", col3, tableTop + 5);

    let currentY = tableTop + 20;
    const listaEstados = [
      { n: "Pendientes", v: estados.pendientes, c: "#FFD93D" },
      { n: "Listo para Entregar", v: estados.listoParaEntregar, c: "#36A2EB" },
      { n: "Listo para recepcionar", v: estados.entregados, c: "#4BC0C0" },
      { n: "Devueltos", v: estados.devueltos, c: "#9966FF" },
      { n: "Rechazados", v: estados.rechazados, c: "#FF6384" }
    ];

    listaEstados.forEach(item => {
      const pct = ((item.v / (totalSolicitudes || 1)) * 100).toFixed(1) + "%";
      doc.fillColor("#1e293b").font("Helvetica").fontSize(10);
      doc.text(item.n, col1, currentY + 7);
      doc.text(item.v.toString(), col2, currentY + 7);
      doc.text(pct, col3, currentY + 7);
      
      // Mini barra indicadora
      doc.rect(col3 + 80, currentY + 8, (item.v / (totalSolicitudes || 1)) * 100, 8).fill(item.c);
      
      doc.moveTo(40, currentY + 25).lineTo(560, currentY + 25).stroke("#e2e8f0");
      currentY += 25;
    });

    // --- PÁGINA 2: TENDENCIAS ---
    doc.addPage();
    dibujarEncabezadoInstitucional(doc, "ANÁLISIS DE TENDENCIAS");
    
    doc.fontSize(14).font("Helvetica-Bold").text(`Historial de Solicitudes (Últimos ${mesesHistorial} meses)`);
    doc.moveDown(1);

    if (solicitudesPorMes.length > 0) {
      const chartX = 60;
      const chartY = 180;
      const chartW = 480;
      const chartH = 150;
      const maxQty = Math.max(...solicitudesPorMes.map(m => parseInt(m.cantidad)), 1);

      // Ejes
      doc.strokeColor("#cbd5e1").lineWidth(1);
      doc.moveTo(chartX, chartY).lineTo(chartX, chartY + chartH).lineTo(chartX + chartW, chartY + chartH).stroke();

      // Línea de tendencia
      doc.strokeColor("#3b82f6").lineWidth(2);
      const stepX = chartW / (solicitudesPorMes.length || 1);
      
      solicitudesPorMes.forEach((m, i) => {
        const x = chartX + (i * stepX) + (stepX / 2);
        const y = chartY + chartH - (parseInt(m.cantidad) / maxQty) * chartH;
        
        if (i === 0) doc.moveTo(x, y); else doc.lineTo(x, y);
        
        // Punto
        doc.circle(x, y, 3).fill("#3b82f6");
        
        // Etiqueta Mes
        const date = new Date(m.mes);
        const label = date.toLocaleDateString("es-ES", { month: "short" });
        doc.fillColor("#64748b").fontSize(8).text(label, x - 10, chartY + chartH + 10);
        // Valor sobre el punto
        doc.fillColor("#1e293b").fontSize(8).font("Helvetica-Bold").text(m.cantidad.toString(), x - 5, y - 12);
      });
      doc.stroke();
    }

    // Distribución por Carrera (Barras Horizontales)
    doc.moveDown(12);
    doc.fillColor("#1e293b").fontSize(14).font("Helvetica-Bold").text("Distribución por Carrera / Programa");
    doc.moveDown(0.5);

    const barStartX = 180;
    const barMaxW = 350;
    let barY = doc.y + 10;

    solicitudesPorCarreraRaw.slice(0, 8).forEach(row => {
      const label = row.carrera.length > 25 ? row.carrera.substring(0, 22) + "..." : row.carrera;
      const val = parseInt(row.cantidad);
      const width = (val / (totalSolicitudes || 1)) * barMaxW;

      doc.fillColor("#475569").fontSize(9).font("Helvetica").text(label, 40, barY + 5, { width: 130 });
      doc.rect(barStartX, barY, Math.max(width, 2), 15).fill("#60a5fa");
      doc.fillColor("#1e293b").fontSize(9).font("Helvetica-Bold").text(val.toString(), barStartX + width + 5, barY + 5);
      
      barY += 25;
    });

    // --- PÁGINA 3: INVENTARIO Y CATEGORÍAS ---
    doc.addPage();
    dibujarEncabezadoInstitucional(doc, "ANÁLISIS DE INVENTARIO");

    doc.fontSize(14).font("Helvetica-Bold").text("Distribución de Equipos por Categoría");
    doc.moveDown(1);

    const catItems = Object.entries(categorias).sort((a,b) => b[1] - a[1]);
    let catY = doc.y;

    catItems.forEach(([name, count], i) => {
      const pct = ((count / (totalEquipos || 1)) * 100).toFixed(1);
      
      doc.fillColor("#f8fafc").rect(40, catY, 520, 30).fill();
      doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(10).text(name, 55, catY + 10);
      doc.font("Helvetica").text(`${count} unidades (${pct}%)`, 400, catY + 10);
      
      doc.strokeColor("#e2e8f0").moveTo(40, catY + 30).lineTo(560, catY + 30).stroke();
      catY += 30;
    });

    // --- PÁGINA 4: USUARIOS ---
    doc.addPage();
    dibujarEncabezadoInstitucional(doc, "ANÁLISIS DE USUARIOS");

    const userStats = {
      alumnos: usuarios.filter(u => u.tipoUsuario?.Descripcion === "Alumno").length,
      profesores: usuarios.filter(u => u.tipoUsuario?.Descripcion === "Profesor").length
    };

    doc.fontSize(14).font("Helvetica-Bold").text("Distribución de Usuarios (Solicitantes)");
    doc.moveDown(1);

    const userTypes = [
      { n: "Alumnos", v: userStats.alumnos, c: "#3b82f6" },
      { n: "Profesores", v: userStats.profesores, c: "#f59e0b" }
    ];

    const totalUserStats = userStats.alumnos + userStats.profesores;
    let userY = doc.y;

    userTypes.forEach(type => {
      const pct = ((type.v / (totalUserStats || 1)) * 100).toFixed(1) + "%";
      
      doc.fillColor("#f8fafc").rect(40, userY, 520, 40).fill();
      doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(11).text(type.n, 60, userY + 15);
      doc.font("Helvetica").text(`${type.v} registrados (${pct})`, 350, userY + 15);
      
      doc.rect(60, userY + 32, (type.v / (totalUserStats || 1)) * 480, 4).fill(type.c);
      
      userY += 50;
    });

    return doc;
  } catch (error) {
    console.error("Error al generar reporte de estadísticas PDF:", error);
    throw error;
  }
}

/**
 * Función auxiliar para dibujar sectores de gráfico de torta
 */
function drawPieSlice(doc, centerX, centerY, radius, startAngle, endAngle) {
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  
  doc.moveTo(centerX, centerY);
  doc.lineTo(
    centerX + radius * Math.cos(startAngleRad),
    centerY + radius * Math.sin(startAngleRad)
  );
  
  doc.arc(centerX, centerY, radius, startAngleRad, endAngleRad, false);
  doc.lineTo(centerX, centerY);
  doc.fill();
}

/**
 * Funciones auxiliares
 */
function obtenerEstadoSolicitud(solicitud) {
  if (!solicitud.ID_Prestamo || !solicitud.prestamo) {
    return "Pendiente";
  }

  if (solicitud.prestamo.tieneEstados && solicitud.prestamo.tieneEstados.length > 0) {
    const estadosOrdenados = [...solicitud.prestamo.tieneEstados].sort(
      (a, b) => new Date(b.Fecha_Estado) - new Date(a.Fecha_Estado)
    );
    const ultimoEstado = estadosOrdenados[0];
    
    switch(ultimoEstado.Cod_Estado) {
      case 1: return "Pendiente";
      case 2: return "Listo para Entregar";
      case 3: return "Listo para recepcionar";
      case 4: return "Devuelto";
      case 5: return "Rechazado";
      default: return "Desconocido";
    }
  }
  
  return "Desconocido";
}

function obtenerEstadoPrestamo(prestamo) {
  if (prestamo.devolucion) {
    return "Devuelto";
  }

  if (prestamo.tieneEstados && prestamo.tieneEstados.length > 0) {
    const estadosOrdenados = [...prestamo.tieneEstados].sort(
      (a, b) => new Date(b.Fecha_Estado) - new Date(a.Fecha_Estado)
    );
    const ultimoEstado = estadosOrdenados[0];
    
    switch(ultimoEstado.Cod_Estado) {
      case 2: return "Listo para Entregar";
      case 3: return "Listo para recepcionar";
      case 4: return "Devuelto";
      case 5: return "Rechazado";
      default: return "En Proceso";
    }
  }
  
  return "En Proceso";
}

/**
 * Generar reporte de usuarios en PDF
 */
export async function generarReporteUsuariosPDF(filtros = {}) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    let queryBuilder = userRepository
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.tipoUsuario", "tipoUsuario")
      .leftJoinAndSelect("u.carrera", "carrera")
      .leftJoinAndSelect("u.cargo", "cargo")
      .orderBy("u.Nombre_Completo", "ASC");

    // Aplicar filtros
    if (filtros.tipoUsuario) {
      queryBuilder.andWhere("tipoUsuario.Descripcion = :tipoUsuario", { 
        tipoUsuario: filtros.tipoUsuario 
      });
    }

    const usuarios = await queryBuilder.getMany();

    // Crear PDF en LANDSCAPE
    const doc = new PDFDocument({ size: "letter", layout: "landscape", margin: 40 });

    // Encabezado
    dibujarEncabezadoInstitucional(doc, "REPORTE DE USUARIOS", true);

    // Filtros aplicados
    if (filtros.tipoUsuario) {
      doc.fontSize(9).font("Helvetica-Bold").text("Filtros aplicados:", { underline: true });
      doc.font("Helvetica").text(`Tipo de Usuario: ${filtros.tipoUsuario}`);
      doc.moveDown(0.5);
    }

    // Estadísticas
    const alumnosCount = usuarios.filter(u => u.tipoUsuario?.Descripcion === "Alumno").length;
    const profesoresCount = usuarios.filter(u => u.tipoUsuario?.Descripcion === "Profesor").length;
    const adminsCount = usuarios.filter(u => u.tipoUsuario?.Descripcion === "Administrador").length;

    doc.fontSize(11).font("Helvetica-Bold").text("Resumen:");
    doc.font("Helvetica")
      .text(`Total de Usuarios: ${usuarios.length} | Alumnos: ${alumnosCount} | Profesores: ${profesoresCount} | Administradores: ${adminsCount}`)
      .moveDown(1);

    // Configuración de la tabla
    const tableTop = doc.y;
    const colWidths = [30, 190, 85, 205, 80, 122]; // Total: 712 para landscape letter
    const colNames = ["#", "Nombre Completo", "RUT", "Email", "Tipo", "Carrera / Cargo"];
    const startX = 40;
    let currentY = tableTop;

    // Función para dibujar encabezado
    const drawHeader = (y) => {
      doc.rect(startX, y, 712, 20).fill("#f1f5f9").stroke("#cbd5e1");
      doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(9);
      
      let x = startX;
      colNames.forEach((name, i) => {
        doc.text(name, x + 5, y + 6, { width: colWidths[i] - 10, align: "left" });
        x += colWidths[i];
      });
      return y + 20;
    };

    // Dibujar primer encabezado
    currentY = drawHeader(currentY);

    // Filas de usuarios
    usuarios.forEach((usuario, index) => {
      // Calcular carrera o cargo
      const carreraOCargo = usuario.tipoUsuario?.Cod_TipoUsuario === 2 
        ? usuario.carrera?.Nombre_Carrera || "Sin carrera"
        : usuario.tipoUsuario?.Cod_TipoUsuario === 3 
        ? usuario.cargo?.Desc_Cargo || "Sin cargo"
        : "-";

      // Determinar altura necesaria (por si el texto se envuelve)
      const data = [
        (index + 1).toString(),
        usuario.Nombre_Completo || "N/A",
        usuario.Rut || "N/A",
        usuario.Correo || "N/A",
        usuario.tipoUsuario?.Descripcion || "N/A",
        carreraOCargo
      ];

      // Altura mínima de fila
      const rowHeight = 25;

      // Verificar si hay espacio en la página (Landscape: 612 height)
      if (currentY + rowHeight > 550) {
        doc.addPage({ size: "letter", layout: "landscape", margin: 40 });
        const nextY = dibujarEncabezadoInstitucional(doc, "REPORTE DE USUARIOS", true);
        currentY = drawHeader(nextY);
      }

      // Dibujar bordes de celda y texto
      doc.font("Helvetica").fontSize(8).fillColor("#334155");
      let x = startX;
      data.forEach((text, i) => {
        doc.rect(x, currentY, colWidths[i], rowHeight).stroke("#e2e8f0");
        doc.text(text, x + 5, currentY + 8, { 
          width: colWidths[i] - 10, 
          height: rowHeight - 8,
          ellipsis: true 
        });
        x += colWidths[i];
      });

      currentY += rowHeight;
    });

    return doc;
  } catch (error) {
    console.error("Error al generar reporte de usuarios PDF:", error);
    throw error;
  }
}

/**
 * Generar reporte de usuarios en CSV
 */
export async function generarReporteUsuariosCSV(filtros = {}) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    let queryBuilder = userRepository
      .createQueryBuilder("u")
      .leftJoinAndSelect("u.tipoUsuario", "tipoUsuario")
      .leftJoinAndSelect("u.carrera", "carrera")
      .leftJoinAndSelect("u.cargo", "cargo")
      .orderBy("u.Nombre_Completo", "ASC");

    if (filtros.tipoUsuario) {
      queryBuilder.andWhere("tipoUsuario.Descripcion = :tipoUsuario", { 
        tipoUsuario: filtros.tipoUsuario 
      });
    }

    const usuarios = await queryBuilder.getMany();

    // Crear CSV
    let csv = "\uFEFFRUT,Nombre Completo,Email,Tipo Usuario,Carrera/Cargo\n";
    
    usuarios.forEach(usuario => {
      const carreraOCargo = usuario.tipoUsuario?.Cod_TipoUsuario === 2 
        ? usuario.carrera?.Nombre_Carrera || "Sin carrera"
        : usuario.tipoUsuario?.Cod_TipoUsuario === 3 
        ? usuario.cargo?.Desc_Cargo || "Sin cargo"
        : "-";
      
      csv += `${usuario.Rut},`;
      csv += `"${usuario.Nombre_Completo}",`;
      csv += `${usuario.Correo},`;
      csv += `"${usuario.tipoUsuario?.Descripcion || "N/A"}",`;
      csv += `"${carreraOCargo}"\n`;
    });

    return csv;
  } catch (error) {
    console.error("Error al generar reporte de usuarios CSV:", error);
    throw error;
  }
}

/**
 * Obtener datos para gráficos
 */
export async function obtenerDatosGraficos(filtros = {}) {
  try {
    const solicitudRepository = AppDataSource.getRepository(Solicitud);
    const prestamoRepository = AppDataSource.getRepository(Prestamo);
    const equiposRepository = AppDataSource.getRepository(Equipos);
    const userRepository = AppDataSource.getRepository(User);

    // Solicitudes por estado
    const solicitudes = await solicitudRepository
      .createQueryBuilder("solicitud")
      .leftJoinAndSelect("solicitud.prestamo", "prestamo")
      .leftJoinAndSelect("prestamo.tieneEstados", "tieneEstados")
      .leftJoinAndSelect("tieneEstados.estadoPrestamo", "estadoPrestamo")
      .getMany();

    const solicitudesPorEstado = {
      pendientes: 0,
      listoParaEntregar: 0,
      entregados: 0,
      devueltos: 0,
      rechazados: 0
    };

    solicitudes.forEach(sol => {
      const estado = obtenerEstadoSolicitud(sol);
      if (estado === "Pendiente") solicitudesPorEstado.pendientes++;
      else if (estado === "Listo para Entregar") solicitudesPorEstado.listoParaEntregar++;
      else if (estado === "Listo para recepcionar") solicitudesPorEstado.entregados++;
      else if (estado === "Devuelto") solicitudesPorEstado.devueltos++;
      else if (estado === "Rechazado") solicitudesPorEstado.rechazados++;
    });

    // Solicitudes por tipo
    const solicitudesPorTipo = {
      diarias: 0,
      largoPlazo: 0
    };

    solicitudes.forEach(sol => {
      if (sol.Fecha_inicio_sol && sol.Fecha_termino_sol) {
        solicitudesPorTipo.largoPlazo++;
      } else {
        solicitudesPorTipo.diarias++;
      }
    });

    // Equipos por categoría
    const equipos = await equiposRepository
      .createQueryBuilder("equipo")
      .leftJoinAndSelect("equipo.categoria", "categoria")
      .getMany();

    const equiposPorCategoria = {};
    equipos.forEach(eq => {
      const categoria = eq.categoria?.Descripcion || "Sin categoría";
      equiposPorCategoria[categoria] = (equiposPorCategoria[categoria] || 0) + 1;
    });

    // Usuarios por tipo
    const usuarios = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.tipoUsuario", "tipoUsuario")
      .getMany();

    const usuariosPorTipo = {
      alumnos: 0,
      profesores: 0
    };

    usuarios.forEach(user => {
      const tipo = user.tipoUsuario?.Descripcion;
      if (tipo === "Alumno") usuariosPorTipo.alumnos++;
      else if (tipo === "Profesor") usuariosPorTipo.profesores++;
    });

    // Solicitudes por mes (rango dinámico)
    const meses = filtros.meses || 6;
    const d = new Date();
    d.setMonth(d.getMonth() - meses);
    d.setDate(1);

    const solicitudesPorMes = await solicitudRepository
      .createQueryBuilder("solicitud")
      .select("DATE_TRUNC('month', solicitud.Fecha_Sol)", "mes")
      .addSelect("COUNT(*)", "cantidad")
      .where("solicitud.Fecha_Sol >= :fecha", { fecha: d })
      .groupBy("DATE_TRUNC('month', solicitud.Fecha_Sol)")
      .orderBy("DATE_TRUNC('month', solicitud.Fecha_Sol)", "ASC")
      .getRawMany();

    // Solicitudes por carrera
    const solicitudesPorCarreraRaw = await solicitudRepository
      .createQueryBuilder("solicitud")
      .leftJoin("solicitud.usuario", "usuario")
      .leftJoin("usuario.carrera", "carrera")
      .select("carrera.Nombre_Carrera", "carrera")
      .addSelect("COUNT(*)", "cantidad")
      .groupBy("carrera.Nombre_Carrera")
      .getRawMany();

    const solicitudesPorCarrera = {};
    solicitudesPorCarreraRaw.forEach(row => {
      const nombre = row.carrera || "Personal/Docente";
      solicitudesPorCarrera[nombre] = parseInt(row.cantidad);
    });

    return {
      solicitudesPorEstado,
      solicitudesPorTipo,
      equiposPorCategoria,
      usuariosPorTipo,
      solicitudesPorMes,
      solicitudesPorCarrera
    };
  } catch (error) {
    console.error("Error al obtener datos para gráficos:", error);
    throw error;
  }
}
