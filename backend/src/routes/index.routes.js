"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoriaRoutes from "./categoria.routes.js";
import equipoRoutes from "./equipo.routes.js";
import estadoAltaBajaRoutes from "./estadoAltaBaja.routes.js";
import estadoPrestamoRoutes from "./estadoPrestamo.routes.js";
import horaDisponibleRoutes from "./horaDisponible.routes.js";
import marcaRoutes from "./marca.routes.js";
import prestamoRoutes from "./prestamo.routes.js";
import tipoDocumentoRoutes from "./tipoDocumento.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/categoria", categoriaRoutes)
    .use("/equipo", equipoRoutes)
    .use("/estado-alta-baja", estadoAltaBajaRoutes)
    .use("/estado-prestamo", estadoPrestamoRoutes)
    .use("/horas-disponibles", horaDisponibleRoutes)
    .use("/marca", marcaRoutes)
    .use("/prestamo", prestamoRoutes)
    .use("/tipo-documento", tipoDocumentoRoutes)
    .use("/user", userRoutes);

export default router;