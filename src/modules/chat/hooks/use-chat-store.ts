import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ChatSession, ChatMessage, ModelOption, ChatParameters, AttachmentItem } from "../types"
import { getOpenAIClient } from "@/lib/openai-client"

const ENV_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_OPENAI_BASE_URL || ""
// Same-origin proxy ke 9Router (vite dev proxy / nginx production) supaya bebas CORS
const PROXY_BASE_URL = "/api-9router/v1"
const DEFAULT_BASE_URL = ENV_BASE_URL || PROXY_BASE_URL
const ROUTER_HOST = "prod-9router.terarush.dev"

// Ubah URL penuh (mis. https://prod-9router.terarush.dev/v1) jadi path proxy same-origin
// supaya tidak kena CORS; path relatif dibiarkan apa adanya.
function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "")
  if (!trimmed) return trimmed
  try {
    const parsed = new URL(trimmed)
    if (parsed.hostname === ROUTER_HOST) {
      return `/api-9router${parsed.pathname}`
    }
  } catch {
    // bukan URL absolut — anggap path proxy relatif
  }
  return trimmed
}

export interface CustomModelConfig {
  id: string
  name: string
  baseURL: string
  apiKey?: string
  tag?: string
}

const DEFAULT_PARAMETERS: ChatParameters = {
  systemPrompt: "You are a helpful, knowledgeable, and concise AI assistant.",
  temperature: 0.7,
  contextLength: 4096,
  topP: 0.9,
  topK: 40,
}

const SEED_SESSIONS: ChatSession[] = [
  {
    id: "default-session-1",
    title: "Getting Started with Open WebUI",
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
    pinned: true,
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "What can you do?",
        createdAt: Date.now() - 3600000 * 2,
      },
      {
        id: "msg-2",
        role: "assistant",
        model: "llama3.3:70b",
        createdAt: Date.now() - 3600000 * 2 + 1000,
        thinking: "The user is asking about my core capabilities. I will provide a structured list highlighting code, reasoning, analysis, and customization.",
        thinkingDuration: 1.2,
        tokensPerSecond: 48.6,
        totalTokens: 142,
        content: `I'm your **Open WebUI Assistant**. Here is what I can help you with:

- 💻 **Code Generation & Debugging**: TypeScript, Python, Rust, SQL, and more.
- 🧠 **Deep Reasoning**: Detailed thought chains for math, logic, and architecture.
- 🔍 **Web Search & Analysis**: Real-time insights and synthesis.
- 📁 **File & Document Q&A**: Analyze documents, logs, and datasets.

\`\`\`typescript
// Example: Fast greeting function
export function greet(name: string): string {
  return \`Welcome to Open WebUI, \${name}!\`
}
\`\`\`

Feel free to ask a question or drop a prompt below!`,
      },
    ],
  },
]

interface ChatStoreState {
  sessions: ChatSession[]
  activeSessionId: string
  selectedModel: string
  parameters: ChatParameters
  isGenerating: boolean
  isSpeaking: boolean
  isWebSearchEnabled: boolean
  isReasoningEnabled: boolean
  searchFilter: string
  pendingAttachments: AttachmentItem[]
  customModels: CustomModelConfig[]
  remoteModels: ModelOption[]
  isLoadingModels: boolean
  apiBaseUrl: string
  apiKey: string

  // Actions
  createNewSession: (customTitle?: string) => string
  selectSession: (id: string) => void
  deleteSession: (id: string) => void
  renameSession: (id: string, newTitle: string) => void
  togglePinSession: (id: string) => void
  setSelectedModel: (modelId: string) => void
  setSearchFilter: (query: string) => void
  toggleWebSearch: () => void
  toggleReasoning: () => void
  addAttachment: (attachment: AttachmentItem) => void
  removeAttachment: (id: string) => void
  clearAttachments: () => void
  updateParameters: (params: Partial<ChatParameters>) => void
  addMessage: (msg: Omit<ChatMessage, "id" | "createdAt">) => void
  sendMessage: (content: string) => Promise<void>
  setSpeaking: (speaking: boolean) => void
  stopGeneration: () => void
  reset: () => void
  addCustomModel: (model: CustomModelConfig) => void
  removeCustomModel: (id: string) => void
  setApiBaseUrl: (url: string) => void
  setApiKey: (key: string) => void
  fetchModels: () => Promise<void>
}

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      sessions: SEED_SESSIONS,
      activeSessionId: SEED_SESSIONS[0].id,
      selectedModel: "",
      parameters: DEFAULT_PARAMETERS,
      isGenerating: false,
      isSpeaking: false,
      isWebSearchEnabled: false,
      isReasoningEnabled: true,
      searchFilter: "",
      pendingAttachments: [],
      customModels: [],
      remoteModels: [],
      isLoadingModels: false,
      apiBaseUrl: DEFAULT_BASE_URL,
      apiKey: "",

      fetchModels: async () => {
        set({ isLoadingModels: true })
        try {
          const baseUrl = normalizeBaseUrl(get().apiBaseUrl || DEFAULT_BASE_URL)
          if (!baseUrl) {
            console.warn("No API base URL configured. Set it in Settings or via VITE_API_URL.")
            set({ remoteModels: [], isLoadingModels: false })
            return
          }
          const res = await fetch(`${baseUrl}/models`, {
            headers: get().apiKey ? { Authorization: `Bearer ${get().apiKey}` } : undefined,
          })
          if (!res.ok) throw new Error(`GET /models failed: ${res.status}`)
          const data = await res.json()
          const modelList = data?.data ?? []
          const models: ModelOption[] = modelList.map((m: any) => ({
            id: m.id,
            name: m.name || m.id,
            tag: m.capabilities?.search ? "Search" : m.capabilities?.audioInput ? "Audio" : "Remote",
            provider: "openai",
            description: m.description || (m.capabilities?.contextWindow ? `${(m.capabilities.contextWindow / 1048576).toFixed(1)}M ctx` : m.id),
            contextLength: m.capabilities?.contextWindow ?? m.context_length ?? 128000,
          }))
          set({ remoteModels: models, isLoadingModels: false })
          if (!get().selectedModel || !models.some((m) => m.id === get().selectedModel)) {
            set({ selectedModel: models[0]?.id ?? "" })
          }
        } catch (err) {
          console.error("Failed to fetch models:", err)
          set({ remoteModels: [], isLoadingModels: false })
        }
      },

      createNewSession: (customTitle) => {
        const id = "session-" + Math.random().toString(36).substring(2, 9)
        const newSession: ChatSession = {
          id,
          title: customTitle || "New Chat",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [],
        }
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: id,
        }))
        return id
      },

      selectSession: (id) => set({ activeSessionId: id }),

      deleteSession: (id) => {
        set((state) => {
          const filtered = state.sessions.filter((s) => s.id !== id)
          const fallbackId = filtered[0]?.id || ""
          return {
            sessions: filtered,
            activeSessionId: state.activeSessionId === id ? fallbackId : state.activeSessionId,
          }
        })
      },

      renameSession: (id, newTitle) => {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s)),
        }))
      },

      togglePinSession: (id) => {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s)),
        }))
      },

      setSelectedModel: (modelId) => set({ selectedModel: modelId }),
      setSearchFilter: (query) => set({ searchFilter: query }),
      toggleWebSearch: () => set((state) => ({ isWebSearchEnabled: !state.isWebSearchEnabled })),
      toggleReasoning: () => set((state) => ({ isReasoningEnabled: !state.isReasoningEnabled })),

      addAttachment: (attachment) =>
        set((state) => ({ pendingAttachments: [...state.pendingAttachments, attachment] })),

      removeAttachment: (id) =>
        set((state) => ({
          pendingAttachments: state.pendingAttachments.filter((a) => a.id !== id),
        })),

      clearAttachments: () => set({ pendingAttachments: [] }),

      updateParameters: (params) =>
        set((state) => ({ parameters: { ...state.parameters, ...params } })),

      addMessage: (msg) => {
        const id = "msg-" + Math.random().toString(36).substring(2, 9)
        const fullMsg: ChatMessage = {
          ...msg,
          id,
          createdAt: Date.now(),
        }
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === state.activeSessionId
              ? {
                  ...s,
                  title: s.messages.length === 0 && msg.role === "user" ? msg.content.slice(0, 30) : s.title,
                  updatedAt: Date.now(),
                  messages: [...s.messages, fullMsg],
                }
              : s
          ),
        }))
      },

      sendMessage: async (content: string) => {
        const { activeSessionId, selectedModel, pendingAttachments, isReasoningEnabled, addMessage, customModels, setSpeaking } = get()
        if (!content.trim() && pendingAttachments.length === 0) return

        // Add user message
        addMessage({
          role: "user",
          content,
          attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
        })
        set({ pendingAttachments: [], isGenerating: true, isSpeaking: false })

        // Stream assistant message
        const assistantMsgId = "msg-" + Math.random().toString(36).substring(2, 9)
        const initialAssistantMsg: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          model: selectedModel,
          createdAt: Date.now(),
          isStreaming: true,
          thinking: isReasoningEnabled ? "Analyzing user query and planning optimal response structure..." : undefined,
          thinkingDuration: isReasoningEnabled ? 1.4 : undefined,
        }

        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === activeSessionId
              ? { ...s, messages: [...s.messages, initialAssistantMsg] }
              : s
          ),
        }))

        // Find model config (custom or predefined)
        const allModels = [...get().remoteModels, ...customModels.map((m) => ({ ...m, provider: "custom" as const, contextLength: 128000 }))]
        const modelConfig = allModels.find((m) => m.id === selectedModel)
        const isOpenAIModel = modelConfig?.provider === "openai" || modelConfig?.provider === "custom"
        const modelBaseURL = "baseURL" in (modelConfig ?? {}) ? (modelConfig as any).baseURL : undefined
        const modelAPIKey = "apiKey" in (modelConfig ?? {}) ? (modelConfig as any).apiKey : undefined
        const apiKey = modelAPIKey || get().apiKey

        if (isOpenAIModel && apiKey && (modelBaseURL || get().apiBaseUrl)) {
          try {
            const client = getOpenAIClient(normalizeBaseUrl(modelBaseURL || get().apiBaseUrl || DEFAULT_BASE_URL), apiKey)
            const params = get().parameters
            const stream = await client.chat.completions.create({
              model: selectedModel,
              messages: [
                ...(params.systemPrompt ? [{ role: "system" as const, content: params.systemPrompt }] : []),
                ...get().sessions.find((s) => s.id === activeSessionId)?.messages
                  .filter((m) => m.role === "user")
                  .map((m) => ({ role: "user" as const, content: m.content })) ?? [],
              ],
              temperature: params.temperature,
              max_tokens: params.contextLength,
              stream: true,
            })

            setSpeaking(true)
            let fullContent = ""
            for await (const chunk of stream) {
              if (!get().isGenerating) break
              const delta = chunk.choices[0]?.delta?.content ?? ""
              fullContent += delta
              set((state) => ({
                sessions: state.sessions.map((s) =>
                  s.id === activeSessionId
                    ? {
                        ...s,
                        messages: s.messages.map((m) =>
                          m.id === assistantMsgId ? { ...m, content: fullContent } : m
                        ),
                      }
                    : s
                ),
              }))
            }

            setSpeaking(false)
            set((state) => ({
              isGenerating: false,
              sessions: state.sessions.map((s) =>
                s.id === activeSessionId
                  ? {
                      ...s,
                      messages: s.messages.map((m) =>
                        m.id === assistantMsgId
                          ? { ...m, isStreaming: false, totalTokens: Math.floor(fullContent.length / 4) }
                          : m
                      ),
                    }
                  : s
              ),
            }))
            return
          } catch (error) {
            console.error("OpenAI API error:", error)
          }
        }

        // Fallback simulation for non-OpenAI models
        setSpeaking(true)
        const responseText = `Here is a breakdown in response to **"${content}"** using **${selectedModel}**:

1. **Overview**: Your query touches upon core modular components in modern AI workflows.
2. **Implementation Example**:
\`\`\`bash
# Install and run with Ollama
ollama run ${selectedModel}
\`\`\`

3. **Key Takeaways**:
- Interactive streaming UI mirrors Open WebUI ergonomics.
- Markdown, code syntax highlighting, and collapsible reasoning are fully supported.

Let me know if you want to dive deeper or adjust model parameters!`

        let currentText = ""
        const words = responseText.split(" ")
        for (let i = 0; i < words.length; i++) {
          if (!get().isGenerating) break
          currentText += (i === 0 ? "" : " ") + words[i]
          await new Promise((r) => setTimeout(r, 25))

          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === activeSessionId
                ? {
                    ...s,
                    messages: s.messages.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: currentText } : m
                    ),
                  }
                : s
            ),
          }))
        }

        setSpeaking(false)
        set((state) => ({
          isGenerating: false,
          sessions: state.sessions.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          isStreaming: false,
                          tokensPerSecond: +(35 + Math.random() * 20).toFixed(1),
                          totalTokens: Math.floor(currentText.length / 4),
                        }
                      : m
                  ),
                }
              : s
          ),
        }))
      },

      setSpeaking: (speaking) => set({ isSpeaking: speaking }),
      stopGeneration: () => {
        set({ isGenerating: false })
      },

      reset: () => {
        set({
          sessions: SEED_SESSIONS,
          activeSessionId: SEED_SESSIONS[0].id,
          selectedModel: "",
          parameters: DEFAULT_PARAMETERS,
          isGenerating: false,
          pendingAttachments: [],
          customModels: [],
        })
      },
      addCustomModel: (model) =>
        set((state) => ({
          customModels: [...state.customModels, model],
        })),
      removeCustomModel: (id) =>
        set((state) => ({
          customModels: state.customModels.filter((m) => m.id !== id),
        })),
      setApiBaseUrl: (url) => set({ apiBaseUrl: normalizeBaseUrl(url) }),
      setApiKey: (key) => set({ apiKey: key }),
    }),
    {
      name: "open-webui-chat-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        selectedModel: state.selectedModel,
        parameters: state.parameters,
        customModels: state.customModels,
        apiBaseUrl: state.apiBaseUrl,
        apiKey: state.apiKey,
      }),
      // Nilai base URL dari persist dinormalisasi: URL penuh 9router → path proxy,
      // relative path dibiarkan. apiKey ikut dipulihkan.
      merge: (persisted, current) => {
        const p = persisted as Partial<ChatStoreState>
        return {
          ...current,
          ...p,
          apiBaseUrl: p.apiBaseUrl ? normalizeBaseUrl(p.apiBaseUrl) : current.apiBaseUrl,
          apiKey: p.apiKey ?? current.apiKey,
        }
      },
    }
  )
)
