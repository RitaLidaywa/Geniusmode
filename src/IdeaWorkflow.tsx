import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const COBALT = "#1C358C";

const PHASE_DURATION = 61; // ~2.03s at 30fps, 3 phases across 6.1s (183 frames)

const SPRING_CONFIG = { stiffness: 60, damping: 20 };

const COLUMN_OFFSETS = [-480, 0, 480];

const ITEMS = [
  { label: "Research", columnOffset: COLUMN_OFFSETS[0] },
  { label: "Validate", columnOffset: COLUMN_OFFSETS[1] },
  { label: "Organize", columnOffset: COLUMN_OFFSETS[2] },
];

const GlassCard: React.FC<{
  startFrame: number;
  columnOffset: number;
  driftSeed: number;
}> = ({ startFrame, columnOffset, driftSeed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(frame - startFrame, 0);
  const appear = spring({
    frame: localFrame,
    fps,
    config: SPRING_CONFIG,
  });

  const driftAmount = 1 - appear;
  const driftX = Math.sin((frame + driftSeed * 37) * 0.045) * 46 * driftAmount;
  const driftY = Math.cos((frame + driftSeed * 29) * 0.05) * 34 * driftAmount;
  const rotateY = Math.sin((frame + driftSeed * 21) * 0.04) * 22 * driftAmount;
  const rotateX = Math.cos((frame + driftSeed * 17) * 0.035) * 16 * driftAmount;

  const translateY = interpolate(appear, [0, 1], [280, columnOffset]) + driftY;
  const translateX = interpolate(appear, [0, 1], [driftSeed % 2 === 0 ? -180 : 180, 0]) + driftX;
  const translateZ = interpolate(appear, [0, 1], [220, 0]);
  const scale = interpolate(appear, [0, 1], [0.7, 1]);
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        opacity,
        transform: `translate(-50%, -50%) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: 64,
          background: `linear-gradient(135deg, ${COBALT}99, ${COBALT}38)`,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow:
            "0 30px 60px rgba(26,26,46,0.25), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -20px 40px rgba(28,53,140,0.15)",
        }}
      />
    </div>
  );
};

const Label: React.FC<{ startFrame: number; columnOffset: number; text: string }> = ({
  startFrame,
  columnOffset,
  text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(frame - (startFrame + 10), 0);
  const appear = spring({
    frame: localFrame,
    fps,
    config: SPRING_CONFIG,
  });

  const translateY = interpolate(appear, [0, 1], [40, 0]) + columnOffset;
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        opacity,
        transform: `translate(-50%, -50%) translateY(${translateY + 190}px)`,
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: 76,
        color: INK,
        letterSpacing: 2,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const IdeaWorkflow: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <AbsoluteFill style={{ perspective: 1400 }}>
        {ITEMS.map((item, i) => (
          <GlassCard
            key={item.label}
            startFrame={i * PHASE_DURATION}
            columnOffset={item.columnOffset}
            driftSeed={i}
          />
        ))}
        {ITEMS.map((item, i) => (
          <Label
            key={item.label}
            startFrame={i * PHASE_DURATION}
            columnOffset={item.columnOffset}
            text={item.label}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
