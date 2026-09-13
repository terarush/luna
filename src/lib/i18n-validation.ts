import { tl } from "@/lib/i18n"

/**
 * Reusable validation message getters shared by all zod schemas.
 * Function-form zod messages evaluate at parse time, so they always
 * reflect the current locale — no schema rebuild needed on switch.
 */
export const validation = {
  required: () => tl("common.validation.required"),
  invalidEmail: () => tl("common.validation.invalidEmail"),
  minLength: (min: number) => tl("common.validation.minLength", { min }),
  maxLength: (max: number) => tl("common.validation.maxLength", { max }),
  minValue: (min: number) => tl("common.validation.minValue", { min }),
  maxValue: (max: number) => tl("common.validation.maxValue", { max }),
  positiveNumber: () => tl("common.validation.positiveNumber"),
  invalidFormat: () => tl("common.validation.invalidFormat"),
  mustSelect: () => tl("common.validation.mustSelect"),
  passwordLower: () => tl("common.validation.passwordLower"),
  passwordUpper: () => tl("common.validation.passwordUpper"),
  passwordNumber: () => tl("common.validation.passwordNumber"),
  passwordSymbol: () => tl("common.validation.passwordSymbol"),
  passwordMin: () => tl("common.validation.passwordMin"),
  passwordsDontMatch: () => tl("common.validation.passwordsDontMatch"),
  invalidCharacters: () => tl("common.validation.invalidCharacters"),
}