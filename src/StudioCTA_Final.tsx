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
// Phase B — cursor pushing the box
// ---------------------------------------------------------------------------

const CursorArrow: React.FC<{ x: number; y: number; opacity: number; scale?: number }> = ({
  x,
  y,
  opacity,
  scale = 1,
}) => (
  <svg
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      filter: "drop-shadow(0 12px 18px rgba(26,26,46,0.4))",
    }}
    width={64}
    height={64}
    viewBox="0 0 24 24"
  >
    <path
      d="M4 2 L4 19.5 L8.2 15.6 L11 21.8 L13.8 20.5 L11 14.4 L17.5 14.4 Z"
      fill={INK}
      stroke={WHITE}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  </svg>
);

const ClickRipple: React.FC<{ x: number; y: number; frame: number; triggerFrame: number }> = ({
  x,
  y,
  frame,
  triggerFrame,
}) => {
  const scale = lin(frame, [triggerFrame, triggerFrame + 26], [0.2, 2.4]);
  const opacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + 6, triggerFrame + 26],
    [0, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 70,
        height: 70,
        borderRadius: "50%",
        border: `3px solid ${COBALT}`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    />
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

const DeconstructionScene: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  const cursorEnter = lin(frame, [C_END + 5, C_END + 25], [0, 1]);
  const cursorX = lin(cursorEnter, [0, 1], [1300, 640]);
  const cursorY = lin(cursorEnter, [0, 1], [500, 760]);
  const cursorBob = Math.sin(frame * 0.05) * 6;
  const cursorPress = interpolate(
    frame,
    [C_END + 22, C_END + 28, C_END + 34],
    [1, 0.8, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
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
      <ClickRipple x={cursorX} y={cursorY + cursorBob} frame={frame} triggerFrame={C_END + 22} />
      <CursorArrow x={cursorX} y={cursorY + cursorBob} opacity={cursorEnter} scale={cursorPress} />

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

  // Phase B: cursor push
  const boxPushScale = lin(frame, [A_END + 20, A_END + 55], [1, 1.32]);
  const boxScale = frame < A_END ? boxScaleA : boxPushScale;

  const cursorBEnter = lin(frame, [A_END, A_END + 35], [0, 1]);
  const cursorBExit = lin(frame, [B_END - 45, B_END - 10], [0, 1]);
  const cursorBX = lin(cursorBEnter, [0, 1], [1500, 700]);
  const cursorBY = lin(cursorBEnter, [0, 1], [2200, 940]);
  const cursorBExitX = lin(cursorBExit, [0, 1], [700, 1500]);
  const cursorBExitY = lin(cursorBExit, [0, 1], [940, 2200]);
  const cursorBActiveX = frame < B_END - 45 ? cursorBX : cursorBExitX;
  const cursorBActiveY = frame < B_END - 45 ? cursorBY : cursorBExitY;
  const cursorBOpacity =
    frame < A_END
      ? 0
      : frame < B_END - 45
        ? cursorBEnter
        : 1 - cursorBExit;
  const cursorBPress = interpolate(
    frame,
    [A_END + 28, A_END + 36, A_END + 44],
    [1, 0.8, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
        <ClickRipple x={cursorBActiveX} y={cursorBActiveY} frame={frame} triggerFrame={A_END + 30} />
        <CursorArrow x={cursorBActiveX} y={cursorBActiveY} opacity={cursorBOpacity} scale={cursorBPress} />
      </AbsoluteFill>

      <UIScene opacity={uiOpacity} frame={frame} />

      <DeconstructionScene opacity={workspaceOpacity} frame={frame} />
    </AbsoluteFill>
  );
};
