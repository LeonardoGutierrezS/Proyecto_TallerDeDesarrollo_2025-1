import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";

export function formatUserData(user) {
    // Extraer nombre de la carrera
    let nombreCarrera = 'Sin carrera';
    if (user.carrera) {
        if (typeof user.carrera === 'object' && user.carrera.Nombre_Carrera) {
            nombreCarrera = user.carrera.Nombre_Carrera;
        } else if (typeof user.carrera === 'string') {
            nombreCarrera = user.carrera;
        }
    }

    // Extraer tipo de usuario
    let tipoUsuarioDesc = 'Sin tipo';
    if (user.tipoUsuario) {
        if (typeof user.tipoUsuario === 'object' && user.tipoUsuario.Descripcion) {
            tipoUsuarioDesc = user.tipoUsuario.Descripcion;
        } else if (typeof user.tipoUsuario === 'string') {
            tipoUsuarioDesc = user.tipoUsuario;
        }
    }

    return {
        nombreCompleto: startCase(user.Nombre_Completo || user.nombreCompleto),
        rut: formatRut(user.Rut || user.rut),
        email: user.Correo || user.email,
        tipoUsuario: tipoUsuarioDesc,
        codTipoUsuario: user.Cod_TipoUsuario || user.codTipoUsuario,
        carrera: nombreCarrera,
        idCarrera: user.ID_Carrera || user.idCarrera,
        vigente: user.Vigente !== undefined ? user.Vigente : user.vigente,
        createdAt: user.createdAt || new Date().toISOString()
    };
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
        ...user,
        nombreCompleto: startCase(user.Nombre_Completo || user.nombreCompleto),
        tipoUsuario: user.tipoUsuario?.Descripcion || 'Sin tipo',
        codTipoUsuario: user.Cod_TipoUsuario || user.codTipoUsuario,
        carrera: user.carrera?.Nombre_Carrera || user.carrera || 'Sin carrera',
        idCarrera: user.ID_Carrera || user.idCarrera,
        rut: formatRut(user.Rut || user.rut),
        email: user.Correo || user.email,
        vigente: user.Vigente !== undefined ? user.Vigente : user.vigente,
        createdAt: user.createdAt || new Date().toISOString()
    };
}