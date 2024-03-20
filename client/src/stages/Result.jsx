import React from "react";
import { useGame, usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";

import  { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useChat } from '../ChatContext'; 

export function Result() {

  const player = usePlayer();
  const game = useGame();
  const round = useRound();
  const players = usePlayers();
  const { appendSystemMessage } = useChat();
  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const againstVotes = players.filter(p => p.get("vote") === "Against").length;
  const submissions = game.get("submissions") || [];
  const pass = players.filter(p => p.get("role") !== "CEO").every(p => p.get("vote") === "For");
  const totalPoints = round.get("totalPoints");
  const missingProposal = round.get("missingProposal");

  const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "role1");
  const forVotes = players.filter(p => p.get("vote") === "For").length;
  const roleIdentifier = player.get("role");

  const messageText = missingProposal 
  ? "The CEO failed to provide a proposal in time. You earned $0 from this round." 
  : `Formal Voting Results: ${forVotes+1} Accept, ${againstVotes} Reject. ` + (pass ? "The proposal has been accepted." : "The proposal has not been accepted.");


  useEffect(() => {
    if (roleIdentifier === "role1") {

        appendSystemMessage({
          id: generateUniqueId(), // 使用生成的唯一ID
          text: messageText,
          sender: {
            id: Date.now(),
            name: "Notification",
            avatar: "",
            role: "Notification",
          }
        });

      }
    }, []); // 移除 appendSystemMessage 作为依赖项



  if (missingProposal) {
    return (
      <div className="waiting-section">
        <h4>The CEO failed to provide a proposal in time, You earned $0 from this round.</h4>

        <br />
        <Button handleClick={() => player.stage.set("submit", true)}>OK</Button>
      </div>
    );
  }

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
 

        <Button handleClick={() => player.stage.set("submit", true)}>OK</Button>
  </div>
  );
}

export default Result;



 