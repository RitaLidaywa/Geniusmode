import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const TOMATO = "#E74F35";

const POP_END = 15; // 0.5s
const CYCLE_FRAMES = 45; // 1.5s per pulse — matches the 0.5s-2.0s window

const CHEVRON_PATH = "M -95 -55 L 0 45 L 95 -55";
const STROKE_WIDTH = 58;
const OUTLINE_WIDTH = STROKE_WIDTH + 8; // 4px extra on each side

export const StudioTomatoPointer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { stiffness: 220, damping: 14 } });
  const popScale = interpolate(pop, [0, 1], [0.8, 1]);

  const pulseT = Math.max(frame - POP_END, 0);
  const pulseProgress = 0.5 - 0.5 * Math.cos((pulseT / CYCLE_FRAMES) * Math.PI * 2);
  const pulseY = pulseProgress * 46;

  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <svg
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          overflow: "visible",
          transform: `translate(-50%, -50%) translateY(${pulseY}px) scale(${popScale})`,
        }}
        width={1}
        height={1}
      >
        <defs>
          <filter id="grainFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves={2}
              seed={7}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0 0.05  0 0 0 0.4 0"
              result="grainColor"
            />
            <feComposite in="grainColor" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        <path
          d={CHEVRON_PATH}
          fill="none"
          stroke={INK}
          strokeWidth={OUTLINE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={CHEVRON_PATH}
          fill="none"
          stroke={TOMATO}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={CHEVRON_PATH}
          fill="none"
          stroke="black"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.5}
          style={{ mixBlendMode: "multiply" }}
          filter="url(#grainFilter)"
        />
      </svg>
    </AbsoluteFill>
  );
};
