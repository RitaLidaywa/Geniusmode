import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { ResearchValidation } from "./ResearchValidation";
import { IdeaWorkflow } from "./IdeaWorkflow";
import { IdeaPrism } from "./IdeaPrism";

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
    </>
  );
};
