// theme.ts — light/bright direction, replaces the dark v1
export const theme = {
  background: "#F7F6F2", // warm off-white, not stark white — easier to sit a dotted texture on top of
  dotColor: "#00000012", // low-opacity black dots for the textured background
  windowBg: "#FFFFFF", // the Claude "browser window" itself
  windowBorder: "#E4E2DC",
  accent: "#D97B3F", // the orange send-button color from your reference
  text: "#1A1A1A",
  textMuted: "#8A8A85",
  bubbleGray: "#F0EFEA",

  fontHeading: "Inter, sans-serif",
  fontBody: "Inter, sans-serif",
} as const;
