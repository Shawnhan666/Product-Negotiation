import { usePlayer, useRound  } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";
import React from "react";
import { Button } from "../components/Button";
import './TableStyles.css';
import { useState, useEffect} from 'react';
import { useGame } from "@empirica/core/player/classic/react";
import { useChat } from '../ChatContext'; 
import features from './features.json';



export function Choice() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const game = useGame();


  const { appendSystemMessage } = useChat();


  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);

  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const [votes, setVotes] = useState({});
  const anySubmitted = round.get("anySubmitted");
  
  const submittedData_informal = round.get("submittedData_informal");
  const nextClicked = round.get("nextClicked");
  const votingCompleted = round.get("votingCompleted");
  const submittedInformalVote = round.get("submittedInformalVote")

  const getSubmitterRoleName = () => {
    return submittedData_informal ? submittedData_informal.submitterRole : "None";
  };


  const handleNext = () => {
    // 重置轮次相关的状态
    round.set("nextClicked", true);
    round.set("votingCompleted", false);
    round.set("anySubmitted", false);
    round.set("submittedData_informal", null);
    round.set("allVoted", false)
    round.set("selectedFeaturesForInformalVote", null);
    round.set("submittedInformalVote", false)
    
  
    // 重置每个玩家的投票状态
    players.forEach(player => {
        player.set("vote", null);
        player.set("currentVote", null); // 如果你有这个状态的话
        player.set("allVoted", false)
        console.log(`Reset vote for player ${player.id}`);
    });
  
    // 可以在这里添加任何其他需要在点击Next时执行的逻辑
  
    // 可选：如果你需要在状态重置后强制刷新页面
    // window.location.reload();
  };

  useEffect(() => {
    setTotalPoints(calculateTotal());
  }, [selectedFeatures, player]);


//-------------

 //--------------------------------------------------------------------------------------------------------重制状态
  useEffect(() => {
    if (nextClicked) {
      // 重置轮次相关的状态
      round.set("votingCompleted", false);
      round.set("anySubmitted", false);
      round.set("submittedData_informal", null);

  
      // 重置每个玩家的投票状态
      players.forEach(player => {
        player.set("vote", null);
      });
  
      // 重置Next点击状态，以便下次可以再次触发
      round.set("anySubmitted", false);
      round.set("nextClicked", false);
    
    }
  }, [nextClicked, players, round]); // 当nextClicked, players或round变化时触发


  useEffect(() => {
    // 当轮次开始或页面加载时重置状态
    const handleReset = () => {
      // 重置轮次相关的状态
      round.set("votingCompleted", false);
      round.set("anySubmitted", false);
      round.set("submittedData_informal", null);
      // 重置每个玩家的投票状态
      players.forEach(player => {
        player.set("vote", null);
      });
    };
  
    // 调用重置函数
    handleReset();
  
    // 你可以在这里加入其他依赖项，比如round._id，以确保每次轮次改变时重置状态
  }, [ nextClicked, round]); // 当players或round变化时触发


//---------------------------------------------------------------------------------------------------------重制状态





useEffect(() => {
  const role = player.get("name");
  const roleIdentifier = player.get("role");

  console.log("player role", role);
  console.log("player roleIdentifier", roleIdentifier);


 if (votingCompleted && roleIdentifier === "role1") {
    const acceptVotes = players.filter(p => p.get("vote") === "For").length;
    const rejectVotes = players.filter(p => p.get("vote") === "Against").length;

    // 构建结果消息
    const resultsMessage = `Informal Vote Results: ${acceptVotes} accept, ${rejectVotes} reject.`;
    // 发送系统消息
    appendSystemMessage({
      id: generateUniqueId(), // 使用生成的唯一ID
      text: resultsMessage,
      sender: {
        id: Date.now(),
        name: "Notification",
        avatar: "",
        role: "Notification",
      }
    });
    console.log(resultsMessage);
  }
}, [votingCompleted,players]); // 移除 appendSystemMessage 作为依赖项



//----------------------------------------------------------------------------------------------

useEffect(() => {
  const allVoted = players.every(player => player.get("vote"));
  // 打印以监控每个玩家的投票状态和allVoted的结果
  console.log("vote stage:", players.map(player => ({ id: player.id, vote: player.get("vote") })));
  console.log("all voted？", allVoted);




  if (allVoted) {
      round.set("votingCompleted", true);
      console.log("all voted，set votingCompleted为true");

      // 使用 setTimeout 来延迟重置逻辑的执行，确保有足够的时间来处理和显示投票结果
  setTimeout(() => {
    handleNext();
  }, 1000); // 延迟1秒执行

  }
}, [players, round, handleNext]); // 当players或round变化时触发



//---------------------------------------------------------------------------------------------------------


//

const handleOptionChange = featureName => {
  setSelectedFeatures(prev => {
    const newState = { ...prev, [featureName]: !prev[featureName] };
    return newState;
  });
};

  const calculateTotal = () => {
    const role = player.get("role");
    return features.reduce((total, feature) => {
      const isSelected = selectedFeatures[feature.name];
      const roleBonus = feature.bonus[role] || 0;
      return total + (isSelected ? roleBonus : 0);
    }, 0);
  };

  const saveChoices = () => {
    const role = player.get("role");
    return features.reduce((choices, feature) => {
      if (selectedFeatures[feature.name]) {
        choices[feature.name] = feature.bonus[role];
      }
      return choices;
    }, {});
  };


  const handleSubmitProposal = (event) => {
 
    event.preventDefault();
    const submitterRoleName = player.get("name");
    const choices = saveChoices();
    const hasSelectedFeature = Object.values(selectedFeatures).some(value => value === true);
    if (!hasSelectedFeature) {
      alert("You must propose at least one feature to include in your product.");
      return;}
    const selectedFeatureNames = Object.keys(selectedFeatures).filter(feature => selectedFeatures[feature]);
    round.set("selectedFeaturesForInformalVote", selectedFeatureNames);
    round.set("anySubmitted", true);   
    setProposalSubmitted(true);
    round.set("submittedData_informal", {
      playerID: player._id,
      decisions: choices,
      submitterRole: submitterRoleName
    });
 
    round.set("submittedInformalVote", true);  

    const messageText = `${submitterRoleName} initiated an Informal Vote. Features Included are: ${selectedFeatureNames.join(", ")}.`;


    appendSystemMessage({
      id: generateUniqueId(), // 使用生成的唯一ID
      text: messageText,
      sender: {
        id: Date.now(),
        name: "Notification",
        avatar: "", // 如果有系统用户的头像可以在这里设置
        role: "Notification", // 标识这是一个系统消息
      }
    });


  };


 

  const allVoted = players.every(player => player.get("vote"));
   // 获取投了 'For' 和 'Against' 的玩家名单
   const forVoters = players.filter(p => p.get("vote") === "For").map(p => p.get("role")).join(", ");
   const againstVoters = players.filter(p => p.get("vote") === "Against").map(p => p.get("role")).join(", ");
   const forVotersCount = players.filter(p => p.get("vote") === "For").length;
   const againstVotersCount = players.filter(p => p.get("vote") === "Against").length;
   
   // 当前玩家的投票结果
   const currentVote = player.get("vote");
 
  const handleVoteSubmit = (vote) => {
  
    player.set("vote", vote); // 存储当前玩家的投票
    round.append("votes", { id: player._id, vote: vote }); // 将投票结果存储到轮次状态中
  };
 

  

  // 根据提交的数据计算并获取相关信息
  const getSubmittedFeaturesAndBonuses = () => {
    // 确保 submittedData_informal 不为空
    if (!submittedData_informal) {
      return null; // 或者返回一个表示无数据的默认状态
    }

    // 处理 submittedData_informal 中的信息
    const { decisions } = submittedData_informal;
    const featuresAndBonuses = Object.entries(decisions).map(([featureName, bonus]) => {
      return { featureName, bonus };
    });

    const totalBonus = featuresAndBonuses.reduce((total, { bonus }) => total + bonus, 0);

    return {
      submitterRole: submittedData_informal.submitterRole,
      featuresAndBonuses,
      totalBonus
    };
  };
  // 使用计算得到的信息在UI中渲染
  const submissionInfo = getSubmittedFeaturesAndBonuses();



  
  
  return (
    <div className="container">
        <div className="informal-text-brief-wrapper">
       <div className="informal-text-brief">
        <h6>Once the countdown is complete, the CEO will have 1 minute to submit a formal proposal.</h6>
        <h6>Toggle the checkboxes below to calculate your bonus and include features for an informal proposal.</h6>
        <h6>You may scroll to the bottom of the page to review the task brief.</h6>
        <br />
        <h6>For this product design deliberation, your role is: <strong>{player.get("name")}</strong>.</h6>
        <h6>The product under deliberation is: <strong>Laptop</strong>.</h6>
        <h6>You "desired features" are: <strong>{
        round.get("selectedFeaturesForInformalVote")?.join(", ") || " "
        }. </strong></h6>

      </div>
      </div>

    <div className="table-container">
      <div className="table-wrapper">

            <table className="styled-table">
                <thead>
                  <tr style={{ backgroundColor: 'lightblue' }}>
                    <th>Product Features</th>
                    <th>Include</th>
                    <th>Bonus</th>
                  </tr>
                </thead>
                <tbody>
                              {features.map((feature, index) => {
                                const isSelectedForVote = round.get("selectedFeaturesForInformalVote")?.includes(feature.name);
                                return (
                                  <tr key={index}>
                                    <td className={isSelectedForVote ? "selected-feature" : ""}>{feature.name}</td>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedFeatures[feature.name] || false}
                                        onChange={() => handleOptionChange(feature.name)}
                                      />
                                    </td>
                                    <td>{selectedFeatures[feature.name] ? feature.bonus[player.get("role")] : 0}</td>
                                  </tr>
                                );
                              })}
                </tbody>
              </table>
      
              {/* "Total" 部分显示在表格下方 */}
              <div className="total-points-display">
                Total Bonus: ${totalPoints}
              </div>
              <br />
              {/* 移动提交按钮到 "Total" 部分下方 */}
              {!anySubmitted && (
                <div className="button-container">
                  <button onClick={handleSubmitProposal} className={anySubmitted ? "submit-button-disabled" : "submit-button"}>
                    Submit for Informal Vote
                  </button>
                  </div>
              )}
             </div>
  
         {submittedData_informal && (
          <div className="table-container">
           <div className="second-styled-table thead th">

            <table className="styled-table"  >
    <thead>
    <tr  >
        <th colSpan="2">Informal Proposal by {getSubmitterRoleName()}</th>
      </tr>
      <tr  >
        <th>Product Features</th>
        <th>Bonus</th>
      </tr>
    </thead>
    <tbody>
      {submissionInfo && submissionInfo.featuresAndBonuses.map(({ featureName, bonus }, index) => (
        <tr key={index}>
          <td>{featureName}</td>
          <td>{bonus}</td>
        </tr>
      ))}
      <tr>
      </tr>
    </tbody>
  </table>
  <div className="total-points-display"> Your bonus: ${submissionInfo && submissionInfo.totalBonus}</div>
          </div>
          </div>
        )}
</div>
<br />
<div className="voting-section">
      {round.get("anySubmitted") && !currentVote && !allVoted && (
        <div className="voting-buttons-container">
          <Button className="vote-button" handleClick={() => handleVoteSubmit("For")}>Accept</Button>
          <Button className="vote-button" handleClick={() => handleVoteSubmit("Against")}>Reject</Button>
        </div>
      )}

      {currentVote && !allVoted && (
        <div>
          {currentVote === "For" && <div>You voted Accept of this informal proposal. Waiting for other votes.</div>}
          {currentVote === "Against" && <div>You voted Reject of this informal proposal. Waiting for other votes.</div>}
        </div>
      )}

      {/* {votingCompleted && (
        <div className="voting-results-container">
        <div><strong>Accept :</strong> {forVotersCount} {forVotersCount === 1 ? 'vote' : 'votes'}</div>
        <div><strong>Reject :</strong> {againstVotersCount} {againstVotersCount === 1 ? 'vote' : 'votes'}</div>

         <Button 
          className="next-button" 
          handleClick={handleNext} 
          disabled={!votingCompleted}>
          Next Informal Submit
        </Button> 
      </div>
    
      )} */}
          </div>
 
          <Button handleClick={() => player.stage.set("submit", true)}>Continue</Button>


     {/* 任务简介 */}

     <div className="task-brief">
     
     <h2 className="task-brief-title"><strong>Task Brief</strong></h2>
<br />

      <p>You will take part in <strong>five</strong> product design deliberations, each lasting 10 minutes and focusing on a different product from a technology company's portfolio. At the start of each deliberation, you will learn which features are your <strong>"desired features"</strong> for that product.</p>
      <br />
      <ul>
        <li>Including a desired product feature nets you $1.</li>
        <li>Including an undesired product feature costs you $0.50.</li>
        <li>Excluding any feature has no impact on earnings.</li>
        <li>To maximize earnings, you should persuade others to include your desired features and exclude undesired ones. A payoff calculator is provided for your convenience.</li>
        <li>The total earnings you make across all design discussions equal your “bonus.”</li>
        <li>If you finish all five, you earn a fixed $10 plus your accumulated “bonus” earnings.</li>
      </ul>
<br />
      <p>In each deliberation, there will be two department heads and one CEO. You are randomly assigned one of these roles each time, which means your role can change from one deliberation to another. Anyone can suggest an <strong>unofficial vote</strong> to gauge each other's interest in including or excluding product features. After 10 minutes, an <strong>official vote</strong> will be conducted where the CEO will propose a set of product features and the two department heads will vote “YES” or “NO” to them. Only official vote results will affect earnings.</p>
      <p>You can see your role and priority features at the bottom of the main negotiations page.</p>
    </div>
  
      
    </div>
  );
  
      }


