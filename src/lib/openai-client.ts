import OpenAI from "openai"

let cachedClient: OpenAI | null = null
let cachedBaseURL: string | undefined

export function getOpenAIClient(baseURL: string, apiKey: string): OpenAI {
  if (!apiKey) {
    throw new Error("API key is required. Set it in Settings first.")
  }
  if (!baseURL) {
    throw new Error("API base URL is required. Set it in Settings first.")
  }

  if (!cachedClient || cachedBaseURL !== baseURL) {
    cachedClient = new OpenAI({
      apiKey,
      baseURL,
      dangerouslyAllowBrowser: true,
    })
    cachedBaseURL = baseURL
  }

  return cachedClient
}

export function resetOpenAIClient() {
  cachedClient = null
  cachedBaseURL = undefined
}
