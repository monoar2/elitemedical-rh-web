-- Migration: Create table to persist employee vacation metrics
-- Date: 2025-08-18
-- Purpose:
--   Persist all vacation-related metrics that are currently calculated on the fly in the admin dashboard
--   so backend can manage them directly. This script creates a dedicated table with a 1:1 relationship
--   to empleados to store these values.
--
-- Assumptions:
--   - There is an existing table `empleados` with primary key `id` (BIGINT/INT).
--   - There may be an existing table `vacaciones` with columns: id, empleado_id, fecha_inicio, fecha_fin, estatus.
--   - Choose the section below that matches your RDBMS (MySQL or PostgreSQL) and run it.
--
-- Notes:
--   - Column names use snake_case to be database-friendly; map them in your backend as needed.
--   - If you prefer adding columns directly to `empleados` instead of a new table, see the commented
--     alternative ALTER TABLE section at the end.

/* ==========================
   MySQL / MariaDB SECTION
   ========================== */
-- Uncomment to use with MySQL / MariaDB
--
CREATE TABLE IF NOT EXISTS empleado_vacaciones_metricas (
  empleado_id BIGINT NOT NULL,
  dias_trabajados INT NOT NULL DEFAULT 0,
  anos_trabajados INT NOT NULL DEFAULT 0,
  meses_trabajados INT NOT NULL DEFAULT 0,
  dias_vacaciones INT NOT NULL DEFAULT 0,
  dias_proporcionales INT NOT NULL DEFAULT 0,
  dias_tomados INT NOT NULL DEFAULT 0,
  dias_disponibles INT NOT NULL DEFAULT 0,
  dias_acumulados INT NOT NULL DEFAULT 0,
  ultima_actualizacion TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (empleado_id),
  CONSTRAINT fk_empleado_vac_metrics_emp
    FOREIGN KEY (empleado_id) REFERENCES empleado(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
--
-- -- Optional: seed rows for existing employees (ensures 1:1 row exists)
INSERT INTO empleado_vacaciones_metricas (empleado_id)
SELECT e.id FROM empleado e
LEFT JOIN empleado_vacaciones_metricas m ON m.empleado_id = e.id
WHERE m.empleado_id IS NULL;
--
-- -- Optional backfill for dias_tomados from approved vacations (if schema matches)
-- -- This assumes vacaciones.estatus = 'APROBADA' and inclusive date difference is desired (+1 day)
UPDATE empleado_vacaciones_metricas m
JOIN (
  SELECT v.empleado_id,
         COALESCE(SUM(DATEDIFF(v.fecha_fin, v.fecha_inicio) + 1), 0) AS dias_tomados
  FROM vacacion v
  WHERE v.estatus = 1
  GROUP BY v.empleado_id
) t ON t.empleado_id = m.empleado_id
SET m.dias_tomados = t.dias_tomados,
    m.ultima_actualizacion = NOW();

