import type { ThemeOptions } from "@mui/material/styles"

export const palette = {
  light: {
    primary: { main: "#09090b", light: "#27272a", dark: "#09090b", contrastText: "#fafafa" },
    secondary: { main: "#71717a", light: "#a1a1aa", dark: "#52525b", contrastText: "#ffffff" },
    error: { main: "#dc2626", light: "#ef4444", dark: "#b91c1c", contrastText: "#ffffff" },
    warning: { main: "#d97706", light: "#f59e0b", dark: "#b45309", contrastText: "#ffffff" },
    info: { main: "#2563eb", light: "#3b82f6", dark: "#1d4ed8", contrastText: "#ffffff" },
    success: { main: "#16a34a", light: "#22c55e", dark: "#15803d", contrastText: "#ffffff" },
    background: { default: "#fafafa", paper: "#ffffff" },
    text: { primary: "#09090b", secondary: "#71717a", disabled: "#a1a1aa" },
    divider: "#e4e4e7",
  },
  dark: {
    primary: { main: "#fafafa", light: "#fafafa", dark: "#d4d4d8", contrastText: "#09090b" },
    secondary: { main: "#a1a1aa", light: "#d4d4d8", dark: "#71717a", contrastText: "#09090b" },
    error: { main: "#ef4444", light: "#f87171", dark: "#dc2626", contrastText: "#ffffff" },
    warning: { main: "#f59e0b", light: "#fbbf24", dark: "#d97706", contrastText: "#09090b" },
    info: { main: "#3b82f6", light: "#60a5fa", dark: "#2563eb", contrastText: "#ffffff" },
    success: { main: "#22c55e", light: "#4ade80", dark: "#16a34a", contrastText: "#09090b" },
    background: { default: "#09090b", paper: "#ffffff14" },
    text: { primary: "#fafafa", secondary: "#a1a1aa", disabled: "#52525b" },
    divider: "rgba(255,255,255,0.12)",
  },
}

export const typography = {
  fontFamily: '"Geist Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: { fontWeight: 600, lineHeight: 1.15, fontSize: "2rem", letterSpacing: "-0.02em" },
  h2: { fontWeight: 600, lineHeight: 1.2, fontSize: "1.5rem", letterSpacing: "-0.015em" },
  h3: { fontWeight: 600, lineHeight: 1.25, fontSize: "1.25rem", letterSpacing: "-0.01em" },
  h4: { fontWeight: 600, lineHeight: 1.3, fontSize: "1.125rem" },
  h5: { fontWeight: 600, lineHeight: 1.3, fontSize: "1rem" },
  h6: { fontWeight: 600, lineHeight: 1.3, fontSize: "0.875rem" },
  subtitle1: { fontWeight: 500, lineHeight: 1.5, fontSize: "0.875rem" },
  subtitle2: { fontWeight: 500, lineHeight: 1.5, fontSize: "0.8125rem" },
  body1: { lineHeight: 1.6, fontSize: "0.875rem" },
  body2: { lineHeight: 1.5, fontSize: "0.8125rem" },
  caption: { lineHeight: 1.4, fontSize: "0.75rem" },
  overline: { fontWeight: 600, lineHeight: 1.5, fontSize: "0.6875rem", textTransform: "uppercase" as const, letterSpacing: "0.08em" },
  button: { fontWeight: 500, lineHeight: 1.5, textTransform: "none" as const, fontSize: "0.8125rem" },
}

export const shape = { borderRadius: 10 }

export const shadows = [
  "none",
  "0 1px 2px rgba(9,9,11,0.05)",
  "0 1px 3px rgba(9,9,11,0.06), 0 1px 2px rgba(9,9,11,0.04)",
  "0 2px 6px rgba(9,9,11,0.06), 0 1px 3px rgba(9,9,11,0.04)",
  "0 4px 10px rgba(9,9,11,0.06), 0 2px 4px rgba(9,9,11,0.04)",
  "0 6px 14px rgba(9,9,11,0.06), 0 3px 6px rgba(9,9,11,0.04)",
  "0 8px 18px rgba(9,9,11,0.06), 0 4px 8px rgba(9,9,11,0.04)",
  "0 10px 22px rgba(9,9,11,0.06), 0 5px 10px rgba(9,9,11,0.04)",
  "0 12px 26px rgba(9,9,11,0.06), 0 6px 12px rgba(9,9,11,0.04)",
  "0 14px 30px rgba(9,9,11,0.06), 0 7px 14px rgba(9,9,11,0.04)",
  "0 16px 34px rgba(9,9,11,0.06), 0 8px 16px rgba(9,9,11,0.04)",
  "0 18px 38px rgba(9,9,11,0.06), 0 9px 18px rgba(9,9,11,0.04)",
  "0 20px 42px rgba(9,9,11,0.06), 0 10px 20px rgba(9,9,11,0.04)",
  "0 22px 46px rgba(9,9,11,0.06), 0 11px 22px rgba(9,9,11,0.04)",
  "0 24px 50px rgba(9,9,11,0.06), 0 12px 24px rgba(9,9,11,0.04)",
  "0 26px 54px rgba(9,9,11,0.06), 0 13px 26px rgba(9,9,11,0.04)",
  "0 28px 58px rgba(9,9,11,0.06), 0 14px 28px rgba(9,9,11,0.04)",
  "0 30px 62px rgba(9,9,11,0.06), 0 15px 30px rgba(9,9,11,0.04)",
  "0 32px 66px rgba(9,9,11,0.06), 0 16px 32px rgba(9,9,11,0.04)",
  "0 34px 70px rgba(9,9,11,0.06), 0 17px 34px rgba(9,9,11,0.04)",
  "0 36px 74px rgba(9,9,11,0.06), 0 18px 36px rgba(9,9,11,0.04)",
  "0 38px 78px rgba(9,9,11,0.06), 0 19px 38px rgba(9,9,11,0.04)",
  "0 40px 82px rgba(9,9,11,0.06), 0 20px 40px rgba(9,9,11,0.04)",
  "0 42px 86px rgba(9,9,11,0.06), 0 21px 42px rgba(9,9,11,0.04)",
  "0 44px 90px rgba(9,9,11,0.06), 0 22px 44px rgba(9,9,11,0.04)",
] as ThemeOptions["shadows"]

export const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(9,9,11,0.18) transparent",
      },
      "*": {
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(9,9,11,0.18) transparent",
        "&::-webkit-scrollbar": { width: 8, height: 8 },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: 8,
          backgroundColor: "rgba(9,9,11,0.18)",
        },
        "&::-webkit-scrollbar-track": { background: "transparent" },
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { borderRadius: 10, padding: "7px 16px", fontWeight: 500, textTransform: "none" as const, fontSize: "0.8125rem", transition: "all 0.15s ease" },
      sizeSmall: { padding: "5px 12px", fontSize: "0.75rem", borderRadius: 8 },
      sizeMedium: { padding: "7px 16px" },
      sizeLarge: { padding: "9px 20px", fontSize: "0.875rem" },
      containedPrimary: { "&:hover": { bgcolor: "#18181b" } },
    },
  },
  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: { borderRadius: 16, border: "1px solid", borderColor: "divider", backgroundImage: "none" },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: "none" },
    },
  },
  MuiTextField: {
    defaultProps: { size: "small" as const },
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": { borderRadius: 10, fontSize: "0.8125rem", transition: "border-color 0.15s ease" },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 6, fontWeight: 500, fontSize: "0.6875rem", height: 22 },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 16 },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: { border: "none", backgroundImage: "none" },
    },
  },
  MuiTooltip: {
    defaultProps: { arrow: false },
    styleOverrides: {
      tooltip: { borderRadius: 8, fontSize: "0.75rem", fontWeight: 500, padding: "5px 10px", bgcolor: "#09090b" },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: { height: 2, borderRadius: 2, bgcolor: "primary.main" },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: { textTransform: "none", fontWeight: 500, minHeight: 40, fontSize: "0.8125rem" },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: { borderRadius: 8, transition: "all 0.15s ease" },
      sizeSmall: { borderRadius: 8 },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: { fontSize: "0.75rem", fontWeight: 600 },
      rounded: { borderRadius: 10 },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: { borderRadius: 10 },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: { borderRadius: 12, border: "1px solid", borderColor: "divider" },
      list: { p: 0.5 },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: { borderRadius: 8, minHeight: 36, fontSize: "0.8125rem" },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: { "& .MuiSwitch-switchBase.Mui-checked": { color: "primary.main" }, "& .MuiSwitch-track": { bgcolor: "rgba(9,9,11,0.2)" } },
    },
  },
  MuiSlider: {
    styleOverrides: {
      root: { height: 6 },
      thumb: { width: 16, height: 16, "&:hover": { boxShadow: "0 0 0 8px rgba(9,9,11,0.08)" } },
      track: { borderRadius: 6 },
      rail: { bgcolor: "rgba(9,9,11,0.12)", borderRadius: 6 },
    },
  },
  MuiBackdrop: {
    styleOverrides: { root: { backdropFilter: "blur(2px)" } },
  },
}

// Dark-mode CSS overrides that MUI can't express via theme tokens
export const darkModeCssOverrides = `
  .dark .MuiPaper-root { scrollbarColor: rgba(250,250,250,0.2) transparent; }
  .dark *::-webkit-scrollbar-thumb { background-color: rgba(250,250,250,0.2); }
  .dark *::-webkit-scrollbar-track { background: transparent; }
`.trim()