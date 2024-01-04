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
import { FormalVote } from "./stages/FormalVote";
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
    if (round.get("isSubmitted")) {
      // 如果 "is、Submitted" 为 true，渲染 FormalVote 组件
      return <FormalVote />;
    } else {
      // 否则，渲染 FormalSubmit 组件
      return <FormalSubmit />;
    }

    case "Formal Vote":
      return <FormalVote />;
  
    case "Result":
      return <Result />;


    default:
      return <Loading />;
  }
}