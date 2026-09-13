import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const LOCALES_DIR = join(process.cwd(), "src/locales")
const SRC_DIR = join(process.cwd(), "src")
const LANG_DIRS = ["en", "id"]

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, acc)
    else if (/\.(ts|tsx)$/.test(entry)) acc.push(full)
  }
  return acc
}

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === "object") Object.assign(out, flatten(v as Record<string, unknown>, key))
    else out[key] = String(v)
  }
  return out
}

function loadLocale(lang: string): Record<string, string> {
  const merged: Record<string, unknown> = {}
  const dir = join(LOCALES_DIR, lang)
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    Object.assign(merged, JSON.parse(readFileSync(join(dir, file), "utf8")))
  }
  return flatten(merged)
}

function extractUsedKeys(): Set<string> {
  const keys = new Set<string>()
  const re = /\b[lt]\(["']([a-z]+\.[a-zA-Z0-9_.]+)["']/g
  for (const file of walk(SRC_DIR).filter((f) => !f.includes("/locales/"))) {
    const src = readFileSync(file, "utf8")
    for (const m of src.matchAll(re)) keys.add(m[1])
  }
  return keys
}

describe("i18n locale parity", () => {
  const en = loadLocale("en")
  const id = loadLocale("id")
  const usedKeys = extractUsedKeys()

  it("en and id have identical key sets", () => {
    const enKeys = Object.keys(en).sort()
    const idKeys = Object.keys(id).sort()
    expect(idKeys).toEqual(enKeys)
  })

  it("every used t()/tl() key is defined in en", () => {
    const missing = [...usedKeys].filter((k) => !(k in en)).sort()
    expect(missing).toEqual([])
  })

  it("every used t()/tl() key is defined in id", () => {
    const missing = [...usedKeys].filter((k) => !(k in id)).sort()
    expect(missing).toEqual([])
  })

  it("no empty values in any locale", () => {
    const empty: string[] = []
    for (const [lang, map] of Object.entries({ en, id })) {
      for (const [k, v] of Object.entries(map)) {
        if (!v.trim()) empty.push(`${lang}.${k}`)
      }
    }
    expect(empty).toEqual([])
  })

  for (const lang of LANG_DIRS) {
    it(`${lang} has no duplicate top-level namespaces`, () => {
      const merged: Record<string, unknown> = {}
      const dir = join(LOCALES_DIR, lang)
      const nsOwners: Record<string, string> = {}
      for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
        const content = JSON.parse(readFileSync(join(dir, file), "utf8")) as Record<string, unknown>
        for (const ns of Object.keys(content)) {
          if (nsOwners[ns]) throw new Error(`namespace "${ns}" defined in both ${nsOwners[ns]} and ${file}`)
          nsOwners[ns] = file
          Object.assign(merged, content)
        }
      }
      expect(flatten(merged)).toEqual(loadLocale(lang))
    })
  }

  it("uses t() keys that actually exist (no raw-key leakage)", () => {
    const leaked = [...usedKeys].filter((k) => k in en)
    expect(leaked.length).toBe(usedKeys.size)
  })
})