import "./index.css";
import { Composition } from "remotion";
import { ClaudeInterfaceMockup } from "./ClaudeInterfaceMockup";

// This is the "assembly point." Right now it previews the Claude
// mockup component on its own so you can check the look.
// As we build more scenes, they'll get added here too.

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ClaudeMockup-Preview"
      component={ClaudeInterfaceMockup}
      durationInFrames={90}
      fps={30}
      width={1080}
      height={1920} // 9:16 vertical — this is what makes it Shorts format
      defaultProps={{
        message: "How can I help today?",
        attachedFile: "character-sheet.png",
        inputText: "Create 5 video...",
      }}
    />
  );
};
