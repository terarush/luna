import * as React from "react"
import { Box, Collapse, Typography } from "@mui/material"
import { ChevronDown, Eye, Loader2 } from "lucide-react"

interface ThinkingAccordionProps {
  content: string
  duration?: number
  isStreaming?: boolean
}

export function ThinkingAccordion({ content, duration, isStreaming }: ThinkingAccordionProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Box>
      <Box
        component="button"
        onClick={() => setOpen((o) => !o)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.25,
          py: 0.375,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          cursor: "pointer",
          transition: "all 0.15s ease",
          "&:hover": { bgcolor: "action.hover" },
          "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
        }}
      >
        <Eye size={12} style={{ opacity: 0.6 }} />
        <Typography sx={{ fontSize: "0.6875rem", fontWeight: 500, color: "text.secondary" }}>
          Thinking
        </Typography>
        {isStreaming && <Loader2 size={12} style={{ animation: "spin 1s linear infinite", color: "text.disabled" }} />}
        {duration && (
          <Typography sx={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "text.disabled" }}>
            {duration}s
          </Typography>
        )}
        <ChevronDown
          size={12}
          style={{
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "none",
            opacity: 0.5,
          }}
        />
      </Box>
      <Collapse in={open} unmountOnExit>
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
            fontSize: "0.75rem",
            lineHeight: 1.7,
            color: "text.secondary",
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </Box>
      </Collapse>
    </Box>
  )
}