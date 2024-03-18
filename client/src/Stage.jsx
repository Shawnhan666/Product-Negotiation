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
import { useEffect} from 'react';
import '/Users/shawn/CEO game/client/src/stages/TableStyles.css';


export function Stage() {

  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();
 
  useEffect(() => {
    console.log("Current stage: ", stage.get("name"));
    console.log("allVoted status in Stage: ", round.get("allVoted"));


  }, [stage, round]);

  if (player.stage.get("submit")) {
    if (players.length !== 3) {
      return <Loading />;
    }

    return (

      <div className="waiting-section">
      <div className="loader"></div> 
    <p>Please wait for other players.</p>
  </div>


      // <div className="text-center text-gray-400 pointer-events-none">
      //   Please wait for other player(s).
      // </div>
    );
  }


  switch (stage.get("name")) {
    case "Informal Submit":
      return <Choice />;
  
    case "Formal Submit":
      if (player.stage.get("submit")) {
        return <Result />;
      }
      if (round.get("isSubmitted")) {
        return <FormalVote />;
      } else {
        return <FormalSubmit />;
      }


    case "Result":
      if (player.stage.get("submit")) {
        return <FormalVote />;
      } else {
        return <Result />;
      }

    default:
      return <Loading />;
    }
}