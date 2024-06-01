//Stage.jsx
import {
  usePlayer,
  usePlayers,
  useRound,
  useStage,
  useGame,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { Choice } from "./stages/Choice";
import { FormalSubmit } from "./stages/FormalSubmit";
import { FormalVote } from "./stages/FormalVote";
import { Result } from "./stages/Result";
import { useEffect} from 'react';
import "./stages/TableStyles.css";



export function Stage() {

  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();
  const game = useGame();

  const currentPhase = stage.get("name");

  console.log(game.get("featureData"));
  if(game.get("featureData")===undefined) return <Loading />;

  if (player.stage.get("submit")) {
    if (players.length !== 3) {
      return <Loading />;
    }

    return (
      <div className="waiting-section">
      <div className="loader"></div> 
    <p>Please wait for other players.</p>
  </div>
    );
  }



      switch (stage.get("name")) {
        case "Discussion and Informal Vote":
          return <Choice />;



    case "Submit Formal Vote":
      // if (player.stage.get("submit")) {
      //   return <FormalVote />;
      // }
      // if (round.get("isSubmitted")) {
      //   return <FormalVote />;
      // } else {
      //   return <FormalSubmit />;
      // }
        return <FormalSubmit />

      case "Formal Vote":
      //   if (player.stage.get("submit")) {
      //   return <Result />;
      // }
      // if (round.get("isSubmitted")) {
      //   return <FormalVote />;
      // } else {
      //   return <FormalVote />;
      // }
      return <FormalVote />;


    case "Result":
      // if (player.stage.get("submit")) {
      //   return <FormalVote />;
      // } else {
      //   return <Result />;
      // }
      return <Result />;

    default:
      return <Loading />;
    }
}