"use strict";
import passport from "passport";
import User from "../entity/user.entity.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { AppDataSource } from "../config/configDb.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: {
          Correo: jwt_payload.email,
        },
        relations: ["rol", "carrera"],
      });

      if (user) {
        // Crear objeto con la estructura esperada por los middlewares
        const userPayload = {
          id: user.ID_Usuario,
          email: user.Correo,
          rut: user.Rut,
          nombreCompleto: user.Nombre_Completo,
          rol: user.rol?.Rol,
          carrera: user.carrera?.Nombre_Carrera,
          vigente: user.Vigente,
        };
        return done(null, userPayload);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }),
);

export function passportJwtSetup() {
  passport.initialize();
}
