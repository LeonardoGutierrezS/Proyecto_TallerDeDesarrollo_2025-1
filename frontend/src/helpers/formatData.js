import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatUserData(user) {
    return {
        ...user,
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}

// Exportar formatRut directamente para uso en otros componentes
export { formatRut };

// Función para formatear fechas sin problemas de zona horaria
export function formatFecha(fecha) {
    if (!fecha) return '';
    try {
        // Si la fecha viene solo con formato YYYY-MM-DD, agregar tiempo para evitar conversión de zona horaria
        const fechaStr = typeof fecha === 'string' && !fecha.includes('T') ? fecha + 'T00:00:00' : fecha;
        const fechaLocal = new Date(fechaStr);
        
        return fechaLocal.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

// Función para formatear fechas en formato DD-MM-YYYY (compatibilidad con código existente)
export function formatFechaCorta(fecha) {
    if (!fecha) return '';
    return formatTempo(fecha, "DD-MM-YYYY");
}

// Función para formatear fechas con hora sin problemas de zona horaria
export function formatFechaHora(fecha) {
    if (!fecha) return '';
    try {
        const fechaLocal = new Date(fecha);
        return fechaLocal.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

export function convertirMinusculas(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase();
        }
    }
    return obj;
}

export function formatPostUpdate(user) {
    return {
        nombreCompleto: startCase(user.nombreCompleto),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        email: user.email,
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}

export function formatEquipoData(equipo) {
    return {
        ...equipo,
        marca: equipo.marca?.nombre || 'Sin marca',
        categoria: equipo.categoria?.nombre || 'Sin categoría',
        estadoAltaBaja: equipo.estadoAltaBaja?.nombre || 'Sin estado',
        fechaAltaLab: equipo.fechaAltaLab ? formatTempo(equipo.fechaAltaLab, "DD-MM-YYYY") : 'No definida',
        fechaBajaLab: equipo.fechaBajaLab ? formatTempo(equipo.fechaBajaLab, "DD-MM-YYYY") : 'Activo'
    };
}