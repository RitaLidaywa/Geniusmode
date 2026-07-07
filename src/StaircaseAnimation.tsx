import React, { useMemo } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

const fontFamily = "Fraunces";

const waitForFont = delayRender("Loading Fraunces");
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Fraunces-Black-Italic.ttf"),
  weight: "900",
  style: "italic",
})
  .then(() => continueRender(waitForFont))
  .catch((err) => {
    console.error("Failed to load font", err);
    continueRender(waitForFont);
  });

const DAISY = "#FFFAE5";
const DOT = "#F0ECCD";
const INK = "#1A1A2E";
const INK_TOP = "#43426A";
const INK_SIDE = "#101021";
const TOMATO = "#E74F35";

const FADE_OUT_START = 165; // 5.5s
const FADE_OUT_END = 180; // 6s
const LABEL_START = 105; // 3.5s
const LABEL_FADE_DURATION = 15; // 0.5s

const STEP_WIDTH = 130;
const STEP_DEPTH = 92;
const STEP_GAP = 18;
const UNIT_HEIGHT = 85;
const STEP_COUNT = 5;
const STAGE_BASELINE_Y = 1340;
const BASE_TILT_X = -20;

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

const Step: React.FC<{
  index: number;
  appearFrame: number;
}> = ({ index, appearFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const height = (index + 1) * UNIT_HEIGHT;
  const totalWidth = STEP_COUNT * STEP_WIDTH + (STEP_COUNT - 1) * STEP_GAP;
  const x =
    -totalWidth / 2 +
    STEP_WIDTH / 2 +
    index * (STEP_WIDTH + STEP_GAP);

  const localFrame = Math.max(0, frame - appearFrame);
  const springValue = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 140 },
    durationInFrames: 18,
  });

  const riseOffset = interpolate(springValue, [0, 1], [140, 0]);
  const opacity = interpolate(
    frame,
    [appearFrame, appearFrame + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x - STEP_WIDTH / 2,
        top: -height,
        width: STEP_WIDTH,
        height,
        transformStyle: "preserve-3d",
        transform: `translateY(${riseOffset}px)`,
        opacity,
      }}
    >
      {/* front face */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: STEP_WIDTH,
          height,
          background: INK,
          transform: `translateZ(${STEP_DEPTH / 2}px)`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 14,
        }}
      >
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 40,
            color: DAISY,
          }}
        >
          {index + 1}
        </span>
      </div>

      {/* top face */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: (height - STEP_DEPTH) / 2,
          width: STEP_WIDTH,
          height: STEP_DEPTH,
          background: INK_TOP,
          transform: `rotateX(90deg) translateZ(${height / 2}px)`,
        }}
      />

      {/* right side face (depth) */}
      <div
        style={{
          position: "absolute",
          left: (STEP_WIDTH - STEP_DEPTH) / 2,
          top: 0,
          width: STEP_DEPTH,
          height,
          background: INK_SIDE,
          transform: `rotateY(90deg) translateZ(${STEP_WIDTH / 2}px)`,
        }}
      />
    </div>
  );
};

export const StaircaseAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  const drift = interpolate(frame, [0, 180], [-2.5, 2.5]);

  const sceneOpacity = interpolate(
    frame,
    [FADE_OUT_START, FADE_OUT_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const labelOpacity = interpolate(
    frame,
    [LABEL_START, LABEL_START + LABEL_FADE_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: DAISY, opacity: sceneOpacity }}>
      <DotGrid />

      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: 1600,
          perspectiveOrigin: "50% 32%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: STAGE_BASELINE_Y,
            transformStyle: "preserve-3d",
            transform: `translate(-50%, -50%) rotateX(${BASE_TILT_X}deg) rotateY(${drift}deg)`,
          }}
        >
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <Step key={i} index={i} appearFrame={15 + i * 15} />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 560,
          width: "100%",
          textAlign: "center",
          fontFamily,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 96,
          color: TOMATO,
          textShadow: "0 12px 24px rgba(26,26,46,0.35)",
          opacity: labelOpacity,
        }}
      >
        7 SHORTS
      </div>
    </AbsoluteFill>
  );
};
