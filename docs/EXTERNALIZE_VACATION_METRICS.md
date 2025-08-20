# Externalizing Vacation Metrics Calculation (Frontend -> Backend)

This document explains how to migrate the calculation of vacation-related metrics from the frontend to the backend, to be computed by a scheduled cron job and stored in the database. The frontend will stop calculating values and will only display precomputed fields delivered by the API.

This guide is designed to be handed to the backend engineer and used by the frontend engineer to refactor the UI.


## 1) Current State (Frontend)

In `src/views/HRDashboard.vue`, the employee data table renders several columns using helper methods that compute values on the fly:

- diasTrabajados → calculateDaysWorked(item.fechaDeAlta)
- anosTrabajados → calculateYearsWorked(item.fechaDeAlta)
- mesesTrabajados → calculateMonthsWorked(item.fechaDeAlta)
- diasVacaciones → calculateVacationDays(item.fechaDeAlta)
- diasProporcionales → calculateProportionalDays(item.fechaDeAlta)
- diasTomados → calculateDaysTaken(item.id)
- diasDisponibles → calculateAvailableDays(item.fechaDeAlta, calculateDaysTaken(item.id))
- diasAcumulados → calculateAccumulatedDays(item.fechaDeAlta, calculateDaysTaken(item.id))

There is also a shared service `src/services/vacationCalculator.js` with calculation utilities and `calculateVacationMetrics`.

We want to remove these frontend calculations and replace them with simple display of stored values provided by the backend.


## 2) Target Data Model (Backend Persistence)

A migration has already been added to persist metrics per employee:

- File: `db/migrations/2025-08-18_add_empleado_vacaciones_metricas.sql`
- Table: `empleado_vacaciones_metricas` (1:1 with `empleados`)
- Columns:
  - empleado_id (PK, FK empleados.id)
  - dias_trabajados INT
  - anos_trabajados INT
  - meses_trabajados INT
  - dias_vacaciones INT
  - dias_proporcionales INT
  - dias_tomados INT
  - dias_disponibles INT
  - dias_acumulados INT
  - ultima_actualizacion TIMESTAMP

Notes:
- The script includes MySQL and PostgreSQL variants, optional seeding, and optional backfill for dias_tomados from approved vacations.
- If preferred, these columns can alternatively be added directly to `empleados` (see bottom of the migration file), but a separate table is recommended for clarity and update isolation.


## 3) Backend Responsibilities (Cron + API)

### 3.1 Cron Job
Implement a scheduled task (e.g., hourly or nightly) that:
- Iterates over active employees (and optionally former employees).
- Computes all metrics deterministically using your canonical business rules (see §3.3 for rules and edge cases).
- Updates `empleado_vacaciones_metricas` for each `empleado_id`.
- Sets `ultima_actualizacion` to the computation timestamp.

Trigger recalculation also when:
- A vacation request is created/approved/rejected/cancelled.
- An employee’s `fecha_de_alta` or `fecha_de_baja` changes.
- Policy changes (e.g., vacation days by tenure) are deployed.

### 3.2 API Contract
Expose the employee list endpoint to include precomputed metrics. Two common approaches:

A) Flattened fields on the employee JSON (recommended for current UI):
```
GET /api/empleados
[
  {
    "id": 123,
    "nombre": "Ana",
    "apellidoPaterno": "López",
    "apellidoMaterno": "García",
    "correo": "ana@example.com",
    "telefono": "555-1234",
    "fechaDeAlta": "2021-03-15",
    "fechaDeBaja": null,

    "diasTrabajados": 900,
    "anosTrabajados": 2,
    "mesesTrabajados": 5,
    "diasVacaciones": 14,
    "diasProporcionales": 10,
    "diasTomados": 6,
    "diasDisponibles": 8,
    "diasAcumulados": 18,
    "ultimaActualizacion": "2025-08-20T01:15:00Z"
  },
  ...
]
```

B) Nested metrics object (cleaner domain model, requires minor FE mapping):
```
{
  ...empleadoFields,
  "vacaciones": {
    "diasTrabajados": 900,
    "anosTrabajados": 2,
    "mesesTrabajados": 5,
    "diasVacaciones": 14,
    "diasProporcionales": 10,
    "diasTomados": 6,
    "diasDisponibles": 8,
    "diasAcumulados": 18,
    "ultimaActualizacion": "2025-08-20T01:15:00Z"
  }
}
```

To make FE changes minimal, prefer A) Flattened.

Field naming: Provide camelCase in the API for Vue, but persist snake_case in DB. The mapping is straightforward (e.g., `empleado_vacaciones_metricas.dias_disponibles` → `diasDisponibles`).

### 3.3 Business Rules and Edge Cases
- Days worked = inclusive difference between today and `fecha_de_alta`. Decide whether to include the start day; current FE implementation uses Math.floor difference in days (exclusive). Document the policy and stick to it.
- Years worked and months worked are approximations in the current FE (365/30). If you need precise calendar months/years, compute via date libraries in the backend and update expectations; otherwise keep parity with FE for consistent numbers on rollout.
- Vacation days by tenure: backend should own the canonical table (policy). A simplified set exists in FE; replace with authoritative policy and emit a version if needed.
- Proportional days: current FE uses floor((vacationDays / 12) * monthsWorked), with a special case returning `monthsWorked` when `vacationDays === 0`. Reconfirm and document.
- Days taken: sum of approved vacations; decide inclusive date count (+1) and whether to exclude weekends/holidays.
- Available days = max(0, vacationDays - daysTaken) in FE. Confirm with policy.
- Accumulated days = proportionalDays + availableDays.
- Handle `fecha_de_baja`: define whether metrics freeze at termination date.
- Timezone: compute dates in a consistent TZ (e.g., system TZ or UTC) to avoid off-by-one around midnight.

### 3.4 Example SQL Backfill Snippet (MySQL)
```
UPDATE empleado_vacaciones_metricas m
JOIN (
  SELECT v.empleado_id,
         COALESCE(SUM(DATEDIFF(v.fecha_fin, v.fecha_inicio) + 1), 0) AS dias_tomados
  FROM vacaciones v
  WHERE v.estatus = 'APROBADA'
  GROUP BY v.empleado_id
) t ON t.empleado_id = m.empleado_id
SET m.dias_tomados = t.dias_tomados,
    m.ultima_actualizacion = NOW();
```
Use equivalent for PostgreSQL (see migration file).


## 4) Frontend Refactor (Display Only)

Goal: Remove calculation logic and display server-provided values. Keep headers as-is. Replace `v-slot` templates.

Minimal diff approach (Flattened API fields):

- Replace these slots in `src/views/HRDashboard.vue`:
```
<template v-slot:item.diasTrabajados="{ item }">{{ item.diasTrabajados ?? 0 }}</template>
<template v-slot:item.anosTrabajados="{ item }">{{ item.anosTrabajados ?? 0 }}</template>
<template v-slot:item.mesesTrabajados="{ item }">{{ item.mesesTrabajados ?? 0 }}</template>
<template v-slot:item.diasVacaciones="{ item }">{{ item.diasVacaciones ?? 0 }}</template>
<template v-slot:item.diasProporcionales="{ item }">{{ item.diasProporcionales ?? 0 }}</template>
<template v-slot:item.diasTomados="{ item }">{{ item.diasTomados ?? 0 }}</template>
<template v-slot:item.diasDisponibles="{ item }">{{ item.diasDisponibles ?? 0 }}</template>
<template v-slot:item.diasAcumulados="{ item }">{{ item.diasAcumulados ?? 0 }}</template>
```

- Remove the following methods from the `methods` section, and any imports from `src/services/vacationCalculator.js`:
  - calculateDaysWorked
  - calculateYearsWorked
  - calculateMonthsWorked
  - calculateVacationDays
  - calculateProportionalDays
  - calculateAvailableDays
  - calculateAccumulatedDays
  - calculateDaysTaken

- Ensure the source of `employees` is the API that now returns the flattened metric fields. If metrics might be temporarily missing during rollout, use the `?? 0` fallback as above.

- Keep headers (`employeeHeaders`) unchanged; they already reference the desired keys.

Optional (if API uses nested `vacaciones` object):
```
<template v-slot:item.diasTrabajados="{ item }">{{ item.vacaciones?.diasTrabajados ?? 0 }}</template>
... etc for the remaining fields ...
```


## 5) Transition Strategy

- Backend-first: Deploy DB migration and backend changes, then enable API response fields. Once API is verified, deploy FE change to switch to display-only.
- Feature flag (optional): FE can detect presence of `diasTrabajados` (or `item.vacaciones`) and fall back to old calculation temporarily. Example:
```
{{ item.diasTrabajados ?? calculateDaysWorked(item.fechaDeAlta) }}
```
Then remove the fallback after backend is fully live.

- Data recency: Consider showing `ultimaActualizacion` in UI (a tooltip/icon) if data is not real-time.


## 6) Testing & Validation

- Unit test backend calculators and date edge cases (leap years, boundaries, timezone).
- Integration test API: known fixtures of employees with vacations yield expected metrics.
- FE smoke test: Table renders metrics correctly without JS calculation services; check sorting/searching.
- Compare sampled employees between old FE calculations and backend results to ensure parity, or document intended differences (e.g., inclusive counting rules).


## 7) Rollout & Maintenance

- Schedule: nightly recalculation is typically sufficient; increase frequency around policy changes.
- Observability: log cron runs, number of rows updated, and anomalies (e.g., negative days).
- Backfills: run the optional `dias_tomados` backfill as part of initial deployment.
- Policy versioning: consider storing the policy version used to compute metrics to support audits.


## 8) Quick Checklist

Backend:
- [ ] Apply migration to create `empleado_vacaciones_metricas`.
- [ ] Implement calculation service and cron/signal triggers.
- [ ] Expose flattened metric fields in `GET /api/empleados` (or nested `vacaciones`).
- [ ] Backfill `dias_tomados` and initial metrics.

Frontend:
- [ ] Replace `v-slot` templates to display API-provided fields.
- [ ] Remove calculation methods and service imports.
- [ ] Optional: temporary fallback via nullish coalescing during rollout.


## Appendix A: Mapping DB ↔ API ↔ UI

- DB: `empleado_vacaciones_metricas.dias_trabajados`
- API (camelCase): `diasTrabajados`
- UI header key: `diasTrabajados`

Repeat for: `anos_trabajados` → `anosTrabajados`, `meses_trabajados` → `mesesTrabajados`, `dias_vacaciones` → `diasVacaciones`, `dias_proporcionales` → `diasProporcionales`, `dias_tomados` → `diasTomados`, `dias_disponibles` → `diasDisponibles`, `dias_acumulados` → `diasAcumulados`, `ultima_actualizacion` → `ultimaActualizacion`.


## Appendix B: Reference (Current FE Calculator Behavior)

See `src/services/vacationCalculator.js` for the existing formulas. If parity is desired at rollout time, ensure backend replicates these formulas, including:
- Years = floor(daysWorked / 365), months = floor((daysWorked % 365) / 30)
- Proportional = `vacationDays === 0 ? monthsWorked : floor((vacationDays / 12) * monthsWorked)`
- Available = max(0, vacationDays - daysTaken)
- Accumulated = proportional + available

Once backend is the single source of truth, the FE service can be deleted.
