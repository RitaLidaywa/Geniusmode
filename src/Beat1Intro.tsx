import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
// Placeholder for the brand font asset — swap in the real brand font file
// once available (e.g. via `@remotion/fonts` + a bundled woff2).
const fontFamily =
  '"Helvetica Neue", Arial, "Segoe UI", system-ui, sans-serif';

const BG = "#FFFAE5";
const INK = "#1B1B2F";
const GRID_DOT = "rgba(27, 27, 47, 0.10)";

type SphereSpec = {
  size: number;
  left: number; // percent
  top: number; // percent
  delay: number; // frames
  tint: string;
  ring?: boolean;
  floatAmp: number;
  floatSpeed: number;
  phase: number;
};

const SPHERES: SphereSpec[] = [
  {
    size: 360,
    left: 62,
    top: 20,
    delay: 4,
    tint: "rgba(120, 150, 255, 0.30)",
    floatAmp: 18,
    floatSpeed: 0.055,
    phase: 0,
  },
  {
    size: 190,
    left: 12,
    top: 34,
    delay: 12,
    tint: "rgba(150, 120, 255, 0.28)",
    floatAmp: 14,
    floatSpeed: 0.07,
    phase: 1.4,
  },
  {
    size: 130,
    left: 78,
    top: 46,
    delay: 18,
    tint: "rgba(255, 190, 120, 0.30)",
    ring: true,
    floatAmp: 20,
    floatSpeed: 0.05,
    phase: 2.7,
  },
  {
    size: 90,
    left: 20,
    top: 58,
    delay: 24,
    tint: "rgba(120, 210, 255, 0.30)",
    ring: true,
    floatAmp: 16,
    floatSpeed: 0.065,
    phase: 4.1,
  },
  {
    size: 200,
    left: 10,
    top: 56,
    delay: 8,
    tint: "rgba(120, 150, 255, 0.24)",
    floatAmp: 12,
    floatSpeed: 0.045,
    phase: 3.2,
  },
  {
    size: 70,
    left: 70,
    top: 66,
    delay: 30,
    tint: "rgba(150, 120, 255, 0.32)",
    ring: true,
    floatAmp: 22,
    floatSpeed: 0.08,
    phase: 5.6,
  },
  {
    size: 120,
    left: 55,
    top: 58,
    delay: 14,
    tint: "rgba(255, 190, 120, 0.24)",
    floatAmp: 10,
    floatSpeed: 0.06,
    phase: 0.8,
  },
];

const Sphere: React.FC<{ spec: SphereSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - spec.delay);

  const entrance = spring({
    fps,
    frame: local,
    config: { damping: 14, mass: 0.7, stiffness: 90 },
  });

  const scale = interpolate(entrance, [0, 1], [0.2, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const riseIn = interpolate(entrance, [0, 1], [70, 0]);
  const float =
    Math.sin(frame * spec.floatSpeed + spec.phase) * spec.floatAmp;

  const translateY = riseIn + float;

  return (
    <div
      style={{
        position: "absolute",
        left: `${spec.left}%`,
        top: `${spec.top}%`,
        width: spec.size,
        height: spec.size,
        transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
        opacity,
      }}
    >
      {spec.ring ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `2.5px solid ${spec.tint}`,
            background:
              "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), rgba(255,255,255,0.04) 55%, transparent 70%)",
            boxShadow: `0 12px 30px rgba(27,27,47,0.10), inset 0 0 20px rgba(255,255,255,0.25)`,
            backdropFilter: "blur(2px)",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 26%, rgba(255,255,255,0.85), ${spec.tint} 45%, rgba(255,255,255,0.10) 100%)`,
            boxShadow: `0 20px 45px rgba(27,27,47,0.14), inset 0 0 30px rgba(255,255,255,0.35)`,
            backdropFilter: "blur(1px)",
          }}
        />
      )}
    </div>
  );
};

const DotGrid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(${GRID_DOT} 1.6px, transparent 1.6px)`,
      backgroundSize: "46px 46px",
      backgroundPosition: "-10px -10px",
    }}
  />
);

const TextCard: React.FC<{
  text: string;
  enterAt: number;
  exitAt: number;
}> = ({ text, enterAt, exitAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    fps,
    frame: frame - enterAt,
    config: { damping: 18, mass: 0.8, stiffness: 120 },
  });

  const fadeOut = interpolate(frame, [exitAt - 10, exitAt], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(enter, [0, 1], [0, 1]) * fadeOut;
  const translateY = interpolate(enter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 340,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          width: "86%",
          textAlign: "center",
          fontFamily,
          fontWeight: 700,
          fontSize: 66,
          lineHeight: 1.18,
          color: INK,
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Beat1Intro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <DotGrid />
      {SPHERES.map((spec, i) => (
        <Sphere key={i} spec={spec} />
      ))}
      <Sequence durationInFrames={120}>
        <TextCard
          text="Making AI videos in 2026 just got easier."
          enterAt={9}
          exitAt={120}
        />
      </Sequence>
      <Sequence from={120} durationInFrames={150}>
        <TextCard text="5-step process. 7 shorts." enterAt={6} exitAt={150} />
      </Sequence>
    </AbsoluteFill>
  );
};
