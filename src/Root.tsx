import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TextAnimation } from "./TextAnimation";
import { StaircaseAnimation } from "./StaircaseAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TextAnimation"
        component={TextAnimation}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="StaircaseAnimation"
        component={StaircaseAnimation}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
