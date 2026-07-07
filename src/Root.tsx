import "./index.css";
import { Composition } from "remotion";
import { Beat1Intro } from "./Beat1Intro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="beat1-intro"
        component={Beat1Intro}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
