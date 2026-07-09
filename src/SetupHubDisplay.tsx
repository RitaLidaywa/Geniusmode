import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const INK = "#1A1A2E";
const COBALT = "#1C358C";
const TOMATO = "#E74F35";
const DAISY = "#FFFAE5";

const FONT_FAMILY = "'Times New Roman', Times, serif";

const BORDER_START = 0;
const BORDER_END_SEC = 1;
const TITLE_START_SEC = 1;
const PANEL_START_SEC = 3;

export const SetupHubDisplay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const borderStartFrame = BORDER_START * fps;
  const borderEndFrame = BORDER_END_SEC * fps;
  const titleStartFrame = TITLE_START_SEC * fps;
  const panelStartFrame = PANEL_START_SEC * fps;

  const borderProgress = interpolate(
    frame,
    [borderStartFrame, borderEndFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.linear },
  );

  const titleSpring = spring({
    frame: frame - titleStartFrame,
    fps,
    config: { damping: 15 },
  });

  const panelSpring = spring({
    frame: frame - panelStartFrame,
    fps,
    config: { damping: 15 },
  });

  const borderThickness = 14;
  const borderInset = 48;

  const promptPrefix = "Generate a ";
  const promptHighlight = "research brief";
  const promptSuffix =
    " on [topic] including key talking points and links for fact-checking.";

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT_FAMILY }}>
      {/* Cobalt frame border - draws in linearly */}
      <div
        style={{
          position: "absolute",
          top: borderInset,
          left: borderInset,
          width: interpolate(borderProgress, [0, 1], [0, 1080 - borderInset * 2]),
          height: borderThickness,
          backgroundColor: COBALT,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: borderInset,
          left: borderInset,
          width: interpolate(borderProgress, [0, 1], [0, 1080 - borderInset * 2]),
          height: borderThickness,
          backgroundColor: COBALT,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: borderInset,
          left: borderInset,
          width: borderThickness,
          height: interpolate(borderProgress, [0, 1], [0, 1920 - borderInset * 2]),
          backgroundColor: COBALT,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: borderInset,
          right: borderInset,
          width: borderThickness,
          height: interpolate(borderProgress, [0, 1], [0, 1920 - borderInset * 2]),
          backgroundColor: COBALT,
        }}
      />

      {/* Center-frame title */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          top: -160,
        }}
      >
        <div
          style={{
            opacity: titleSpring,
            transform: `scale(${interpolate(titleSpring, [0, 1], [0.6, 1])})`,
            color: DAISY,
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: 2,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          AIMW <span style={{ color: COBALT }}>|</span> Scriptwriting
        </div>
      </AbsoluteFill>

      {/* Secondary panel with prompt */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          top: 260,
        }}
      >
        <div
          style={{
            opacity: panelSpring,
            transform: `translateY(${interpolate(panelSpring, [0, 1], [60, 0])}px)`,
            width: 860,
            padding: "56px 60px",
            backgroundColor: "rgba(28, 53, 140, 0.18)",
            border: `2px solid ${COBALT}`,
          }}
        >
          <div
            style={{
              color: DAISY,
              fontSize: 38,
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            {promptPrefix}
            <span style={{ color: TOMATO }}>{promptHighlight}</span>
            {promptSuffix}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
