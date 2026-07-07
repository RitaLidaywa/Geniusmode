import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { theme } from "./theme";

// Recreates the actual Claude interface: macOS-style window chrome,
// "Claude" title bar, a chat bubble, and the input row with attach
// icon + orange send button. Drop this into any scene that needs to
// show "this is really Claude" on screen.

type ClaudeInterfaceMockupProps = {
  message?: string;
  attachedFile?: string | null;
  inputText?: string;
};

export const ClaudeInterfaceMockup: React.FC<ClaudeInterfaceMockupProps> = ({
  message = "How can I help today?",
  attachedFile = null,
  inputText = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowIn = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });
  const windowOpacity = windowIn;
  const windowScale = 0.94 + windowIn * 0.06; // slight scale-up on entrance, not a big pop

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.background,
        backgroundImage: `radial-gradient(${theme.dotColor} 1.5px, transparent 1.5px)`,
        backgroundSize: "24px 24px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "82%",
          opacity: windowOpacity,
          transform: `scale(${windowScale})`,
          backgroundColor: theme.windowBg,
          border: `1px solid ${theme.windowBorder}`,
          borderRadius: 14,
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            borderBottom: `1px solid ${theme.windowBorder}`,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <Dot color="#FF5F57" />
            <Dot color="#FEBC2E" />
            <Dot color="#28C840" />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: theme.fontHeading,
              fontWeight: 600,
              fontSize: 14,
              color: theme.text,
            }}
          >
            Claude
          </div>
        </div>

        {/* Chat body */}
        <div style={{ padding: "20px 20px 16px" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: theme.bubbleGray,
              color: theme.text,
              fontFamily: theme.fontBody,
              fontSize: 15,
              padding: "10px 16px",
              borderRadius: 14,
              marginBottom: 16,
            }}
          >
            {message}
          </div>

          {attachedFile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: theme.fontBody,
                fontSize: 12,
                color: theme.textMuted,
                marginBottom: 6,
              }}
            >
              <PaperclipIcon size={12} color={theme.textMuted} />
              {attachedFile}
            </div>
          )}

          {/* Input row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${theme.windowBorder}`,
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <PaperclipIcon size={16} color={theme.textMuted} />
            <div
              style={{
                flex: 1,
                marginLeft: 10,
                fontFamily: theme.fontBody,
                fontSize: 14,
                color: inputText ? theme.text : theme.textMuted,
              }}
            >
              {inputText || ""}
            </div>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                backgroundColor: theme.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SendArrow />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: color }} />
);

const PaperclipIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

const SendArrow: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M4 12l16-7-7 16-2-7z" />
  </svg>
);
