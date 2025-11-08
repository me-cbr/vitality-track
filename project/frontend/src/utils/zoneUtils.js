// <NEW FILE> Zone color and name utilities - centralized zone handling for consistency
import { colors } from "../theme/colors"

/**
 * Get zone color by zone number (1-5)
 * Safe version that handles null/undefined/non-numeric values
 * @param {number} zoneNum - Zone number (1-5)
 * @returns {string} - Hex color code
 */
export const getZoneColorByNumber = (zoneNum) => {
  if (!zoneNum || typeof zoneNum !== "number") return colors.primary
  if (zoneNum === 1) return colors.zone1
  if (zoneNum === 2) return colors.zone2
  if (zoneNum === 3) return colors.zone3
  if (zoneNum === 4) return colors.zone4
  if (zoneNum === 5) return colors.zone5
  return colors.primary
}

/**
 * Get zone color by zone string (contains "Zona 1", etc.)
 * Safe version that handles null/undefined/non-string values
 * @param {string} zoneStr - Zone string (e.g. "Zona 1", "Zona 4 - Anaeróbica")
 * @returns {string} - Hex color code
 */
export const getZoneColorByString = (zoneStr) => {
  if (!zoneStr || typeof zoneStr !== "string") return colors.primary
  if (zoneStr.includes("1")) return colors.zone1
  if (zoneStr.includes("2")) return colors.zone2
  if (zoneStr.includes("3")) return colors.zone3
  if (zoneStr.includes("4")) return colors.zone4
  if (zoneStr.includes("5")) return colors.zone5
  return colors.primary
}

/**
 * Get zone name by zone number
 * @param {number} zoneNum - Zone number (1-5)
 * @returns {string} - Zone name in Portuguese
 */
export const getZoneNameByNumber = (zoneNum) => {
  const zones = {
    1: "Recuperação",
    2: "Aeróbica",
    3: "Tempo",
    4: "Anaeróbica",
    5: "VO2 Max",
  }
  return zones[zoneNum] || "Desconhecida"
}

/**
 * Get zone number from string
 * @param {string} zoneStr - Zone string (e.g. "Zona 1", "Zona 4 - Anaeróbica")
 * @returns {number} - Zone number (1-5) or null
 */
export const getZoneNumberFromString = (zoneStr) => {
  if (!zoneStr || typeof zoneStr !== "string") return null
  const match = zoneStr.match(/\d/)
  return match ? Number.parseInt(match[0]) : null
}

/**
 * Get zone intensity level by zone number
 * @param {number} zoneNum - Zone number (1-5)
 * @returns {string} - Intensity level
 */
export const getZoneIntensity = (zoneNum) => {
  const intensities = {
    1: "Leve",
    2: "Moderada",
    3: "Média-Alta",
    4: "Alta",
    5: "Muito Alta",
  }
  return intensities[zoneNum] || "Desconhecida"
}
