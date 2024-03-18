import React from "react";
import { useGame, usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";


import { Button } from "../components/Button";
import { useChat } from '../ChatContext'; 

export function Result() {

  const player = usePlayer();
  const game = useGame();
  const round = useRound();
  const players = usePlayers();
  const forVotes = players.filter(p => p.get("vote") === "For").length;
  const againstVotes = players.filter(p => p.get("vote") === "Against").length;
  const submissions = game.get("submissions") || [];
  const pass = players.filter(p => p.get("role") !== "CEO").every(p => p.get("vote") === "For");
  const totalPoints = round.get("totalPoints");


    // 如有反对票
    if (againstVotes > 0) {
      return (
        <div className="waiting-section">
          <h4>Voting Results:</h4>
          <p>Votes Accept: {forVotes+1}</p>
          <p>Votes Reject: {againstVotes}</p>
          <p>The Round is over. You failed to agree on product features. You earned $0 from this round.</p>
          <br />
          <p>Please press "OK" to acknowledge and continue.</p>
          <br />
          <Button handleClick={() => player.stage.set("submit", true)}>OK</Button>
        </div>
      );
    }
    console.log(`Round result: ${pass ? 'Passed' : 'Did Not Pass'}`);

     // 如果没有反对票
    return (
      <div className="waiting-section">
    <h4>
    <p>The Round is over. You were able to agree on product features. You earned ${totalPoints} from this round.</p>
    <br />

    <p>Please press "OK" to acknowledge and continue.</p>
    </h4>
    <br />


    <br />
    {/* {submissions.map((submission, index) => {
      // 对于最后一轮，使用当前计算的 pass 值；对于之前的轮次，显示为未通过
      const isLastRound = index === submissions.length - 1;
      const roundPassed = isLastRound ? pass : false;

      return (
        <div key={index}>
          <p>
            <strong>Round {index + 1}:</strong>
            <span style={{ color: roundPassed ? 'green' : 'red' }}>
              {' '}{roundPassed ? 'Passed' : 'Did Not Pass'}
            </span>
          </p>
          {/* 显示该轮的详细信息 
          
          <br />
        </div>
      );
    })} */}

        <Button handleClick={() => player.stage.set("submit", true)}>OK</Button>
  </div>
  );
}

export default Result;



 