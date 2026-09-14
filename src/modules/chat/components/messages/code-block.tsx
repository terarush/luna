import * as React from "react"
import { useTranslation } from "react-i18next"
import { Copy, Check, FileCode2 } from "lucide-react"

interface CodeBlockProps {
  language?: string
  children: string
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 dark:border-zinc-700/60 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-1.5 dark:border-zinc-700/60 dark:bg-zinc-800/60">
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 dark:text-zinc-400">
          <FileCode2 className="size-3" />
          {language ?? "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
          aria-label={copied ? t("chat.messages.copied") : t("chat.messages.copyCode")}
        >
          {copied ? (
            <>
              <Check className="size-3 text-zinc-100" />
              <span className="text-zinc-100">{t("chat.messages.copied")}</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              {t("chat.messages.copyCode")}
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 font-mono text-[12px] leading-relaxed text-zinc-200 dark:text-zinc-300">
        <code className={language ? `language-${language}` : ""}>{children}</code>
      </pre>
    </div>
  )
}