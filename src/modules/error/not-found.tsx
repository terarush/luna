import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 transition-colors duration-200">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
            {t("error.badge")}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {t("error.title")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
            {t("error.description")}
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 rounded-md h-10 px-6 text-sm font-semibold transition-all duration-200 shadow-sm focus:outline-hidden focus:ring-3 focus:ring-zinc-950/10 dark:focus:ring-zinc-100/15"
          >
            {t("error.goHome")}
          </Link>
        </div>
      </div>
    </div>
  )
}