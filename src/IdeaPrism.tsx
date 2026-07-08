import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const COBALT = "#1C358C";

const SPRING_CONFIG = { stiffness: 60, damping: 20 };

const VERTICES = [
  { x: 0, y: -230 },
  { x: -200, y: 150 },
  { x: 200, y: 150 },
];

const DOTTED_BACKGROUND: React.CSSProperties = {
  backgroundImage: `radial-gradient(circle, ${INK}26 1.5px, transparent 1.6px)`,
  backgroundSize: "30px 30px",
};

const useSplit = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame, fps, config: SPRING_CONFIG });
};

const CentralSphere: React.FC<{ split: number }> = ({ split }) => {
  const size = interpolate(split, [0, 0.45], [420, 480], { extrapolateRight: "clamp" });
  const opacity = interpolate(split, [0, 0.45], [1, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        opacity,
        transform: `translate(-50%, -50%)`,
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.6), ${COBALT}66 42%, ${COBALT}b3 78%)`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow:
          "0 30px 60px rgba(26,26,46,0.25), inset 0 -16px 30px rgba(28,53,140,0.4), inset 0 14px 26px rgba(255,255,255,0.35)",
      }}
    />
  );
};

const SmallSphere: React.FC<{ vertex: { x: number; y: number }; split: number; seed: number }> = ({
  vertex,
  split,
  seed,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(split, [0, 0.15, 1], [0.1, 0.4, 1]);
  const opacity = interpolate(split, [0, 0.12], [0, 1], { extrapolateRight: "clamp" });

  const driftX = Math.sin(frame * 0.05 + seed * 12) * 5 * split;
  const driftY = Math.cos(frame * 0.045 + seed * 9) * 5 * split;

  const x = vertex.x * split + driftX;
  const y = vertex.y * split + driftY;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 190,
        height: 190,
        borderRadius: "50%",
        opacity,
        transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.65), ${COBALT}55 42%, ${COBALT}a6 80%)`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow:
          "0 18px 34px rgba(26,26,46,0.22), inset 0 -10px 18px rgba(28,53,140,0.4), inset 0 8px 16px rgba(255,255,255,0.4)",
      }}
    />
  );
};

const PrismLines: React.FC<{ split: number }> = ({ split }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(split, [0.3, 0.55], [0, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];

  const points = VERTICES.map((v) => ({ x: v.x * split, y: v.y * split }));

  return (
    <svg
      style={{
        position: "absolute",
        left: -500,
        top: -500,
        width: 1000,
        height: 1000,
        overflow: "visible",
      }}
      viewBox="-500 -500 1000 1000"
    >
      <defs>
        <linearGradient id="iridescent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1C358C" />
          <stop offset="45%" stopColor="#7FB3E8" />
          <stop offset="70%" stopColor="#D9A7E0" />
          <stop offset="100%" stopColor="#1C358C" />
        </linearGradient>
      </defs>
      {pairs.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a].x}
          y1={points[a].y}
          x2={points[b].x}
          y2={points[b].y}
          stroke="url(#iridescent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="9 7"
          strokeDashoffset={-frame * 1.4}
          opacity={opacity}
        />
      ))}
    </svg>
  );
};

const Caption: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(frame - startFrame, 0);
  const appear = spring({ frame: localFrame, fps, config: SPRING_CONFIG });

  const translateY = interpolate(appear, [0, 1], [30, 0]) + 400;
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        opacity,
        transform: `translate(-50%, -50%) translateY(${translateY}px)`,
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: 48,
        letterSpacing: 1,
        color: INK,
        whiteSpace: "nowrap",
      }}
    >
      Idea Sources: 3
    </div>
  );
};

export const IdeaPrism: React.FC = () => {
  const split = useSplit();

  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <AbsoluteFill style={DOTTED_BACKGROUND} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 0, height: 0 }}>
          <CentralSphere split={split} />
          <PrismLines split={split} />
          {VERTICES.map((vertex, i) => (
            <SmallSphere key={i} vertex={vertex} split={split} seed={i} />
          ))}
          <Caption startFrame={52} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
