import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const COBALT = "#1C358C";

const PHASE_DURATION = 61; // ~2.03s at 30fps, 3 phases across 6.1s (183 frames)

const SPRING_CONFIG = { stiffness: 60, damping: 20 };

const Phase: React.FC<{ startFrame: number; children: React.ReactNode }> = ({
  startFrame,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(frame - startFrame, 0);
  const appear = spring({
    frame: localFrame,
    fps,
    config: SPRING_CONFIG,
  });

  const translateY = interpolate(appear, [0, 1], [80, 0]);
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 160,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {children}
    </div>
  );
};

const ResearchShape: React.FC = () => (
  <svg width={100} height={100} viewBox="0 0 100 100">
    <circle cx={42} cy={42} r={30} fill="none" stroke={COBALT} strokeWidth={10} />
    <line x1={64} y1={64} x2={90} y2={90} stroke={INK} strokeWidth={10} strokeLinecap="round" />
  </svg>
);

const ValidateShape: React.FC = () => (
  <svg width={100} height={100} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={44} fill={COBALT} />
    <path
      d="M30 52 L44 66 L72 34"
      fill="none"
      stroke={DAISY}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OrganizeShape: React.FC = () => (
  <svg width={100} height={100} viewBox="0 0 100 100">
    <rect x={10} y={12} width={80} height={20} rx={6} fill={COBALT} />
    <rect x={10} y={40} width={80} height={20} rx={6} fill={INK} />
    <rect x={10} y={68} width={80} height={20} rx={6} fill={COBALT} />
  </svg>
);

export const ResearchValidation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
        }}
      >
        <Phase startFrame={0 * PHASE_DURATION}>
          <ResearchShape />
        </Phase>
        <Phase startFrame={1 * PHASE_DURATION}>
          <ValidateShape />
        </Phase>
        <Phase startFrame={2 * PHASE_DURATION}>
          <OrganizeShape />
        </Phase>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
