import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const DAISY = "#FFFAE5";
const INK = "#1A1A2E";
const TOMATO = "#E74F35";
const SIDEBAR_GREY = "#ECECEC";

const SPRING_CONFIG = { stiffness: 60, damping: 20 };

const SIDEBAR_WIDTH = 110;
const CONTENT_LEFT = SIDEBAR_WIDTH + 60;
const CONTENT_RIGHT = 60;

const PROMPT_TEXT =
  "YouTube Content Strategist: find my top 3 trending video topics this week.";

const TYPE_END = 90; // 3s
const SEND_CLICK = 90;
const TABLE_START = 180; // 6s

const TABLE_ROWS = [
  { topic: "AI Tools Roundup", views: "482K", trend: "▲ 38%" },
  { topic: "Studio Setup Tips", views: "310K", trend: "▲ 22%" },
  { topic: "Faceless Automation", views: "275K", trend: "▲ 19%" },
];

const Sidebar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: SIDEBAR_WIDTH,
      background: SIDEBAR_GREY,
      borderRight: `1px solid rgba(26,26,46,0.08)`,
    }}
  >
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: "50%",
          top: 130 + i * 60,
          width: 70,
          height: 10,
          borderRadius: 5,
          transform: "translateX(-50%)",
          background: "rgba(26,26,46,0.14)",
        }}
      />
    ))}
  </div>
);

const PaperAirplaneIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
    <path d="M3 11.5L20.5 3.5L14 20.5L11 13.5L3 11.5Z" fill={color} />
  </svg>
);

const UserBubble: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(frame - SEND_CLICK, 0);
  const appear = spring({ frame: localFrame, fps, config: SPRING_CONFIG });
  const translateY = interpolate(appear, [0, 1], [24, 0]);
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: CONTENT_LEFT,
        right: CONTENT_RIGHT,
        top: 160,
        display: "flex",
        justifyContent: "flex-end",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          maxWidth: "78%",
          borderRadius: 28,
          padding: "22px 28px",
          background: "rgba(26,26,46,0.06)",
          border: "1px solid rgba(26,26,46,0.1)",
        }}
      >
        <span
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: 30,
            lineHeight: 1.4,
            color: INK,
          }}
        >
          {PROMPT_TEXT}
        </span>
      </div>
    </div>
  );
};

const LoadingDots: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [SEND_CLICK + 8, SEND_CLICK + 20, TABLE_START - 12, TABLE_START],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: CONTENT_LEFT,
        top: 300,
        display: "flex",
        gap: 10,
        opacity,
      }}
    >
      {[0, 1, 2].map((i) => {
        const bounce = Math.max(0, Math.sin(frame * 0.3 + i * 1.1));
        return (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: INK,
              opacity: 0.35 + 0.5 * bounce,
              transform: `translateY(${-bounce * 6}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

const ResponseTable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(frame - (TABLE_START - 10), 0);
  const appear = spring({ frame: localFrame, fps, config: SPRING_CONFIG });
  const translateY = interpolate(appear, [0, 1], [30, 0]);
  const opacity = interpolate(appear, [0, 1], [0, 1]);

  const textStyle: React.CSSProperties = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: 28,
    color: INK,
  };

  return (
    <div
      style={{
        position: "absolute",
        left: CONTENT_LEFT,
        right: CONTENT_RIGHT,
        top: 300,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 0.8fr 0.8fr",
          borderBottom: `2px solid ${INK}`,
          paddingBottom: 16,
          marginBottom: 10,
          ...textStyle,
          fontSize: 30,
          fontWeight: "bold",
        }}
      >
        <span>Topic</span>
        <span>Views</span>
        <span>Trend</span>
      </div>

      {TABLE_ROWS.map((row, i) => {
        const rowStart = TABLE_START + i * 20;
        const rowLocalFrame = Math.max(frame - rowStart, 0);
        const rowAppear = spring({ frame: rowLocalFrame, fps, config: SPRING_CONFIG });
        const rowOpacity = interpolate(rowAppear, [0, 1], [0, 1]);
        const rowTranslateX = interpolate(rowAppear, [0, 1], [-30, 0]);
        const isFirst = i === 0;

        return (
          <div
            key={row.topic}
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 0.8fr 0.8fr",
              padding: "16px 18px",
              marginBottom: 8,
              borderRadius: 14,
              opacity: rowOpacity,
              transform: `translateX(${rowTranslateX}px)`,
              borderLeft: isFirst ? `5px solid ${TOMATO}` : "5px solid transparent",
              background: isFirst ? `${TOMATO}17` : "transparent",
              ...textStyle,
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

const InputPill: React.FC = () => {
  const frame = useCurrentFrame();

  const charCount = Math.floor(
    interpolate(frame, [4, TYPE_END - 6], [0, PROMPT_TEXT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typedText = frame < SEND_CLICK ? PROMPT_TEXT.slice(0, charCount) : "";

  const cursorVisible = frame < SEND_CLICK && Math.floor(frame / 15) % 2 === 0;

  const click = interpolate(frame, [SEND_CLICK - 4, SEND_CLICK, SEND_CLICK + 6], [1, 0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const active = frame < SEND_CLICK && charCount > 0;

  return (
    <div
      style={{
        position: "absolute",
        left: CONTENT_LEFT,
        right: CONTENT_RIGHT,
        bottom: 90,
        height: 108,
        borderRadius: 54,
        background: "#FFFFFF",
        border: "1px solid rgba(26,26,46,0.14)",
        boxShadow: "0 10px 24px rgba(26,26,46,0.08)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px 0 34px",
      }}
    >
      <div
        style={{
          flex: 1,
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: 30,
          color: INK,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {typedText}
        <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
      </div>
      <div
        style={{
          width: 68,
          height: 68,
          minWidth: 68,
          borderRadius: "50%",
          background: active ? INK : "rgba(26,26,46,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${click})`,
        }}
      >
        <PaperAirplaneIcon color={active ? DAISY : INK} />
      </div>
    </div>
  );
};

export const ClaudeInterface: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DAISY }}>
      <Sidebar />
      <UserBubble />
      <LoadingDots />
      <ResponseTable />
      <InputPill />
    </AbsoluteFill>
  );
};
