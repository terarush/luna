export interface AttachmentItem {
  id: string
  name: string
  size: number
  type: string
  url?: string
}

export interface CitationItem {
  title: string
  url: string
  snippet: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: number
  thinking?: string
  thinkingDuration?: number
  isStreaming?: boolean
  attachments?: AttachmentItem[]
  citations?: CitationItem[]
  model?: string
  tokensPerSecond?: number
  totalTokens?: number
}

export interface ChatSession {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  pinned?: boolean
  messages: ChatMessage[]
}

export interface ModelOption {
  id: string
  name: string
  tag: string
  provider: "ollama" | "openai" | "anthropic" | "custom"
  description: string
  contextLength: number
}

export interface ChatParameters {
  systemPrompt: string
  temperature: number
  contextLength: number
  topP: number
  topK: number
}
