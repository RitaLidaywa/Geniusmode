import React from "react";
import { ClaudeInterfaceMockup } from "./ClaudeInterfaceMockup";

export const MyComposition: React.FC = () => {
  return (
    <ClaudeInterfaceMockup
      message="How can I help today?"
      attachedFile="roadmap.pdf"
      inputText="Summarize this for the team"
    />
  );
};
