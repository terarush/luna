import * as React from "react"
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from "@mui/material"
import { palette, typography, shape, shadows, components, darkModeCssOverrides } from "./theme-config"

type Mode = "light" | "dark" | "system"

interface MuiThemeContextProps {
  mode: Mode
  setMode: (mode: Mode) => void
  resolvedMode: "light" | "dark"
}

const MuiThemeContext = React.createContext<MuiThemeContextProps>({
  mode: "system",
  setMode: () => {},
  resolvedMode: "light",
})

export function useMuiTheme() {
  return React.useContext(MuiThemeContext)
}

function getSystemMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolveMode(mode: Mode): "light" | "dark" {
  return mode === "system" ? getSystemMode() : mode
}

const STORAGE_KEY = "luna-mui-theme-mode"

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<Mode>(() => {
    if (typeof window === "undefined") return "system"
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system"
  })
  const [resolvedMode, setResolvedMode] = React.useState<"light" | "dark">(() =>
    resolveMode(mode)
  )

  const applyMode = React.useCallback((resolved: "light" | "dark") => {
    const root = document.documentElement
    root.classList.toggle("dark", resolved === "dark")
    root.style.colorScheme = resolved
  }, [])

  React.useEffect(() => {
    applyMode(resolvedMode)
  }, [resolvedMode, applyMode])

  React.useEffect(() => {
    if (mode !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => setResolvedMode(getSystemMode())
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [mode])

  const setMode = React.useCallback((newMode: Mode) => {
    localStorage.setItem(STORAGE_KEY, newMode)
    setModeState(newMode)
    setResolvedMode(resolveMode(newMode))
  }, [])

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { mode: resolvedMode, ...palette[resolvedMode] },
        typography,
        shape,
        shadows,
        components,
      }),
    [resolvedMode]
  )

  return (
    <MuiThemeContext.Provider value={{ mode, setMode, resolvedMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={darkModeCssOverrides} />
        {children}
      </ThemeProvider>
    </MuiThemeContext.Provider>
  )
}