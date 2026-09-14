import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { Box, Button, Tooltip, Typography } from "@mui/material"
import { Moon, Sun, MessageSquareText, ArrowRight } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useMuiTheme } from "@/shared/themes/mui-theme-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getSeoMeta } from "@/meta"

export default function HomePage() {
  const { t } = useTranslation()
  const { resolvedMode, setMode } = useMuiTheme()
  const seo = getSeoMeta()

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        minHeight: "100dvh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        px: 3,
      }}
    >
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Ambient background glow */}
      <Box
        sx={{
          position: "absolute",
          top: -128,
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: 320, sm: 672 },
          height: 384,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(9,9,11,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 288,
          height: 288,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(9,9,11,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 1 }}>
        <Tooltip title={t("home.themeToggle")}>
          <Button
            aria-label={t("home.themeToggle")}
            onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}
            sx={{ minWidth: 40, width: 40, height: 40, p: 0, borderRadius: 1.5, color: "text.secondary", border: "1px solid", borderColor: "divider", "&:hover": { bgcolor: "action.hover", color: "text.primary" } }}
          >
            {resolvedMode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </Tooltip>
        <LanguageSwitcher />
      </Box>

      <Box sx={{ display: "flex", maxWidth: 448, flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 4,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            boxShadow: "0 20px 40px rgba(9,9,11,0.22)",
          }}
        >
          <MessageSquareText size={26} strokeWidth={2.2} />
        </Box>

        <Typography
          sx={{
            mt: 4,
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {t("home.badge")}
        </Typography>
        <Typography sx={{ mt: 1.5, fontSize: { xs: "1.875rem", sm: "2.25rem" }, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
          {t("home.title")}
        </Typography>
        <Typography sx={{ mt: 2, maxWidth: 384, fontSize: "0.875rem", lineHeight: 1.7, color: "text.secondary" }}>
          {t("home.description")}
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          endIcon={<ArrowRight size={15} />}
          sx={{
            mt: 3.5,
            px: 2.5,
            py: 1,
            borderRadius: 2,
            fontSize: "0.8125rem",
            boxShadow: "0 8px 20px rgba(9,9,11,0.2)",
            "&:hover": { boxShadow: "0 10px 24px rgba(9,9,11,0.25)" },
          }}
        >
          {t("home.getStarted")}
        </Button>
      </Box>
    </Box>
  )
}