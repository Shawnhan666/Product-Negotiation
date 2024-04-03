// //FormalSubmit.jsx
import React from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import './TableStyles.css';
import { useState, useEffect} from 'react';
import { useGame } from "@empirica/core/player/classic/react";
import { useChat } from '../ChatContext'; 
import { Timer } from "../components/Timer";
import { useStageTimer } from "@empirica/core/player/classic/react";
// import features from './features.json';



export function FormalSubmit() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const game = useGame();
  const { appendSystemMessage } = useChat();
  const [hasSubmittedProposal, setHasSubmittedProposal] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitterRole = player.get("role");
  const submittedData_formal = round.get("submittedData_formal");
  const timer = useStageTimer();
  let remainingSeconds = timer?.remaining ? Math.round(timer.remaining / 1000) : null;
  const treatment = game.get("treatment");
  const {featureUrl}= treatment;
    // 添加一个状态来存储 features 数据
    const [features, setFeatures] = useState([]);

    const desiredFeaturesForRole = features
    .filter(feature => feature.bonus[player.get("role")] === 1)
    .map(feature => feature.name)
    .join(", ");

    // 使用 useEffect 钩子来在组件加载时请求数据
    useEffect(() => {
      fetch(featureUrl)
        .then(response => response.json()) // 将响应转换为 JSON
        .then(data => setFeatures(data)) // 使用返回的数据更新状态
        .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
    }, []); // 空依赖数组意味着这个 useEffect 只在组件首次渲染时执行
  

      

  useEffect(() => {
   
    const reminders = [30]; 
    if (reminders.includes(remainingSeconds)) {
      const minutesLeft = remainingSeconds / 60; 
      appendSystemMessage({
        id: `reminder-${remainingSeconds}`,
        text: "Reminder: 30 seconds left.",
        sender: {
          id: "system",
          name: "System",
          avatar: "",
          role: "System",
        }
      });
    }
    // 处理 1 分钟警告
    if (remainingSeconds === 10) {
      appendSystemMessage({
        id: `warning-${remainingSeconds}`,
        text: "WARNING: 10 seconds left. please finalize your proposal.",
        sender: {
          id: "system",
          name: "System",
          avatar: "",
          role: "System",
        }
      });
    }
  }, [remainingSeconds, appendSystemMessage]); // 在依赖数组中添加 appendSystemMessage



    

  useEffect(() => {
    setTotalPoints(calculateTotal());
  }, [selectedFeatures, player]);


  const handleOptionChange = featureName => {
    setSelectedFeatures(prev => ({
      ...prev,
      [featureName]: !prev[featureName]
    }));
  };

  const calculateTotal = () => {
    const role = player.get("role");
    return features.reduce((total, feature) => {
      const isSelected = selectedFeatures[feature.name];
      const roleBonus = feature.bonus[role] || 0;
      return total + (isSelected ? roleBonus : 0);
    }, 0);
  };

  const getSubmittedFeaturesAndBonuses = () => {
      // 确保 submittedData_formal 不为空
      if (!submittedData_formal) {
        return null; // 或者返回一个表示无数据的默认状态
      }
  };
  const submissionInfo = getSubmittedFeaturesAndBonuses();
  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;


  const handleSubmitProposal = (event) => {
   // player.stage.set("submit", true); // 这里假设 "submit" 是进入结果页面的正确阶段键
    event.preventDefault();

  // 首先，检查是否至少选择了一个特性
  const hasSelectedFeatureformal = Object.values(selectedFeatures).some(isSelected => isSelected);

  // 如果没有选择任何特性，显示警告弹窗并退出函数
  if (!hasSelectedFeatureformal) {
    alert("You must propose at least one feature to include in your product.");
    return;
  }

    // 假设的保存选择逻辑
    const choices = Object.entries(selectedFeatures).reduce((acc, [feature, isSelected]) => {
      if (isSelected) acc[feature] = features.find(f => f.name === feature).bonus[player.get("role")];
      return acc;
    }, {});

    round.set("submittedData_formal", {
      playerID: player._id,
      decisions: choices,
      submitterRole: player.get("role")
    });
    setIsSubmitted(true); 
    round.set("isSubmitted", true);
    setHasSubmittedProposal(true);
    round.set("isVoting", true);  
    round.set("totalPoints", totalPoints); // 存储totalPoints到round
    round.set("gonext", true);


  if (submitterRole === "role1") {
    const currentCount = game.get("submitCount") || 0;
    game.set("submitCount", currentCount + 1);
    const submissions = game.get("submissions") || [];
    submissions.push({
      submitter: submitterRole,
      choices,
      count: currentCount + 1
    });
    game.set("submissions", submissions);
    console.log(`Submission #${currentCount + 1}:`, choices);
  }

  const selectedFeatureNames = Object.entries(selectedFeatures).filter(([_, isSelected]) => isSelected).map(([featureName]) => featureName);
   const formalmessageText = `CEO has submitted a formal proposal. Features Included are: ${selectedFeatureNames.join(", ")}.`;
   appendSystemMessage({
     id: generateUniqueId(), // 使用生成的唯一ID
     text: formalmessageText,
     sender: {
       id: Date.now(),
       name: "Notification",
       avatar: "",
       role: "Notification",
     }
   });
  };
 

  if (round.get("isSubmitted")) {
    player.stage.set("submit", true);  
    return;
  }


  if (player.get("role") === "role1") {
    return (
      <div className="container">
        <div className="text-brief-wrapper">
       <div className="text-brief">
        <h6>TIME IS UP. As the CEO, you have 1 minute to offer an official proposal. You may continue chatting while waiting. <strong>REMINDER: you can refer to the chat history for the informal vote results.</strong></h6>
        <h6>For this product design deliberation, your role is: <strong>{player.get("name")}</strong>.</h6>
        <h6>You "desired features" are: <strong>{desiredFeaturesForRole || " "}</strong>.</h6>
       </div>
       </div>
       <br />
      {/* 第一个表格始终显示 */}
      <div className="table-container">
      <div className="table-wrapper">
      <br />
                        <table className="styled-table-orange">
                          <thead>
                          <tr >
                              <th>Feature</th>
                              <th>Include</th>
                              <th>Bonus</th>
                            </tr>
                          </thead>
                          <tbody>
                                        {features.map((feature, index) => {
                                          // 检查当前 feature 是否为 desired feature
                                          const isDesiredFeature = desiredFeaturesForRole.split(", ").includes(feature.name);
                                          return (
                                            <tr key={index} className={isDesiredFeature ? "selected-feature" : ""}>
                                              <td>{feature.name}</td>
                                              <td>
                                                <input
                                                  type="checkbox"
                                                  checked={!!selectedFeatures[feature.name]}
                                                  onChange={() => handleOptionChange(feature.name)}
                                                />
                                              </td>
                                              <td>
                                                {selectedFeatures[feature.name] ? feature.bonus[player.get("role")] : 0}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                        </table>

                        <div className="total-points-display"> Total bonus: ${totalPoints}</div>
                        <br />
                {!hasSubmittedProposal && (
                        <div className="button-container">
                      
                            <button onClick={handleSubmitProposal} className={ "submit-button-orange"}>
                              Submit for Formal Vote
                            </button>
                            </div>
                                )}
                                </div>
                                  </div>
                          
                                  </div> 
                                  )

  } else {
    return (
      <div className="waiting-section">
          <div className="loader"></div> 
        <p>Please wait while the CEO enters a proposal for you to vote on.</p>
      </div>
    );
  }
}



