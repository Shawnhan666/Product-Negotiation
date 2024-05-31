 
 
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
    const pass = players.filter(p => p.get("role") !== "role1").every(p => p.get("vote") === "For");
    const totalPoints = round.get("totalPoints");
    const selectedFeatureNames = submittedData_formal ? Object.keys(submittedData_formal.decisions).join(", ") : "No features selected";
    const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "role1");
    const forVotes = players.filter(p => p.get("vote") === "For").length;
    const againstVotes = players.filter(p => p.get("vote") === "Against").length;
    const formalresultText = `Formal Voting Results: ${forVotes+1} Accept, ${againstVotes} Reject. ` + (pass ? "The proposal has been accepted." : "The proposal has not been accepted.");
    const treatment = game.get("treatment");
    const {role1} = treatment;
    const {featureUrl}= treatment;
     const [features, setFeatures] = useState([]);

    
 

    


    const desiredFeaturesForRole = features
    .filter(feature => feature.bonus[player.get("role")] === 1)
    .map(feature => feature.name)
    .join(", ");



       // 使用 useEffect 钩子来在组件加载时请求数据
       useEffect(() => {
        fetch(featureUrl)
          .then(response => response.json()) // 将响应转换为 JSON
          .then(data => {
            setFeatures(data[treatment.scenario].features); // 更新特性
            //setProductName(data.product_name); // 存储产品名称
          })
          .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
      }, []); // 空依赖数组意味着这个 useEffect 只在组件首次渲染时执行



    const currentPlayerRole = player.get("role"); 
  

      
  
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
  
    }, [round]);
  
  
    const calculatePlayerTotalBonus = () => {
      if (!submittedData_formal || !features) {
        return 0; // 如果没有提交的数据或特性数据未加载，返回 0
      }
    
  
      return features.reduce((total, feature) => {
        // 检查此特性是否被选中
        const isSelected = submittedData_formal.decisions[feature.name];
        // 根据玩家的角色计算并累加奖金
        const bonusAmount = isSelected ? feature.bonus[currentPlayerRole] : 0;
        return total + bonusAmount;
      }, 0);
    };
    
    
    
    const handleVote = (vote) => {
      player.set("vote", vote);
      console.log("Vote set for", player.id, "to", vote);
      setTimeout(() => {

        console.log("Checking votes:");
        players.forEach(p => {
          console.log(p.id, p.get("vote"));
        });
        const allVotedCheck = players.every(p => p.get("vote") || p.get("role") === "role1");
        console.log("All voted:", allVotedCheck);
      }, 1000); // 延迟1秒后检查
    
      player.stage.set("submit", true);
 
      //bonues
      const playerTotalBonus = calculatePlayerTotalBonus();
      const playerBonusesByRole = round.get("playerBonusesByRole") || {};
      const totalPoints = round.get("totalPoints");
      const role1 = players.find(p => p.get("role") === "role1").get("role");
      playerBonusesByRole[role1] = totalPoints;
      playerBonusesByRole[player.get("role")] = playerTotalBonus;
      round.set("playerBonusesByRole", playerBonusesByRole);
      console.log("UUUUUUspdated playerBonusesByRole:", playerBonusesByRole);
  
  
      // 检查是否所有玩家都已经投票
      const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "role1");
      console.log(`allPlayersVoted bbbb`,allPlayersVoted);
      if (allPlayersVoted) {
        round.set("allVoted", true);
        round.set("pass", pass);  
        console.log(`Round result: ${pass ? 'Passed' : 'Dddddddddid Not Pass'}`);
        const nonVoters = players.filter(p => !p.get("vote") && p.get("role") !== "role1").map(p => p.get("name"));
        round.set("nonVoters", nonVoters);
  
   
    
    };
  
 
    };
  
  
  
    // 如果所有玩家都已投票
    if (round.get("allVoted") || round.get("missingProposal")) {
      round.set("pass", pass);  // 保存这轮是否通
      console.log(`allPlayersVoted bbbb`,allPlayersVoted);
    
      console.log(`Round result: ${pass ? 'Passed' : 'DDDDid Not Pass'}`);
      player.stage.set("submit", true);  
      
    }
    
  
  
  
     // 如果当前玩家已经投票，或者玩家是 "Stellar_Cove"，则显示等待
     if (player.get("vote") || player.get("role") === "role1") {
      return (
        <div className="container">
        <div className="waiting-section">
         
            <div className="loader"></div>
            <div>Other parties are still voting. Once votes are in and tallied, the results will be shown.</div>
          </div>
        </div>
      );
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
  
   
  
    
    
    
    
  
    return (
      <div>
        <div className="text-brief-wrapper">
          <div className="text-brief">
            <h5>{role1} has made their final proposal.<br/><br/>Time to cast your final vote!</h5>
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
                  const isDesiredFeature = desiredFeaturesForRole.includes(feature.name);
                  // 根据当前玩家角色计算奖励
                  const bonusForCurrentPlayer = isSelected ? feature.bonus[player.get("role")] : 0;
    
                  return (
                    <tr key={index} className={isDesiredFeature ? "selected-feature" : ""}>
                      <td>{feature.name}</td>
                      <td>{isSelected ? <span>&#10003;</span> : <span>&nbsp;</span>}</td>
                      <td>{bonusForCurrentPlayer}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="total-points-display">Your bonus: ${Math.round(calculatePlayerTotalBonus()*100)/100}</div>
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
    
    