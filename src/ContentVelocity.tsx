import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const COBALT = "#1C358C";
const TOMATO = "#E74F35";

const SPRING_CONFIG = { stiffness: 60, damping: 20 };

const BLOOM_END = 90; // 3s
const METER_END = 195; // 6.5s
const TOTAL = 318; // 10.6s

const ANGLES_LABEL = 60; // 2s
const RANKED_LABEL = 150; // 5s
const EXAMPLES_LABEL = 240; // 8s

const CENTER = { x: 540, y: 700 };
const COLUMN_X = 280;

const RANKS = [
  { y: 480, size: 210 },
  { y: 690, size: 178 },
  { y: 890, size: 150 },
  { y: 1080, size: 128 },
  { y: 1260, size: 110 },
];

const BLOOM_OFFSETS = RANKS.map((_, i) => {
  const angle = (Math.PI * 2 * i) / RANKS.length - Math.PI / 2;
  const radius = 190;
  return {
    x: CENTER.x + Math.cos(angle) * radius,
    y: CENTER.y + Math.sin(angle) * radius,
  };
});

const CARDS = [
  { y: 480 },
  { y: 690 },
  { y: 890 },
];
const CARD_X = 760;
const CARD_WIDTH = 260;
const CARD_HEIGHT = 150;

const sphereStyle = (glow: number): React.CSSProperties => ({
  position: "absolute",
  borderRadius: "50%",
  background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.65), ${COBALT}55 42%, ${COBALT}a6 80%)`,
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: `1px solid rgba(255,255,255,0.55)`,
  boxShadow: `0 20px 40px rgba(26,26,46,0.22), inset 0 -10px 20px rgba(28,53,140,0.4), inset 0 8px 18px rgba(255,255,255,0.4)${
    glow > 0 ? `, 0 0 ${40 * glow}px ${18 * glow}px ${TOMATO}55` : ""
  }`,
});

const useSpringFrom = (startFrame: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(frame - startFrame, 0);
  return spring({ frame: local, fps, config: SPRING_CONFIG });
};

const CentralSphere: React.FC<{ bloom: number }> = ({ bloom }) => {
  const size = interpolate(bloom, [0, 0.45], [360, 420], { extrapolateRight: "clamp" });
  const opacity = interpolate(bloom, [0, 0.45], [1, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        ...sphereStyle(0),
        left: CENTER.x,
        top: CENTER.y,
        width: size,
        height: size,
        opacity,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

const RankSphere: React.FC<{ index: number; bloom: number; reorder: number }> = ({
  index,
  bloom,
  reorder,
}) => {
  const bloomPos = BLOOM_OFFSETS[index];
  const rank = RANKS[index];

  const bloomX = interpolate(bloom, [0, 1], [CENTER.x, bloomPos.x]);
  const bloomY = interpolate(bloom, [0, 1], [CENTER.y, bloomPos.y]);
  const bloomSize = interpolate(bloom, [0, 0.15, 1], [20, 90, 150]);

  const x = interpolate(reorder, [0, 1], [bloomX, COLUMN_X]);
  const y = interpolate(reorder, [0, 1], [bloomY, rank.y]);
  const size = interpolate(reorder, [0, 1], [bloomSize, rank.size]);

  const opacity = interpolate(bloom, [0, 0.12], [0, 1], { extrapolateRight: "clamp" });
  const glow = index === 0 ? interpolate(reorder, [0.55, 1], [0, 1], { extrapolateLeft: "clamp" }) : 0;

  return (
    <div
      style={{
        ...sphereStyle(glow),
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        transform: "translate(-50%, -50%)",
        border: index === 0 ? `1px solid ${TOMATO}88` : sphereStyle(0).border,
      }}
    />
  );
};

const PotentialMeter: React.FC<{ reorder: number }> = ({ reorder }) => {
  const opacity = interpolate(reorder, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const translateX = interpolate(reorder, [0, 0.3], [-60, 0], { extrapolateRight: "clamp" });
  const fillHeight = interpolate(reorder, [0.1, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const top = RANKS[0].y - RANKS[0].size / 2 - 20;
  const bottom = RANKS[RANKS.length - 1].y + RANKS[RANKS.length - 1].size / 2 + 20;
  const trackHeight = bottom - top;

  return (
    <div
      style={{
        position: "absolute",
        left: COLUMN_X - 130,
        top,
        width: 18,
        height: trackHeight,
        borderRadius: 9,
        opacity,
        transform: `translateX(${translateX}px)`,
        background: `${INK}14`,
        border: `1px solid ${INK}22`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: `${fillHeight * 100}%`,
          background: `linear-gradient(180deg, ${TOMATO}, ${COBALT})`,
        }}
      />
    </div>
  );
};

const GlassCard: React.FC<{ index: number; lineProgress: number }> = ({ index, lineProgress }) => {
  const startFrame = index * 15;
  const local = Math.max(lineProgress - startFrame / TOTAL, 0);
  const appear = interpolate(local, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });

  const translateX = interpolate(appear, [0, 1], [90, 0]);
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const card = CARDS[index];

  return (
    <div
      style={{
        position: "absolute",
        left: CARD_X,
        top: card.y,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 28,
        opacity,
        transform: `translate(0, -50%) translateX(${translateX}px)`,
        background: `linear-gradient(135deg, ${COBALT}33, ${COBALT}0f)`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow:
          "0 20px 36px rgba(26,26,46,0.18), inset 0 -8px 16px rgba(255,255,255,0.25), inset 0 8px 14px rgba(255,255,255,0.3)",
        padding: 18,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "58%",
          borderRadius: 14,
          background: `${INK}12`,
        }}
      />
      <div
        style={{
          marginTop: 12,
          width: "70%",
          height: 8,
          borderRadius: 4,
          background: `${INK}22`,
        }}
      />
      <div
        style={{
          marginTop: 8,
          width: "45%",
          height: 8,
          borderRadius: 4,
          background: `${INK}18`,
        }}
      />
    </div>
  );
};

const ConnectorLines: React.FC<{ lineProgress: number }> = ({ lineProgress }) => {
  const frame = useCurrentFrame();

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "visible" }}
      viewBox="0 0 1080 1920"
    >
      <defs>
        <linearGradient id="cv-line" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={1080} y2={0}>
          <stop offset="0%" stopColor={TOMATO} />
          <stop offset="100%" stopColor={COBALT} />
        </linearGradient>
      </defs>
      {CARDS.map((card, i) => {
        const startFrame = i * 15;
        const local = Math.max(lineProgress - startFrame / TOTAL, 0);
        const appear = interpolate(local, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
        const opacity = interpolate(appear, [0, 1], [0, 0.6]);
        const rank = RANKS[i];

        return (
          <line
            key={i}
            x1={COLUMN_X + rank.size / 2}
            y1={rank.y}
            x2={CARD_X}
            y2={card.y}
            stroke="url(#cv-line)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="9 7"
            strokeDashoffset={-frame * 1.3}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
};

const Label: React.FC<{ startFrame: number; x: number; text: string }> = ({
  startFrame,
  x,
  text,
}) => {
  const appear = useSpringFrom(startFrame);
  const translateY = interpolate(appear, [0, 1], [24, 0]);
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 130,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: 36,
        letterSpacing: 1,
        color: INK,
      }}
    >
      {text}
    </div>
  );
};

export const ContentVelocity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bloom = spring({ frame, fps, config: SPRING_CONFIG });
  const reorder = spring({ frame: Math.max(frame - BLOOM_END, 0), fps, config: SPRING_CONFIG });
  const lineSpring = spring({ frame: Math.max(frame - METER_END, 0), fps, config: SPRING_CONFIG });
  const lineProgress = interpolate(lineSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <PotentialMeter reorder={reorder} />
      <ConnectorLines lineProgress={lineProgress} />
      <CentralSphere bloom={bloom} />
      {RANKS.map((_, i) => (
        <RankSphere key={i} index={i} bloom={bloom} reorder={reorder} />
      ))}
      {CARDS.map((_, i) => (
        <GlassCard key={i} index={i} lineProgress={lineProgress} />
      ))}
      <Label startFrame={ANGLES_LABEL} x={130} text="Angles" />
      <Label startFrame={RANKED_LABEL} x={430} text="Ranked" />
      <Label startFrame={EXAMPLES_LABEL} x={730} text="Examples" />
    </AbsoluteFill>
  );
};
