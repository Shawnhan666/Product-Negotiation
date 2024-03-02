// //formalvote.jsx
import React, { useEffect, useState } from "react";
import { useGame,usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import './TableStyles.css';
import { Button } from "../components/Button";

const features = [
  { name: "Touchscreen", bonus: { CEO: 1, Department_Head_A: -0.5, Department_Head_B: 1 } },
  { name: "Fingerprint Reader", bonus: { CEO: -0.5, Department_Head_A: 1, Department_Head_B: 1 } },
  { name: "4K Display", bonus: { CEO: 1, Department_Head_A: 1, Department_Head_B: 1 } },
  { name: "Thunderbolt 4 Ports", bonus: { CEO: -0.5, Department_Head_A: 1, Department_Head_B: -0.5 } },
  { name: "AI-Enhanced Performance", bonus: { CEO: 1, Department_Head_A: 1, Department_Head_B: 1 } },
  { name: "Ultra-Light Design", bonus: { CEO: 1, Department_Head_A: -0.5, Department_Head_B: 1 } },
  { name: "High-speed WiFi 6E", bonus: { CEO: -0.5, Department_Head_A: -0.5, Department_Head_B: -0.5 } },
  { name: "Long Battery Life", bonus: { CEO: 1, Department_Head_A: -0.5, Department_Head_B: -0.5 } },
];



export function FormalVote() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const [submittedData, setSubmittedData] = useState(null);
  const isVoting = round.get("isVoting");
  const submittedData_formal = round.get("submittedData_formal");
  const pass = players.filter(p => p.get("role") !== "CEO").every(p => p.get("vote") === "For");
  const totalPoints = round.get("totalPoints");
  // 在组件加载时获取提案数据和投票状态
  useEffect(() => {
    const dataFormal = round.get("submittedData_formal");
    if (dataFormal) {
      setSubmittedData(dataFormal);
    }
  }, [round]);

  useEffect(() => {
    // 当轮次改变时重置所有玩家的投票状态
    players.forEach(p => {
      p.set("vote", null);
    });
    round.set("allVoted", false);
    //round.set("totalPoints", totalPoints);
  }, [players, round]);

  const handleVote = (vote) => {
    player.set("vote", vote);
    player.stage.set("submit", true);
    console.log( player.get("vote"));

    // 检查是否所有玩家都已经投票

    const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "CEO");
    if (allPlayersVoted) {
      round.set("allVoted", true);
      round.set("pass", pass);  // 保存这轮是否通
      console.log(`Round result: ${pass ? 'Passed' : 'Did Not Pass'}`);
  };
  };


  // 如果所有玩家都已投票
  if (round.get("allVoted")) {
    player.stage.set("submit", true); // 这里假设 "submit" 是进入结果页面的正确阶段键
    return <div>Transferring to the results page...</div>;
  }

   // 如果当前玩家已经投票，或者玩家是 "Stellar_Cove"，则显示等待
   if (player.get("vote") || player.get("role") === "CEO") {
    return <div>Other parties are still voting. Once votes are in and tallied, the results will be shown.</div>;
  }

  const decisionsMap = submittedData_formal.decisions
  ? Object.entries(submittedData_formal.decisions).reduce((acc, [feature, isSelected]) => {
      acc[feature] = isSelected;
      return acc;
    }, {})
  : {};

  // 展示提案详情和投票选项
  
  return (

    <div>
      <div className="text-brief-wrapper">
       <div className="text-brief">
    <h5>The CEO has made their final proposal.  Cast your vote!</h5>
    </div>
    </div>
    <br />

      <div className="table-container">
        <div className="table-wrapper">
          <table className="styled-table-orange">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Include</th>
                <th>Bonus</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => {
                const isSelected = decisionsMap[feature.name];
                return (
                  <tr key={index}>
                    <td>{feature.name}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!isSelected} // 根据decisionsMap来确定是否选中
                        disabled // 禁用复选框，以防止修改
                      />
                    </td>
                    <td>
                      {isSelected ? feature.bonus[submittedData_formal.submitterRole] : 0} 
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div>Your bonus: ${totalPoints}</div>
      </div>
    </div>
    <br/>
    <div className="buttons-container-vote">
  <Button handleClick={() => handleVote("For")}>Accept</Button>
  <Button handleClick={() => handleVote("Against")}>Reject</Button>
</div>

  </div>
);
};





//     <div>

//       <h5>The CEO has proposed the following for your vote:</h5>
//       {/* 根据您的具体提案内容动态展示提案信息，这里是示例 */}
//       <p>Official Proposal:</p>
//       {Object.entries(submittedData_formal.decisions).map(([feature, value], index) => (
//         <p key={index}>{`${feature}: ${value}`}</p>
//       ))}
//       <br/>
//       <div>
//         <Button handleClick={() => handleVote("For")}>Vote For</Button>
//       </div>
//       <br/>
//       <div>
//         <Button handleClick={() => handleVote("Against")}>Vote Against</Button>
//       </div>
//     </div>
//   );
// }





// import { usePlayer, useRound  } from "@empirica/core/player/classic/react";
// import { usePlayers } from "@empirica/core/player/classic/react";
// import { useGame } from "@empirica/core/player/classic/react";
// import React from "react";
// import './TableStyles.css';
// import { useState, useEffect} from 'react';
// import { useStage } from "@empirica/core/player/classic/react";
// import { Button } from "../components/Button";

// export function FormalVote() {
//   const player = usePlayer();
//   const players = usePlayers();
//   const round = useRound();
//   const [submittedData, setSubmittedData] = useState(null);
//   const stage = useStage();
//   const game = useGame();
  
//   const pass = players.filter(p => p.get("role") !== "Stellar_Cove").every(p => p.get("vote") === "For");
   

//   useEffect(() => {
//     // 当轮次改变时重置所有玩家的投票状态
//     players.forEach(p => {
//       p.set("vote", null);
//     });

//     // 重置 allVoted 标记
//     round.set("allVoted", false);

//   }, [players, round]);

  
//   // 获取Stella提交的数据
//   useEffect(() => {
//     const dataFormal = round.get("submittedData");
//     if (dataFormal) {
//       setSubmittedData(dataFormal);
//     }
//   }, [round]);

//   // 处理投票逻辑
  

  // const handleVote = (vote) => {
    
  //   player.set("vote", vote);
  //   player.stage.set("submit", true);
  //   console.log( player.get("vote"));

  //   // 检查是否所有其他玩家都已经投票
  //   const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "Stellar_Cove");
  //   if (allPlayersVoted) {
  //     round.set("allVoted", true);

  

  //     round.set("pass", pass);  // 保存这轮是否通
  //     console.log(`Round result: ${pass ? 'Passed' : 'Did Not Pass'}`);
  //   }
  // };


//   if (!submittedData) {
//     return <div>Please wait while Stellar Cove enters a proposal for you to vote on.</div>;
//   }

//   // 如果所有玩家都已投票，转入结果页面
//   if (round.get("allVoted")) {
//     player.stage.set("submit", true); // 这里假设 "submit" 是进入结果页面的正确阶段键
//     return <div>Transferring to the results page...</div>;
//   }

//   // 如果当前玩家已经投票，或者玩家是 "Stellar_Cove"，则显示等待
//   if (player.get("vote") || player.get("role") === "Stellar_Cove") {
//     return <div>Other parties are still voting. Once votes are in and tallied, the results will be shown.</div>;
//   }

//   // 显示投票选项
//   return (
//     <div>
//       <h5>Stellar Cove has asked you to vote on the following formal and binding proposal:</h5>
//       <p>Property Mix: {submittedData?.decisions.mix}</p>
//       <p>Low Income Housing: {submittedData?.decisions.li}</p>
//       <p>Green Space: {submittedData?.decisions.green}</p>
//       <p>Maximum Building Height: {submittedData?.decisions.height}</p>
//       <p>Entertainment Venues: {submittedData?.decisions.venues}</p>
//       <br/>
//       <div>
//         <Button handleClick={() => handleVote("For")}>Vote For</Button>
//         </div>
//         <br/>
//         <div>
//         <Button handleClick={() => handleVote("Against")}>Vote Against</Button>
//       </div>
//     </div>
//   );
// }

// export default FormalVote;

























 