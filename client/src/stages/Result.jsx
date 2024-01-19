import React, { useEffect, useState } from "react";
import { useGame } from "@empirica/core/player/classic/react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { useStage } from "@empirica/core/player/classic/react";
import { useRound  } from "@empirica/core/player/classic/react";


 

export function Result() {

  const game = useGame();
  const player = usePlayer();
  const round = useRound();
  const submissions = game.get("submissions") || [];
  const failAttempts = round.get("failAttempts") || 0;  // 获取 failAttempts 的值

  console.log("failAttempts:", failAttempts);





  
  return (
    <div>
      <br />
      <p>This activity is complete!</p>
      <p>Please record your results before closing this window.</p>
      <br /><br />

      {submissions.map((submission, index) => {
        // 如果只有一轮或者是最后一轮，则显示为 "Passed"
        const isLastRound = index === submissions.length - 1;
        const isOnlyOneRound = submissions.length === 1;

        let roundStatus, statusColor;

        if (failAttempts >= 5) {
          // 如果 failAttempts 大于或等于3
          roundStatus = "Did Not Pass";
          statusColor = "red";
        } else {
          // 原先的逻辑
          roundStatus = isLastRound || isOnlyOneRound ? "Passed" : "Did Not Pass";
          statusColor = (isLastRound || isOnlyOneRound) ? "green" : "red";
        }


        //const roundStatus = isLastRound || isOnlyOneRound ? "Passed" : "Did Not Pass";
        //const statusColor = (isLastRound || isOnlyOneRound) ? "green" : "red";
        
        return (
          <div key={index}>
            <h4>Round {index + 1}: <span style={{ color: statusColor }}>{roundStatus}</span></h4>
            <div>
              <p>Property Mix: {submission.choices.mix}</p>
              <p>Low Income Housing: {submission.choices.li}</p>
              <p>Green Space: {submission.choices.green}</p>
              <p>Maximum Building Height: {submission.choices.height}</p>
              <p>Entertainment Venues: {submission.choices.venues}</p>
              <br /><br />
            </div>
          </div>
        );
      })}

      <br /><br />
      <Button handleClick={() => player.stage.set("submit", true)}>
        Continue
      </Button>
    </div>
  );
}