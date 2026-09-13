import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ChatSession, ChatMessage, ModelOption, ChatParameters, AttachmentItem } from "../types"

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "llama3.3:70b",
    name: "Llama 3.3 70B",
    tag: "Ollama",
    provider: "ollama",
    description: "Meta's state of the art open model with 128k context",
    contextLength: 131072,
  },
  {
    id: "deepseek-r1:latest",
    name: "DeepSeek R1",
    tag: "Reasoning",
    provider: "ollama",
    description: "Open reasoning model with chain-of-thought capabilities",
    contextLength: 65536,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    tag: "OpenAI",
    provider: "openai",
    description: "Flagship multimodal intelligence from OpenAI",
    contextLength: 128000,
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    tag: "Anthropic",
    provider: "anthropic",
    description: "Highest level of intelligence and coding capability",
    contextLength: 200000,
  },
]

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
  isWebSearchEnabled: boolean
  isReasoningEnabled: boolean
  searchFilter: string
  pendingAttachments: AttachmentItem[]

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
  stopGeneration: () => void
  reset: () => void
}

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      sessions: SEED_SESSIONS,
      activeSessionId: SEED_SESSIONS[0].id,
      selectedModel: AVAILABLE_MODELS[0].id,
      parameters: DEFAULT_PARAMETERS,
      isGenerating: false,
      isWebSearchEnabled: false,
      isReasoningEnabled: true,
      searchFilter: "",
      pendingAttachments: [],

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
        const { activeSessionId, selectedModel, pendingAttachments, isReasoningEnabled, addMessage } = get()
        if (!content.trim() && pendingAttachments.length === 0) return

        // Add user message
        addMessage({
          role: "user",
          content,
          attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
        })
        set({ pendingAttachments: [], isGenerating: true })

        // Simulate streaming assistant message
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

        // Stream simulation text
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

        // Stream chunks
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

        // Finalize
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

      stopGeneration: () => {
        set({ isGenerating: false })
      },

      reset: () => {
        set({
          sessions: SEED_SESSIONS,
          activeSessionId: SEED_SESSIONS[0].id,
          selectedModel: AVAILABLE_MODELS[0].id,
          parameters: DEFAULT_PARAMETERS,
          isGenerating: false,
          pendingAttachments: [],
        })
      },
    }),
    {
      name: "open-webui-chat-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        selectedModel: state.selectedModel,
        parameters: state.parameters,
      }),
    }
  )
)
