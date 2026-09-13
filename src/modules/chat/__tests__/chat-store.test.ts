import { describe, it, expect, beforeEach } from "vitest"
import { useChatStore } from "../hooks/use-chat-store"

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.getState().reset()
  })

  it("initializes with default active model and empty or seed sessions", () => {
    const state = useChatStore.getState()
    expect(state.selectedModel).toBeDefined()
    expect(state.sessions.length).toBeGreaterThan(0)
    expect(state.activeSessionId).toBe(state.sessions[0].id)
  })

  it("creates a new session and sets it active", () => {
    const newId = useChatStore.getState().createNewSession("Test Chat")
    const state = useChatStore.getState()
    expect(state.activeSessionId).toBe(newId)
    const session = state.sessions.find((s) => s.id === newId)
    expect(session?.title).toBe("Test Chat")
  })

  it("adds a message to the active session", () => {
    const state = useChatStore.getState()
    const activeId = state.activeSessionId
    useChatStore.getState().addMessage({
      role: "user",
      content: "Hello AI",
    })
    const updated = useChatStore.getState().sessions.find((s) => s.id === activeId)
    expect(updated?.messages.some((m) => m.content === "Hello AI")).toBe(true)
  })

  it("updates model parameters correctly", () => {
    useChatStore.getState().updateParameters({ temperature: 0.7 })
    expect(useChatStore.getState().parameters.temperature).toBe(0.7)
  })
})
