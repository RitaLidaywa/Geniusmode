import "./index.css";
import { Composition } from "remotion";
import { SetupHubDisplay } from "./SetupHubDisplay";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SetupHubDisplay"
        component={SetupHubDisplay}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
