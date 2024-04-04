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
  const treatment = game.get("treatment");
  const {numRounds}= treatment;

  
  const pass = round.get("pass")

  const totalPoints = round.get("totalPoints");
  const missingProposal = round.get("missingProposal");
  const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "role1");
  const forVotes = players.filter(p => p.get("vote") === "For").length;
  const roleIdentifier = player.get("role");

  
  const roundPoints = player.get("roundPoints") || 0; // 获取当前轮次的分数
  const cumulativePoints = player.get("cumulativePoints") || 0; // 获取玩家的累计分数
  const roundIndex = round.get("index") + 1; // 获取当前轮次索引，+1是因为索引从0开始
  const roundPointsHistory = player.get("roundPointsHistory") || [];


  console.log(`History`,roundPointsHistory);


  const roundPointsDescription = roundPointsHistory
  .map(({ totalPoints }, index) => `$${totalPoints}`)
  .join(" + ");
const totalRounds = roundPointsHistory.length;
const isLastRound = roundIndex === numRounds; // 检查是否是最后一个轮次





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


    if (isLastRound) {
      // 如果是最后一个轮次，显示特定的内容
      return (
        <div className="waiting-section">
          <h4>
            <p>The Round is over. You earned {roundPoints} from this round.</p>
            <br />
            <p>In total you have earned {roundPointsDescription} across {totalRounds} rounds, for a total of ${cumulativePoints}.</p>
      
            <br />
            <p>Please press "OK" to acknowledge and continue.</p>
          </h4>
          <br />
          <Button handleClick={() => player.stage.set("submit", true)}>OK</Button>
        </div>
      );
    }  


  if (missingProposal) {
    return (
      <div className="waiting-section">
        <h4>The CEO failed to provide a proposal in time.</h4>
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
          <p>The Round is over. You failed to agree on product features. You earned $0 from this round. The next round will begin soon. </p>
          <br />
          <p>Please press "OK" to continue.</p>
          <br />
          <Button handleClick={() => player.stage.set("submit", true)}>OK</Button>
        </div>
      );
    }
 

     // 如果没有反对票
    return (
      <div className="waiting-section">
    <h4>
    <p>The Round is over. You earned {roundPoints} from this round. The next round will begin soon.</p>
    {/* <br />
      <p>In total you have earned ${roundPointsDescription} across {totalRounds} rounds, for a total of ${cumulativePoints}.</p> */}

    <br />
    <p>Please press "OK" to continue.</p>
    </h4>
    <br />


    <br />
 

        <Button handleClick={() => player.stage.set("submit", true)}>OK</Button>
  </div>
  );
}

export default Result;



 