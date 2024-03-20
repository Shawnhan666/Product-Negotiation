 
  // // //formalvote.jsx
import React, { useEffect, useState } from "react";
import { usePlayer, usePlayers, useRound,useGame } from "@empirica/core/player/classic/react";
import './TableStyles.css';
import { useChat } from '../ChatContext'; 
import { Button } from "../components/Button";



export function FormalVote() {


  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const { appendSystemMessage } = useChat();
  const game = useGame();
  const [submittedData, setSubmittedData] = useState(null);
  const isVoting = round.get("isVoting");
  const submittedData_formal = round.get("submittedData_formal");
  const pass = players.filter(p => p.get("role") !== "CEO").every(p => p.get("vote") === "For");
  const totalPoints = round.get("totalPoints");

  const selectedFeatureNames = submittedData_formal ? Object.keys(submittedData_formal.decisions).join(", ") : "No features selected";

  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;


  const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "role1");
  const forVotes = players.filter(p => p.get("vote") === "For").length;
  const againstVotes = players.filter(p => p.get("vote") === "Against").length;
  const formalresultText = `Formal Voting Results: ${forVotes+1} Accept, ${againstVotes} Reject. ` + (pass ? "The proposal has been accepted." : "The proposal has not been accepted.");
  
  const treatment = game.get("treatment");

  const {featureUrl}= treatment;

    // 添加一个状态来存储 features 数据
    const [features, setFeatures] = useState([]);

    // 使用 useEffect 钩子来在组件加载时请求数据
    useEffect(() => {
      fetch(featureUrl)
        .then(response => response.json()) // 将响应转换为 JSON
        .then(data => setFeatures(data)) // 使用返回的数据更新状态
        .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
    }, []); // 空依赖数组意味着这个 useEffect 只在组件首次渲染时执行

    

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

    const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "role1");
    if (allPlayersVoted) {
      round.set("allVoted", true);
      round.set("pass", pass);  // 保存这轮是否通
      console.log(`Round result: ${pass ? 'Passed' : 'Did Not Pass'}`);
  };
  };





  // 如果所有玩家都已投票
  if (round.get("allVoted") || round.get("missingProposal")) {
    player.stage.set("submit", true); // 这里假设 "submit" 是进入结果页面的正确阶段键
    return <div>Transferring to the results page...</div>;
  }
  



   // 如果当前玩家已经投票，或者玩家是 "Stellar_Cove"，则显示等待
   if (player.get("vote") || player.get("role") === "role1") {
    return      <div className="waiting-section">
    <div className="loader"></div>  <div>Other parties are still voting. Once votes are in and tallied, the results will be shown.</div>
    </div>;
  }

    if (!submittedData_formal || !submittedData_formal.decisions) {

    round.set("missingProposal", true); // 设置一个状态，表示提案缺失

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
        <h6>For this product design deliberation, your role is: <strong>{player.get("name")}</strong>.</h6>
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


 