-- Migración para agregar el campo Aprobado a la tabla usuario
-- Este campo diferencia entre usuarios pendientes de aprobación y usuarios desactivados

-- Agregar la columna Aprobado (por defecto true para usuarios existentes)
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS "Aprobado" BOOLEAN NOT NULL DEFAULT true;

-- Actualizar usuarios existentes:
-- Los que tienen Vigente = false Y fueron creados hace poco (últimas 24 horas) son pendientes
-- Los demás que tienen Vigente = false son desactivados (ya fueron aprobados antes)
-- Por seguridad, marcamos todos los existentes como aprobados
UPDATE usuario SET "Aprobado" = true WHERE "Aprobado" IS NULL;

-- Comentario de la columna
COMMENT ON COLUMN usuario."Aprobado" IS 'Indica si el usuario ha sido aprobado por el administrador. Diferente de Vigente que indica si está activo.';
