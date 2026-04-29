package com.example.pitapp.core.devicepolicy


import java.time.ZoneId
import java.util.TimeZone

/**
 * ─── Configuración centralizada de zona horaria ───
 *
 * Toda la lógica de horarios de la app (sesiones, clases, conteos) se basa en
 * UNA sola zona horaria canónica.  Si en el futuro el IPN necesita soportar otra
 * zona (p.ej. un campus en Cancún → "America/Cancun", UTC-5 fijo), basta con:
 *
 *   1. Cambiar [CANONICAL_ZONE_ID] a la nueva zona.
 *   2. Agregar la nueva zona a [VALID_ZONE_IDS].
 *   3. Recompilar.  Toda la lógica de Calendar / ZoneId se actualiza sola.
 *
 * ─── Zonas válidas actuales ───
 *
 * Todas comparten UTC-6 estándar (la mayoría sin horario de verano desde 2022,
 * excepto las zonas fronterizas como Matamoros que siguen el DST de EE.UU.):
 *
 *   • America/Mexico_City   — Centro (CDMX, Puebla, Oaxaca…)
 *   • America/Monterrey     — Noreste (NL, Coahuila, Tamaulipas interior)
 *   • America/Merida        — Sureste (Yucatán, Campeche, Q. Roo antes de 2015)
 *   • America/Bahia_Banderas— Jalisco / Nayarit
 *   • America/Matamoros      — Frontera noreste (sigue DST de EE.UU.)
 *
 * Nota: America/Cancun (Quintana Roo) es UTC-5 fijo, NO se incluye porque
 *       difiere en 1 hora y rompería la lógica de sesiones.
 */

/** Zona horaria canónica utilizada para TODOS los cálculos de horario. */
const val CANONICAL_ZONE_ID = "America/Mexico_City"

/** Conjunto de zonas horarias aceptadas por la política del dispositivo. */
val VALID_ZONE_IDS: Set<String> = setOf(
    "America/Mexico_City",
    "America/Monterrey",
    "America/Merida",
    "America/Bahia_Banderas",
    "America/Matamoros"
)

/** [TimeZone] canónica para usar con [java.util.Calendar]. */
fun canonicalTimeZone(): TimeZone = TimeZone.getTimeZone(CANONICAL_ZONE_ID)

/** [ZoneId] canónica para usar con java.time (LocalDate, ZonedDateTime, etc.). */
fun canonicalZoneId(): ZoneId = ZoneId.of(CANONICAL_ZONE_ID)
