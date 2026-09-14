import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { Moon, Sun, MessageSquareText, ArrowRight } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useTheme } from "@/shared/theme-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getSeoMeta } from "@/meta"

export default function HomePage() {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const seo = getSeoMeta()

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-zinc-400/10 blur-3xl dark:bg-zinc-600/10" />
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          aria-label={t("home.themeToggle")}
        >
          {resolvedTheme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>
        <LanguageSwitcher />
      </div>

      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-xl shadow-sky-500/25 dark:from-sky-500 dark:to-sky-700">
          <MessageSquareText className="size-7" strokeWidth={2.2} />
        </div>

        <p className="mt-6 text-[11px] font-semibold tracking-[0.22em] text-sky-500 uppercase dark:text-sky-400">
          {t("home.badge")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("home.title")}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t("home.description")}
        </p>

        <Link
          to="/"
          className="group mt-7 inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white shadow-lg shadow-zinc-950/15 transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {t("home.getStarted")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}