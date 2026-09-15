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
        borderRadius: "16px",
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
            borderRadius: "10px",
            background: "rgba(225, 29, 72, 0.7)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "0 8px 24px rgba(225, 29, 72, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.45)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "-0.01em",
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
