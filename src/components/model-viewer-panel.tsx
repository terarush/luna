import { useChatStore } from "@/modules/chat/hooks/use-chat-store"
import { ModelViewer } from "./model-viewer"

export function ModelViewerPanel() {
  const isSpeaking = useChatStore((s) => s.isSpeaking)

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <ModelViewer />
      </div>
      {isSpeaking && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 20,
            background: "rgba(239, 68, 68, 0.8)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#fff",
              animation: "pulse 1s infinite",
            }}
          />
          Speaking...
        </div>
      )}
    </div>
  )
}
