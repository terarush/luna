import { Sun, Moon } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/components/theme-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getSeoMeta } from "@/meta"
import { Button } from "#/components/ui/button"
import { useNavigate } from "@tanstack/react-router"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const seo = getSeoMeta()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleGetStarted = () => {
    navigate({ to: "/get-started" })
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 transition-colors duration-200 relative">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      <div className="absolute left-4 top-4 inline-flex gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={t("home.themeToggle")}
          data-dev-source="src/modules/home/index.tsx"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors duration-200"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full text-center space-y-6">
        <img
          src="/company/logo.png"
          alt={t("home.logoAlt")}
          data-dev-source="src/modules/home/index.tsx"
          className="mx-auto h-16 w-16 rounded-xl object-cover shadow-sm"
        />

        <div className="space-y-2">
          <p className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
            {t("home.badge")}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {t("home.title")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
            {t("home.description")}
          </p>
        </div>
        <Button variant="default" onClick={handleGetStarted}>
          {t("home.getStarted")}
        </Button>
      </div>
    </div>
  )
}