// // //formalvote.jsx
import React, { useEffect, useState } from "react";
import { useGame,usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import './TableStyles.css';
import { useChat } from '../ChatContext'; 
import { Button } from "../components/Button";
import features from './features.json';


export function FormalVote() {


  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const { appendSystemMessage } = useChat();

  const [submittedData, setSubmittedData] = useState(null);
  const isVoting = round.get("isVoting");
  const submittedData_formal = round.get("submittedData_formal");
  const pass = players.filter(p => p.get("role") !== "CEO").every(p => p.get("vote") === "For");
  const totalPoints = round.get("totalPoints");

  const selectedFeatureNames = submittedData_formal ? Object.keys(submittedData_formal.decisions).join(", ") : "No features selected";

  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

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



  const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "CEO");
  const forVotes = players.filter(p => p.get("vote") === "For").length;
  const againstVotes = players.filter(p => p.get("vote") === "Against").length;


  useEffect(() => {
    const role = player.get("role");
    
    if (allPlayersVoted ) {
  const formalresultText = `Formal Voting Results: ${forVotes+1} Accept, ${againstVotes} Reject. ` + (pass ? "The proposal has been accepted." : "The proposal has not been accepted.");
    
    // 发送系统消息
    appendSystemMessage({
      id: generateUniqueId(), // 使用生成的唯一ID
      text: formalresultText,
      sender: {
        id: Date.now(),
        name: "Notification",
        avatar: "",
        role: "Notification",
      }
    });
    console.log(formalresultText);
  }
}, [allPlayersVoted]); // 移除 appendSystemMessage 作为依赖项

  // 如果所有玩家都已投票
  if (round.get("allVoted")) {
    player.stage.set("submit", true); // 这里假设 "submit" 是进入结果页面的正确阶段键
    return <div>Transferring to the results page...</div>;
  }

   // 如果当前玩家已经投票，或者玩家是 "Stellar_Cove"，则显示等待
   if (player.get("vote") || player.get("role") === "CEO") {
    return      <div className="waiting-section">
    <div className="loader"></div>  <div>Other parties are still voting. Once votes are in and tallied, the results will be shown.</div>
    </div>;
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
        <h6>For this product design deliberation, your role is: <strong>{player.get("role")}</strong>.</h6>
        <h6>You "desired features" are: <strong>{selectedFeatureNames}</strong>.</h6>
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
                const isSelected = selectedFeatureNames.includes(feature.name); // 检查特性是否被选中
                return (
  
                  <tr key={index} className={isSelected ? "selected-feature" : ""}>
                    <td>{feature.name}</td>
                    {/* <td>
                      <input
                        type="checkbox"
                        checked={!!isSelected} // 根据decisionsMap来确定是否选中
                        disabled // 禁用复选框，以防止修改
                      />
                    </td> */}
                    <td>
        {/* 当特性被选中时，显示对号 */}
        {isSelected ? <span>&#10003;</span> : <span>&nbsp;</span>} 
      </td>
                    <td>
                      {isSelected ? feature.bonus[submittedData_formal.submitterRole] : 0} 
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="total-points-display">Your bonus: ${totalPoints}</div>
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


 