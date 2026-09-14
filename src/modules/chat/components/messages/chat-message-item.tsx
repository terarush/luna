import type { ChatMessage } from "../../types"
import { UserMessage } from "./user-message"
import { AssistantMessage } from "./assistant-message"

interface ChatMessageItemProps {
  message: ChatMessage
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  if (message.role === "user") {
    return <UserMessage message={message} />
  }
  return <AssistantMessage message={message} />
}