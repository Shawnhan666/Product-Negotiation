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
  const allVoted = round.get("allVoted");
  const missingProposal = round.get("missingProposal");
  const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "role1");
  const forVotes = players.filter(p => p.get("vote") === "For").length;
  const roleIdentifier = player.get("role");

  const roundPoints = player.get("roundPoints") || 0; // 获取当前轮次的分数
  const cumulativePoints = player.get("cumulativePoints") || 0; // 获取玩家的累计分数
  const roundIndex = round.get("index") + 1; // 获取当前轮次索引，+1是因为索引从0开始
  const nonVoters = players.filter(p => !p.get("vote") && p.get("role") !== "role1").map(p => p.get("name"));
  
  const roundPointsHistory = game.get("RoundPointsHistory");

  
   // 计算总轮数
   const totalRounds = roundPointsHistory.length / 3;



   // 初始化累积得分和每轮得分描述字符串
   
  // 过滤出与当前玩家角色匹配的记录
  const currentPlayerRoundPoints = roundPointsHistory.filter(({ role }) => role === roleIdentifier);
  // 生成当前玩家角色每轮得分的描述字符串
  const roundScores = currentPlayerRoundPoints.map(({ totalPoints }) => totalPoints).join(" + ");


  // 使用let而不是const来声明cumulativePoints，因为我们需要修改它
  // 生成每轮得分描述字符串
  // const roundScores = roundPointsHistory.map(({ totalPoints }) => totalPoints).join(" + ");


    


  // const roundPointsDescription = roundPointsHistory
  // .map(({ totalPoints }, index) => `$${totalPoints}`)
  // .join(" + ");

  useEffect(() => {
    // 假设游戏状态中保存的属性名为RoundPointsHistory
    const roundPointsHistory = game.get("RoundPointsHistory");
    
    if (roundPointsHistory) {
      // 计算总轮数
      const totalRounds = roundPointsHistory.length;
      
      // 计算累积得分，并生成每轮得分的描述字符串
      let cumulativePoints = 0;
      const roundScores = roundPointsHistory.map(({ totalPoints }) => {
        cumulativePoints += totalPoints;
        return totalPoints;
      }).join(" + ");

      // 设置总结信息
      console.log(`In total you have earned ${roundScores} across ${totalRounds} rounds, for a total of ${cumulativePoints}.`);
    }
  }, [game]);

  //     // 数据存在时，在控制台打印每个round的信息
  //     roundPointsHistory.forEach(({ roundIndex, roleName, totalPoints }) => {
  //       console.log(`Round ${roundIndex + 1}: Role: ${roleName}, Total points: ${totalPoints}`);
  //     });
  //   }
  // }, [game]); // 依赖项数组中包含game，这意味着当game对象变化时，useEffect会重新运行






















const isLastRound = roundIndex === numRounds; // 检查是否是最后一个轮次

//console.log(`Round result: ${pass ? 'Passed' : 'Did Not Pass'}. Non voters: ${nonVoters.join(", ")}`);

  const messageText = () => {
    if (missingProposal) {
      return "The CEO failed to provide a proposal in time. You earned $0 from this round.";
    } else if (!allVoted) {
      const nonVotersList = nonVoters.join(", ");
      return `${nonVotersList} failed to vote the formal proposal in time.`; // 使用模板字符串正确展示名字
    
    } else {
      return `Formal Voting Results: ${forVotes+1} Accept, ${againstVotes} Reject. ` + 
        (pass ? "The proposal has been accepted." : "The proposal has not been accepted.");
    }
  };


  useEffect(() => {
    if (roleIdentifier === "role1") {
      const message = messageText(); // 调用函数获取消息文本
        appendSystemMessage({
          id: generateUniqueId(), // 使用生成的唯一ID
          text: message,
          sender: {
            id: Date.now(),
            name: "Notification",
            avatar: "",
            role: "Notification",
          }
        });

      }
    }, []); 


    if (isLastRound) {
      // 如果是最后一个轮次，显示特定的内容
      return (
        <div className="waiting-section">
          <h4>
            <p>The Round is over. You earned £{roundPoints} from this round.</p>
            <br />
            <p>In total you have earned {roundScores} across {totalRounds} rounds, for a total of ${cumulativePoints}.</p>
      
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

  if (!allVoted) {
    return (
      <div className="waiting-section">
        <h4>{nonVoters.join(", ")}failed to vote the formal proposal in time.</h4>
        <br />
        <Button handleClick={() => player.stage.set("submit", true)}>OK</Button>
      </div>
    );
  }

    // 如有反对票
    if (againstVotes > 0) {
      return (
        <div className="waiting-section">
          {/* <h4>Voting Results:</h4>
          <p>Votes Accept: {forVotes+1}</p>
          <p>Votes Reject: {againstVotes}</p> */}
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
    <p>The Round is over. You earned £{roundPoints} from this round. The next round will begin soon.</p>
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



 