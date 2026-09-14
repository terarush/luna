import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "#/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  language?: string
  children: string
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group/code relative my-2 rounded-lg border bg-muted text-sm overflow-hidden">
      <div className="flex items-center justify-between border-b px-3 py-1.5 bg-muted/50">
        <span className="text-xs font-medium text-muted-foreground">
          {language ?? "code"}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3">
        <code className={cn("text-sm", language && `language-${language}`)}>
          {children}
        </code>
      </pre>
    </div>
  )
}
