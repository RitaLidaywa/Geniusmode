import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const COBALT = "#1C358C";

const FONT = "'Times New Roman', Times, serif";

const ENGINE_START = 240; // 8s

const TEXT_APPEAR_END = ENGINE_START + 18;
const TYPE_START = ENGINE_START + 22;
const TYPE_END = ENGINE_START + 47;
const CONFIRM_END = ENGINE_START + 54;
const PARTICLE_START = ENGINE_START + 56;
const PARTICLE_END = ENGINE_START + 82;
const IMPACT_END = PARTICLE_END + 10;
const EXPAND_START = IMPACT_END;
const EXPAND_END = EXPAND_START + 36;

const CENTER = { x: 540, y: 1040 };
const TEXT_Y = 740;

const THEME_WORD = "GROWTH";

const ease = (frame: number, range: number[], output: number[]) =>
  interpolate(frame, range, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const lin = (frame: number, range: number[], output: number[]) =>
  interpolate(frame, range, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const NODE_COUNT = 5;
const NODE_RADIUS = 220;
const nodes = Array.from({ length: NODE_COUNT }).map((_, i) => {
  const angle = ((-90 + i * (360 / NODE_COUNT)) * Math.PI) / 180;
  return {
    x: CENTER.x + Math.cos(angle) * NODE_RADIUS,
    y: CENTER.y + Math.sin(angle) * NODE_RADIUS,
  };
});

// ---------------------------------------------------------------------------
// Dormant / idle geometric frame — visible before the engine activates and
// during its brief expansion burst.
// ---------------------------------------------------------------------------

const IdleFrame: React.FC<{ frame: number }> = ({ frame }) => {
  const idleBreath = 0.75 + 0.25 * Math.abs(Math.sin(frame * 0.03));
  const idleOpacity = frame < EXPAND_START ? 0.5 * idleBreath : 0;

  const burstScale = ease(frame, [EXPAND_START, EXPAND_START + 14], [1, 3.2]);
  const burstOpacity = lin(frame, [EXPAND_START, EXPAND_START + 14], [0.9, 0]);

  const size = 130;
  const isBursting = frame >= EXPAND_START && frame < EXPAND_START + 14;

  return (
    <div
      style={{
        position: "absolute",
        left: CENTER.x,
        top: CENTER.y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(45deg) scale(${
          isBursting ? burstScale : 1
        })`,
        border: `2px solid ${INK}`,
        opacity: isBursting ? burstOpacity : idleOpacity,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Text field — 'Enter Theme...' with a fast, precise typing confirmation
// ---------------------------------------------------------------------------

const TextField: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = ease(frame, [ENGINE_START, TEXT_APPEAR_END], [0, 1]);
  const fadeOut = lin(frame, [PARTICLE_START - 6, PARTICLE_START + 4], [1, 0]);
  const opacity = appear * fadeOut;
  const translateY = interpolate(appear, [0, 1], [14, 0]);

  const typedCount = Math.round(lin(frame, [TYPE_START, TYPE_END], [0, THEME_WORD.length]));
  const showTyped = frame >= TYPE_START;
  const cursorOn = frame < CONFIRM_END && Math.floor(frame / 6) % 2 === 0;

  const lineColor = frame >= TYPE_END && frame < CONFIRM_END ? COBALT : INK;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: TEXT_Y,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: "20pt",
          letterSpacing: "6px",
          color: INK,
          minWidth: 320,
          textAlign: "center",
        }}
      >
        {showTyped ? THEME_WORD.slice(0, typedCount) : "Enter Theme..."}
        <span style={{ opacity: cursorOn ? 1 : 0 }}>|</span>
      </div>
      <div
        style={{
          marginTop: 14,
          width: 320,
          height: 2,
          background: lineColor,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Glowing particle travelling from the text field into the frame
// ---------------------------------------------------------------------------

const Particle: React.FC<{ frame: number }> = ({ frame }) => {
  const travel = ease(frame, [PARTICLE_START, PARTICLE_END], [0, 1]);
  const visible = frame >= PARTICLE_START && frame < PARTICLE_END + 4;

  const x = interpolate(travel, [0, 1], [CENTER.x, CENTER.x]);
  const y = interpolate(travel, [0, 1], [TEXT_Y + 40, CENTER.y]);

  const impactFlash = lin(frame, [PARTICLE_END, PARTICLE_END + 2, IMPACT_END], [0, 1, 0]);
  const impactScale = lin(frame, [PARTICLE_END, IMPACT_END], [1, 5]);

  return (
    <>
      {visible && (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 14,
            height: 14,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            background: COBALT,
            boxShadow: `0 0 18px 6px ${COBALT}aa`,
          }}
        />
      )}
      {frame >= PARTICLE_END && frame < IMPACT_END && (
        <div
          style={{
            position: "absolute",
            left: CENTER.x,
            top: CENTER.y,
            width: 20,
            height: 20,
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${impactScale})`,
            background: COBALT,
            opacity: impactFlash * 0.7,
          }}
        />
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// Research node network — hub + satellites connected by thin lines
// ---------------------------------------------------------------------------

const NodeNetwork: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < EXPAND_START) return null;

  const appear = ease(frame, [EXPAND_START, EXPAND_END], [0, 1]);
  const breathe = frame > EXPAND_END ? 0.85 + 0.15 * Math.sin(frame * 0.05) : 1;

  const hubScale = interpolate(appear, [0, 1], [0.2, 1]) * breathe;
  const hubOpacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "visible" }}
      viewBox="0 0 1080 1920"
    >
      {nodes.map((node, i) => {
        const stagger = i * 3;
        const nodeAppear = ease(
          frame,
          [EXPAND_START + stagger, EXPAND_END + stagger],
          [0, 1],
        );
        const nx = interpolate(nodeAppear, [0, 1], [CENTER.x, node.x]);
        const ny = interpolate(nodeAppear, [0, 1], [CENTER.y, node.y]);
        const lineOpacity = interpolate(nodeAppear, [0.3, 1], [0, 0.55], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const nodeOpacity = interpolate(nodeAppear, [0, 0.2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const nodeR = 16 * (0.3 + 0.7 * nodeAppear) * (frame > EXPAND_END ? breathe : 1);

        return (
          <g key={i}>
            <line
              x1={CENTER.x}
              y1={CENTER.y}
              x2={nx}
              y2={ny}
              stroke={INK}
              strokeWidth={1.5}
              opacity={lineOpacity}
            />
            <circle cx={nx} cy={ny} r={nodeR} fill={COBALT} opacity={nodeOpacity} />
          </g>
        );
      })}

      <circle cx={CENTER.x} cy={CENTER.y} r={22 * hubScale} fill={INK} opacity={hubOpacity} />
    </svg>
  );
};

export const SystemEngineCTA: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <IdleFrame frame={frame} />
      {frame >= ENGINE_START && frame < PARTICLE_START + 4 && <TextField frame={frame} />}
      <Particle frame={frame} />
      <NodeNetwork frame={frame} />
    </AbsoluteFill>
  );
};
