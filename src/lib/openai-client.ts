import OpenAI from "openai"

let cachedClient: OpenAI | null = null
let cachedBaseURL: string | undefined

export function getOpenAIClient(baseURL?: string, apiKey?: string): OpenAI {
  const key = apiKey ?? import.meta.env.VITE_OPENAI_API_KEY
  const url = baseURL ?? import.meta.env.VITE_OPENAI_BASE_URL

  if (!key) {
    throw new Error("OpenAI API key is required. Set VITE_OPENAI_API_KEY or pass it directly.")
  }

  if (!cachedClient || cachedBaseURL !== url) {
    cachedClient = new OpenAI({
      apiKey: key,
      baseURL: url,
      dangerouslyAllowBrowser: true,
    })
    cachedBaseURL = url
  }

  return cachedClient
}

export function resetOpenAIClient() {
  cachedClient = null
  cachedBaseURL = undefined
}
