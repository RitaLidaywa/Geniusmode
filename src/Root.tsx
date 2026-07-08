import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { ResearchValidation } from "./ResearchValidation";
import { IdeaWorkflow } from "./IdeaWorkflow";
import { IdeaPrism } from "./IdeaPrism";
import { ClaudeInterface } from "./ClaudeInterface";
import { ContentVelocity } from "./ContentVelocity";
import { CompressedTime } from "./CompressedTime";
import { StudioCTA_Final } from "./StudioCTA_Final";

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
        id="ResearchValidation"
        component={ResearchValidation}
        durationInFrames={183}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="IdeaWorkflow"
        component={IdeaWorkflow}
        durationInFrames={183}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IdeaPrism"
        component={IdeaPrism}
        durationInFrames={81}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeInterface"
        component={ClaudeInterface}
        durationInFrames={318}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ContentVelocity"
        component={ContentVelocity}
        durationInFrames={318}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CompressedTime"
        component={CompressedTime}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="StudioCTAFinal"
        component={StudioCTA_Final}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
