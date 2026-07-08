import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const COBALT = "#1C358C";
const TOMATO = "#E74F35";

const SPRING_CONFIG = { stiffness: 60, damping: 20 };

const PROMPT_TEXT =
  "YouTube Content Strategist: find my top 3 trending video topics this week.";

const TYPE_END = 90; // 3s
const SEND_CLICK = 90;
const TABLE_START = 180; // 6s

const TABLE_ROWS = [
  { topic: "AI Tools Roundup", views: "482K", trend: "▲ 38%" },
  { topic: "Studio Setup Tips", views: "310K", trend: "▲ 22%" },
  { topic: "Faceless Automation", views: "275K", trend: "▲ 19%" },
  { topic: "Editing Shortcuts", views: "198K", trend: "▲ 12%" },
];

const glassStyle = (tint: string, alpha1: string, alpha2: string): React.CSSProperties => ({
  background: `linear-gradient(135deg, ${tint}${alpha1}, ${tint}${alpha2})`,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: `1px solid rgba(255,255,255,0.5)`,
  boxShadow:
    "0 20px 40px rgba(26,26,46,0.15), inset 0 -10px 20px rgba(255,255,255,0.25), inset 0 10px 18px rgba(255,255,255,0.3)",
});

const TypingPrompt: React.FC = () => {
  const frame = useCurrentFrame();

  const charCount = Math.floor(
    interpolate(frame, [0, TYPE_END - 6], [0, PROMPT_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const visibleText = PROMPT_TEXT.slice(0, charCount);

  const cursorVisible = frame < TYPE_END + 4 && Math.floor(frame / 15) % 2 === 0;

  const bubbleOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 260,
        minHeight: 200,
        borderRadius: 40,
        padding: "44px 48px",
        opacity: bubbleOpacity,
        ...glassStyle(INK, "14", "05"),
      }}
    >
      <div
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: 40,
          lineHeight: 1.4,
          color: INK,
        }}
      >
        {visibleText}
        <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
      </div>
      <SendButton />
    </div>
  );
};

const SendButton: React.FC = () => {
  const frame = useCurrentFrame();

  const click = interpolate(frame, [SEND_CLICK - 4, SEND_CLICK, SEND_CLICK + 6], [1, 0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [SEND_CLICK + 10, SEND_CLICK + 26], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        bottom: 32,
        width: 92,
        height: 92,
        borderRadius: "50%",
        opacity,
        transform: `scale(${click})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...glassStyle(COBALT, "cc", "88"),
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "14px solid transparent",
          borderBottom: "14px solid transparent",
          borderLeft: `20px solid ${DAISY}`,
          marginLeft: 6,
        }}
      />
    </div>
  );
};

const ProcessingIndicator: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [SEND_CLICK + 6, SEND_CLICK + 20, TABLE_START - 12, TABLE_START],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 500,
        width: 200,
        height: 84,
        borderRadius: 42,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        ...glassStyle(COBALT, "40", "18"),
      }}
    >
      {[0, 1, 2].map((i) => {
        const dotScale = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(frame * 0.25 + i * 1.3));
        return (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: COBALT,
              transform: `scale(${dotScale})`,
            }}
          />
        );
      })}
    </div>
  );
};

const ResultsTable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(frame - (TABLE_START - 10), 0);
  const appear = spring({ frame: localFrame, fps, config: SPRING_CONFIG });
  const translateY = interpolate(appear, [0, 1], [50, 0]);
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 500,
        borderRadius: 40,
        padding: "40px 44px",
        opacity,
        transform: `translateY(${translateY}px)`,
        ...glassStyle(INK, "0d", "04"),
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 0.8fr 0.8fr",
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: 32,
          color: INK,
          borderBottom: `2px solid ${INK}`,
          paddingBottom: 20,
          marginBottom: 12,
          fontWeight: "bold",
        }}
      >
        <span>Topic</span>
        <span>Views</span>
        <span>Trend</span>
      </div>

      {TABLE_ROWS.map((row, i) => {
        const rowStart = TABLE_START + i * 22;
        const rowLocalFrame = Math.max(frame - rowStart, 0);
        const rowAppear = spring({ frame: rowLocalFrame, fps, config: SPRING_CONFIG });
        const rowOpacity = interpolate(rowAppear, [0, 1], [0, 1]);
        const rowTranslateX = interpolate(rowAppear, [0, 1], [-40, 0]);
        const isFirst = i === 0;

        return (
          <div
            key={row.topic}
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 0.8fr 0.8fr",
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 30,
              color: INK,
              opacity: rowOpacity,
              transform: `translateX(${rowTranslateX}px)`,
              padding: "18px 20px",
              marginBottom: 10,
              borderRadius: 18,
              borderLeft: isFirst ? `6px solid ${TOMATO}` : "6px solid transparent",
              background: isFirst ? `${TOMATO}1a` : "transparent",
            }}
          >
            <span>{row.topic}</span>
            <span>{row.views}</span>
            <span>{row.trend}</span>
          </div>
        );
      })}
    </div>
  );
};

export const ClaudeInterface: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 150,
          borderBottom: `1px solid ${INK}33`,
        }}
      />
      <TypingPrompt />
      <ProcessingIndicator />
      <ResultsTable />
    </AbsoluteFill>
  );
};
