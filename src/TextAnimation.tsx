import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Fraunces";

const { fontFamily } = loadFont("italic", {
  weights: ["900"],
});

const DAISY = "#FFFAE5";
const DOT = "#F0ECCD";
const INK = "#1A1A2E";
const TOMATO = "#E74F35";

const LANDING_FRAME = 45; // 1.5s @ 30fps
const SETTLE_FRAME = 60; // 2s @ 30fps
const FADE_START_FRAME = 165; // 5.5s @ 30fps
const FADE_DURATION = 15; // 0.5s

const DotGrid: React.FC = () => {
  const dots = useMemo(() => {
    const spacing = 90;
    const cols = Math.ceil(1080 / spacing) + 1;
    const rows = Math.ceil(1920 / spacing) + 1;
    const points: { x: number; y: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offset = row % 2 === 0 ? 0 : spacing / 2;
        points.push({ x: col * spacing + offset, y: row * spacing });
      }
    }
    return points;
  }, []);

  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={4} fill={DOT} opacity={0.5} />
      ))}
    </svg>
  );
};

export const TextAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Spring = spring({
    frame,
    fps,
    config: {
      damping: 12,
      mass: 0.6,
      stiffness: 90,
    },
    durationInFrames: LANDING_FRAME,
  });

  const line2Spring = spring({
    frame,
    fps,
    config: {
      damping: 12,
      mass: 0.6,
      stiffness: 90,
    },
    durationInFrames: LANDING_FRAME,
  });

  // Line 1 enters from above the safe zone, settles in the upper-middle third.
  const line1StartY = -400;
  const line1EndY = 780;
  const line1Y = interpolate(line1Spring, [0, 1], [line1StartY, line1EndY]);

  // Line 2 enters from below the safe zone, settles in the lower-middle third.
  const line2StartY = 2300;
  const line2EndY = 980;
  const line2Y = interpolate(line2Spring, [0, 1], [line2StartY, line2EndY]);

  // Both lines drift into a final, tightly-stacked centered block by 2s.
  const stackProgress = interpolate(frame, [LANDING_FRAME, SETTLE_FRAME], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line1FinalY = interpolate(stackProgress, [0, 1], [line1Y, 860]);
  const line2FinalY = interpolate(stackProgress, [0, 1], [line2Y, 1010]);

  const opacity = interpolate(
    frame,
    [FADE_START_FRAME, FADE_START_FRAME + FADE_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: DAISY, opacity }}>
      <DotGrid />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: line1FinalY,
            width: "100%",
            textAlign: "center",
            fontFamily,
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 88,
            lineHeight: 1.1,
            color: INK,
            padding: "0 60px",
          }}
        >
          Making AI videos
        </div>
        <div
          style={{
            position: "absolute",
            top: line2FinalY,
            width: "100%",
            textAlign: "center",
            fontFamily,
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 88,
            lineHeight: 1.1,
            color: INK,
            padding: "0 60px",
          }}
        >
          in <span style={{ color: TOMATO }}>2026</span> just got easier.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
