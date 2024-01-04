//Stage.jsx
import {
  usePlayer,
  usePlayers,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";

import { Loading } from "@empirica/core/player/react";
import React from "react";
import { Choice } from "./stages/Choice";
import { FormalSubmit } from "./stages/FormalSubmit";
import { Result } from "./stages/Result";


export function Stage() {
  //here we call the hook to gain access to the stage object
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();
 

  
  switch (stage.get("name")) {
    case "Informal Submit":
      return <Choice />;
  
    case "Formal Submit":
      return <FormalSubmit />;
  
    case "Result":
      return <Result />;

    default:
      return <Loading />;
  }
}