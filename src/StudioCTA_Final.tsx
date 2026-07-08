import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const COBALT = "#1C358C";
const WHITE = "#FFFFFF";

const FONT = "'Times New Roman', Times, serif";

// Phase boundaries (30fps)
const A_END = 120; // 4s — box floats in
const B_END = 240; // 8s — hand pushes box
const C_END = 360; // 12s — UI mimic / paste

const CENTER = { x: 540, y: 860 };

const lin = (frame: number, range: [number, number], output: [number, number]) =>
  interpolate(frame, range, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const glassPanel = (shade: string): React.CSSProperties => ({
  background: `linear-gradient(135deg, ${shade}, ${shade})`,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow:
    "0 26px 48px rgba(26,26,46,0.4), inset 0 -14px 24px rgba(0,0,0,0.25), inset 0 14px 22px rgba(255,255,255,0.45)",
});

const Specular: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      background: "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.55), transparent 55%)",
    }}
  />
);

// ---------------------------------------------------------------------------
// Phase A — 3D glass box floating into center
// ---------------------------------------------------------------------------

const GlassBox: React.FC<{ scale: number; entryY: number; rotY: number; rotX: number }> = ({
  scale,
  entryY,
  rotY,
  rotX,
}) => {
  const size = 300;
  const half = size / 2;

  const faces: { transform: string; shade: string; specular: boolean }[] = [
    { transform: `translateZ(${half}px)`, shade: "#3854A8ef", specular: true },
    { transform: `rotateY(180deg) translateZ(${half}px)`, shade: "#22337aef", specular: false },
    { transform: `rotateY(90deg) translateZ(${half}px)`, shade: "#16265fef", specular: false },
    { transform: `rotateY(-90deg) translateZ(${half}px)`, shade: "#16265fef", specular: false },
    { transform: `rotateX(90deg) translateZ(${half}px)`, shade: "#5875D2ef", specular: true },
    { transform: `rotateX(-90deg) translateZ(${half}px)`, shade: "#101a44ef", specular: false },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: CENTER.x,
        top: CENTER.y,
        transform: `translate(-50%, -50%) translateY(${entryY}px)`,
        perspective: 1600,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
        }}
      >
        {faces.map((face, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: 18,
              ...glassPanel(face.shade),
              transform: face.transform,
            }}
          >
            {face.specular && <Specular />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Phase B — stylized glass hand pushing the box
// ---------------------------------------------------------------------------

const FingerCapsule: React.FC<{ w: number; h: number; rotate: number; originX: number }> = ({
  w,
  h,
  rotate,
  originX,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: "62%",
      left: originX,
      width: w,
      height: h,
      borderRadius: w / 2,
      transform: `rotate(${rotate}deg)`,
      transformOrigin: "bottom center",
      ...glassPanel("#2A44A0f0"),
    }}
  />
);

const GlassHand: React.FC<{ x: number; y: number; rotate: number; opacity: number }> = ({
  x,
  y,
  rotate,
  opacity,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 220,
        height: 320,
        opacity,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      }}
    >
      {/* palm */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          width: 150,
          height: 190,
          borderRadius: 46,
          transform: "translateX(-50%)",
          ...glassPanel("#22337af0"),
        }}
      >
        <Specular />
      </div>
      {/* thumb */}
      <FingerCapsule w={38} h={95} rotate={-55} originX={4} />
      {/* fingers */}
      <FingerCapsule w={34} h={150} rotate={-16} originX={40} />
      <FingerCapsule w={36} h={168} rotate={-4} originX={80} />
      <FingerCapsule w={34} h={160} rotate={10} originX={120} />
      <FingerCapsule w={30} h={130} rotate={24} originX={155} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Phase C — description card, text selection, paste into chat
// ---------------------------------------------------------------------------

const DESCRIPTION_LINE_1 = "Create a 60-second script";
const DESCRIPTION_LINE_2 = "about morning routines.";

const UIScene: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  const cardAppear = lin(frame, [C_END - 116, C_END - 100], [0, 1]);
  const cardY = lin(cardAppear, [0, 1], [30, 0]);

  const selectProgress = lin(frame, [C_END - 90, C_END - 60], [0, 1]);
  const lineWidth = DESCRIPTION_LINE_2.length * 19.5;
  const highlightWidth = lineWidth * selectProgress;

  const pasteAppear = lin(frame, [C_END - 45, C_END - 25], [0, 1]);
  const pasteY = lin(pasteAppear, [0, 1], [24, 0]);

  const cursorX = 100 + highlightWidth;
  const cursorVisible = selectProgress > 0 && selectProgress < 1.02;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 420,
          opacity: cardAppear,
          transform: `translateY(${cardY}px)`,
          borderRadius: 32,
          padding: "40px 44px",
          background: `${INK}0d`,
          border: `1px solid ${INK}22`,
        }}
      >
        <div style={{ fontFamily: FONT, fontSize: 32, color: INK, lineHeight: 1.5 }}>
          {DESCRIPTION_LINE_1}
        </div>
        <div style={{ position: "relative", fontFamily: FONT, fontSize: 32, color: INK, marginTop: 4 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 4,
              width: highlightWidth,
              height: 38,
              background: `${COBALT}33`,
              borderRadius: 4,
            }}
          />
          <span style={{ position: "relative" }}>{DESCRIPTION_LINE_2}</span>
          {cursorVisible && (
            <div
              style={{
                position: "absolute",
                left: cursorX,
                top: -6,
                width: 2,
                height: 46,
                background: COBALT,
              }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 260,
          height: 108,
          borderRadius: 54,
          opacity: pasteAppear,
          transform: `translateY(${pasteY}px)`,
          background: WHITE,
          border: `1px solid ${INK}24`,
          boxShadow: "0 14px 28px rgba(26,26,46,0.1)",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
        }}
      >
        <span style={{ fontFamily: FONT, fontSize: 30, color: INK }}>
          {DESCRIPTION_LINE_1} {DESCRIPTION_LINE_2}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Phase D — white workspace, script deconstructing into building blocks
// ---------------------------------------------------------------------------

const GRID_COLS = 3;
const GRID_ROWS = 6;
const PAGE = { x: 470, y: 780, w: 260, h: 460 };
const CELL_W = PAGE.w / GRID_COLS;
const CELL_H = PAGE.h / GRID_ROWS;

const ORGANIZED_COLS = 6;
const BLOCK_W = 132;
const BLOCK_H = 96;
const BLOCK_GAP = 14;
const BLOCK_START = { x: 150, y: 1150 };

const AbstractFigure: React.FC<{ frame: number }> = ({ frame }) => {
  const bob = Math.sin(frame * 0.05) * 6;
  return (
    <div style={{ position: "absolute", left: 850, top: 700 + bob }}>
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: COBALT,
        }}
      />
      <div
        style={{
          width: 90,
          height: 130,
          marginTop: 8,
          marginLeft: -10,
          borderRadius: 20,
          background: INK,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 90,
          left: -60,
          width: 70,
          height: 16,
          borderRadius: 8,
          background: INK,
          transform: "rotate(18deg)",
          transformOrigin: "right center",
        }}
      />
    </div>
  );
};

const DeconstructionScene: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  const cells = Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);

    const homeX = PAGE.x + col * CELL_W + CELL_W / 2;
    const homeY = PAGE.y + row * CELL_H + CELL_H / 2;

    const orgCol = i % ORGANIZED_COLS;
    const orgRow = Math.floor(i / ORGANIZED_COLS);
    const targetX = BLOCK_START.x + orgCol * (BLOCK_W + BLOCK_GAP) + BLOCK_W / 2;
    const targetY = BLOCK_START.y + orgRow * (BLOCK_H + BLOCK_GAP) + BLOCK_H / 2;

    const start = C_END + 20 + i * 3;
    const end = start + 34;
    const progress = lin(frame, [start, end], [0, 1]);

    const x = homeX + (targetX - homeX) * progress;
    const y = homeY + (targetY - homeY) * progress;
    const w = CELL_W - 8 + (BLOCK_W - (CELL_W - 8)) * progress;
    const h = CELL_H - 8 + (BLOCK_H - (CELL_H - 8)) * progress;
    const rotate = (1 - progress) * (i % 2 === 0 ? 6 : -6);

    return { key: i, x, y, w, h, rotate };
  });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: WHITE }}>
      <AbstractFigure frame={frame} />

      <div
        style={{
          position: "absolute",
          left: PAGE.x,
          top: PAGE.y,
          width: PAGE.w,
          height: PAGE.h,
          border: `2px solid ${INK}55`,
          borderRadius: 12,
        }}
      />

      {cells.map((c) => (
        <div
          key={c.key}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y,
            width: c.w,
            height: c.h,
            transform: `translate(-50%, -50%) rotate(${c.rotate}deg)`,
            borderRadius: 10,
            border: `2px solid ${COBALT}`,
            background: `${COBALT}14`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export const StudioCTA_Final: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase A: box entry
  const boxEntryProgress = lin(frame, [0, 105], [0, 1]);
  const boxEntryY = lin(boxEntryProgress, [0, 1], [-700, 0]);
  const boxScaleA = lin(boxEntryProgress, [0, 1], [0.5, 1]);
  const constantSpin = frame * 0.25;

  // Phase B: hand push
  const boxPushScale = lin(frame, [A_END + 20, A_END + 55], [1, 1.32]);
  const boxScale = frame < A_END ? boxScaleA : boxPushScale;

  const handEnter = lin(frame, [A_END, A_END + 35], [0, 1]);
  const handExit = lin(frame, [B_END - 45, B_END - 10], [0, 1]);
  const handX = lin(handEnter, [0, 1], [1500, 760]);
  const handY = lin(handEnter, [0, 1], [2200, 1000]);
  const handExitX = lin(handExit, [0, 1], [760, 1500]);
  const handExitY = lin(handExit, [0, 1], [1000, 2200]);
  const handActiveX = frame < B_END - 45 ? handX : handExitX;
  const handActiveY = frame < B_END - 45 ? handY : handExitY;
  const handOpacity =
    frame < A_END
      ? 0
      : frame < B_END - 45
        ? handEnter
        : 1 - handExit;

  // scene A/B combined opacity (fades out into UI mimic)
  const sceneABOpacity = 1 - lin(frame, [C_END - 130, C_END - 110], [0, 1]);

  // Phase C opacity
  const uiOpacity = lin(frame, [C_END - 130, C_END - 105], [0, 1]) * (1 - lin(frame, [C_END - 5, C_END + 10], [0, 1]));

  // Phase D opacity
  const workspaceOpacity = lin(frame, [C_END - 10, C_END + 15], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <AbsoluteFill style={{ opacity: sceneABOpacity }}>
        <GlassBox scale={boxScale} entryY={boxEntryY} rotY={constantSpin} rotX={12} />
        <GlassHand x={handActiveX} y={handActiveY} rotate={-35} opacity={handOpacity} />
      </AbsoluteFill>

      <UIScene opacity={uiOpacity} frame={frame} />

      <DeconstructionScene opacity={workspaceOpacity} frame={frame} />
    </AbsoluteFill>
  );
};
