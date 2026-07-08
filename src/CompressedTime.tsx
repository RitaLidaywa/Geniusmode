import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const COBALT = "#1C358C";

const SPRING_CONFIG = { stiffness: 60, damping: 20 };

const CHAOS_END = 45; // 1.5s
const SWEEP_END = 60; // 2.0s
const TEXT1_START = 90; // 3.0s
const TEXT2_START = 120; // 4.0s

const CENTER = { x: 540, y: 860 };

const LINE_COUNT = 26;
const DOT_COUNT = 40;

const pseudo = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const ChaosLines: React.FC<{ frameForChaos: number }> = ({ frameForChaos }) => {
  const lines = Array.from({ length: LINE_COUNT }).map((_, i) => {
    const baseAngle = (360 / LINE_COUNT) * i;
    const speed = 3 + (i % 5) * 1.6;
    const angleDeg = baseAngle + frameForChaos * speed;
    const angle = (angleDeg * Math.PI) / 180;

    const radius = 90 + (i % 4) * 42 + Math.sin(frameForChaos * 0.3 + i) * 22;
    const length = 55 + (i % 3) * 28;

    const x1 = CENTER.x + Math.cos(angle) * radius;
    const y1 = CENTER.y + Math.sin(angle) * radius;
    const x2 = CENTER.x + Math.cos(angle) * (radius + length);
    const y2 = CENTER.y + Math.sin(angle) * (radius + length);

    const color = i % 2 === 0 ? COBALT : INK;
    const opacity = 0.22 + 0.18 * pseudo(i * 3.1);

    return { x1, y1, x2, y2, color, opacity, key: i };
  });

  const dots = Array.from({ length: DOT_COUNT }).map((_, i) => {
    const angle = pseudo(i) * Math.PI * 2;
    const radius = 40 + pseudo(i + 50) * 280;
    const x = CENTER.x + Math.cos(angle) * radius;
    const y = CENTER.y + Math.sin(angle) * radius;
    const flicker = 0.25 + 0.6 * Math.abs(Math.sin(frameForChaos * 0.22 + i));

    return { x, y, flicker, key: i };
  });

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1080,
        height: 1920,
        filter: "blur(2.5px)",
      }}
      viewBox="0 0 1080 1920"
    >
      {lines.map((l) => (
        <line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={l.color}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={l.opacity}
        />
      ))}
      {dots.map((d) => (
        <circle key={d.key} cx={d.x} cy={d.y} r={2.4} fill={INK} opacity={d.flicker * 0.4} />
      ))}
    </svg>
  );
};

const SweepLens: React.FC<{ frame: number }> = ({ frame }) => {
  const sweepAngle = interpolate(frame, [CHAOS_END, SWEEP_END], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringOpacity = interpolate(
    frame,
    [CHAOS_END, CHAOS_END + 4, SWEEP_END, SWEEP_END + 14],
    [0, 0.5, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const handAngleRad = ((sweepAngle - 90) * Math.PI) / 180;
  const handX = CENTER.x + Math.cos(handAngleRad) * 520;
  const handY = CENTER.y + Math.sin(handAngleRad) * 520;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: CENTER.x,
          top: CENTER.y,
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          border: `1px solid ${INK}`,
          opacity: ringOpacity,
          transform: "translate(-50%, -50%)",
        }}
      />
      <svg
        style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "visible" }}
        viewBox="0 0 1080 1920"
      >
        <line
          x1={CENTER.x}
          y1={CENTER.y}
          x2={handX}
          y2={handY}
          stroke={COBALT}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={ringOpacity}
        />
      </svg>
    </>
  );
};

const GlassObject: React.FC<{ appear: number }> = ({ appear }) => {
  const size = interpolate(appear, [0, 1], [40, 440]);
  const glow = interpolate(appear, [0, 1], [0, 1]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: CENTER.x,
          top: CENTER.y,
          width: 700,
          height: 700,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          opacity: glow * 0.55,
          background: `radial-gradient(circle, ${COBALT}33, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: CENTER.x,
          top: CENTER.y,
          width: size,
          height: size,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7), ${COBALT}55 42%, ${COBALT}b3 80%)`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow: `0 30px 60px rgba(26,26,46,0.25), inset 0 -16px 30px rgba(28,53,140,0.45), inset 0 14px 26px rgba(255,255,255,0.4), 0 0 ${
            70 * glow
          }px ${24 * glow}px ${COBALT}40`,
        }}
      />
    </>
  );
};

const TextLine: React.FC<{ startFrame: number; y: number; text: string }> = ({
  startFrame,
  y,
  text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const local = Math.max(frame - startFrame, 0);
  const appear = spring({ frame: local, fps, config: SPRING_CONFIG });
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const translateY = interpolate(appear, [0, 1], [16, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        textAlign: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: 44,
        color: INK,
      }}
    >
      {text}
    </div>
  );
};

export const CompressedTime: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const frameForChaos = Math.min(frame, CHAOS_END);
  const chaosOpacity = interpolate(frame, [SWEEP_END - 2, SWEEP_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sweepAngle = interpolate(frame, [CHAOS_END, SWEEP_END], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glassAppear = spring({
    frame: Math.max(frame - SWEEP_END, 0),
    fps,
    config: SPRING_CONFIG,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: chaosOpacity,
          maskImage: `conic-gradient(from 0deg at ${CENTER.x}px ${CENTER.y}px, transparent 0deg, transparent ${sweepAngle}deg, black ${sweepAngle}deg, black 360deg)`,
          WebkitMaskImage: `conic-gradient(from 0deg at ${CENTER.x}px ${CENTER.y}px, transparent 0deg, transparent ${sweepAngle}deg, black ${sweepAngle}deg, black 360deg)`,
        }}
      >
        <ChaosLines frameForChaos={frameForChaos} />
      </div>

      <SweepLens frame={frame} />

      <GlassObject appear={glassAppear} />

      <TextLine startFrame={TEXT1_START} y={1320} text="Spend less time deciding," />
      <TextLine startFrame={TEXT2_START} y={1390} text="More time creating." />
    </AbsoluteFill>
  );
};
