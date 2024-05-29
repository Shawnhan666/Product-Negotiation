import { usePlayer, useRound, useGame } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";
import React from "react";
import { Button } from "../components/Button";
import './TableStyles.css';
import { useState, useEffect} from 'react';
import { useChat } from '../ChatContext'; 
import { Timer } from "../components/Timer";
import { useStageTimer } from "@empirica/core/player/classic/react";
import { isDevelopment } from "@empirica/core/player"


// TaskBriefModal组件定义
function TaskBriefModal({ onClose }) {
  const game = useGame(); 
  const player = usePlayer();
  const treatment = game.get("treatment");
  
  const {instructionPage} = treatment;
  const instructionsHtml = {__html: instructionPage}
  return (
<div className="task-brief-modal" style={{position: 'fixed', top: '20%', right: '45%', left: '5%', padding: '10px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.5)', zIndex: 100,backgroundColor: '#f0f0f0', }}>
      <div className="task-brief">
     <h2 className="task-brief-title"><strong>Task Brief</strong></h2>
<br />
<div dangerouslySetInnerHTML={instructionsHtml} /> </div>
  

 {/* 关闭按钮，使用绝对定位 */}
 <div style={{
    position: 'absolute', // 绝对定位
    top: '10px', // 距离模态框顶部10px
    right: '10px', // 距离模态框右侧10px
    background: '#333', // 深灰色背景
    color: 'white', // 白色文字
    borderRadius: '50%', // 圆形
    width: '30px', // 宽度
    height: '30px', // 高度
    display: 'flex', // 使用Flex布局使内容居中
    alignItems: 'center', // 垂直居中
    justifyContent: 'center', // 水平居中
    cursor: 'pointer' // 鼠标悬停时的指针形状
  }} onClick={onClose}>
       × {/* 这里是关闭图标 */}
  </div>
    </div>
  );
}

export function Choice() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const game = useGame();
  const { appendSystemMessage } = useChat();
  const timer = useStageTimer();
  let remainingSeconds = timer?.remaining ? Math.round(timer.remaining / 1000) : null;

  

  useEffect(() => {
    // check players number 
    console.log("Number of players currently in the game:", players.length);
  }, [players]); // 依赖于 players 数组，确保只在玩家列表变化时输出


  useEffect(() => {
    // 处理 5 分钟和 2 分钟提醒
    const reminders = [300, 120]; // 剩余时间提醒点
    if (reminders.includes(remainingSeconds)) {
      const minutesLeft = remainingSeconds / 60; // 将秒转换为分钟
      appendSystemMessage({
        id: `reminder-${remainingSeconds}`,
        text: `Reminder: ${minutesLeft} Minute${minutesLeft > 1 ? 's' : ''} left.`,
        sender: {
          id: "system",
          name: "System",
          avatar: "",
          role: "System",
        }
      });
    }

    // 处理 1 分钟警告
    if (remainingSeconds === 60) {
      appendSystemMessage({
        id: `warning-${remainingSeconds}`,
        text: "WARNING: 1 Minute left. Please finalize your list of proposed features for official voting.",
        sender: {
          id: "system",
          name: "System",
          avatar: "",
          role: "System",
        }
      });
    }
  }, [remainingSeconds, appendSystemMessage]); // 在依赖数组中添加 appendSystemMessage


const [showTaskBrief, setShowTaskBrief] = useState(false);
const handleShowTaskBrief = () => setShowTaskBrief(true);
const handleCloseTaskBrief = () => setShowTaskBrief(false);
const treatment = game.get("treatment");

const {featureUrl}= treatment;
const {role1} = treatment;

  // 添加一个状态来存储 features 数据
const [features, setFeatures] = useState([]);
const [productName, setProductName] = useState([]);


  useEffect(() => {
    fetch(featureUrl)
      .then(response => response.json()) // 将响应转换为 JSON
      .then(data => {
        setFeatures(data.features); // 更新特性
        setProductName(data.product_name); // 存储产品名称
      })

      .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
  }, []); 



const [selectedFeatures, setSelectedFeatures] = useState({});

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
      return (total + (isSelected ? roleBonus : 0));
    }, 0);
  };



  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

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
    // Reset round-related state
    round.set("nextClicked", true);
    round.set("votingCompleted", false);
    round.set("anySubmitted", false);
    round.set("submittedData_informal", null);
    round.set("allVoted", false)
    round.set("selectedFeaturesForInformalVote", null);
    round.set("submittedInformalVote", false)
    players.forEach(player => {
        player.set("vote", null);
        player.set("currentVote", null); 
        player.set("allVoted", false)
        console.log(`Reset vote for player ${player.id}`);
    });
  

  };

  useEffect(() => {
    setTotalPoints(calculateTotal());
  }, [selectedFeatures, player]);


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
   
  }, [ nextClicked, round]);  


//---------------------------------------------------------------------------------------------------------重制状态



// useEffect(() => {
//   const role = player.get("name");
//   const roleIdentifier = player.get("role");
//   console.log("player role", role);
//   console.log("player roleIdentifier", roleIdentifier);

//   // Check if the vote is complete and only allow a specific role to send the system message
//   if (votingCompleted && roleIdentifier === "role1") {
//     const acceptVotes = players.filter(p => p.get("vote") === "For").length;
//     const rejectVotes = players.filter(p => p.get("vote") === "Against").length;

//          // total votes number 
//     const totalVotes = acceptVotes + rejectVotes;

//     // 检查总投票数是否等于玩家总数
//     if (totalVotes === players.length) {
//         const votePassed = acceptVotes === 3 && rejectVotes === 0;
//         const voteStatus = votePassed ? "passed" : "failed";

//     // Retrieve the selected features for this vote
//     const selectedFeatures = round.get("selectedFeaturesForInformalVote") || [];

//     // Build the result message including the selected features
//     const resultsMessage = `This vote has ${voteStatus} with ${acceptVotes} accept, ${rejectVotes} reject. Features Included: ${selectedFeatures.join(", ")}.`;

//     // Send the system message
//     appendSystemMessage({
//       id: generateUniqueId(), // Use a unique ID
//       text: resultsMessage,
//       sender: {
//         id: Date.now(),
//         name: "Notification",
//         avatar: "",
//         role: "Notification",
//       }
//     });
//     console.log(resultsMessage);
  
// } else {
//   console.log("Not all players have voted. No system message sent.");
// }
// }

// }, [votingCompleted,players]); 


// 新创建的函数，用于处理投票完成后的逻辑
const handleVoteResults = () => {
  const role = player.get("name");
  const roleIdentifier = player.get("role");

  console.log("player role", role);
  console.log("player roleIdentifier", roleIdentifier);

  if (roleIdentifier === "role1") {
    const acceptVotes = players.filter(p => p.get("vote") === "For").length;
    const rejectVotes = players.filter(p => p.get("vote") === "Against").length;

    const totalVotes = acceptVotes + rejectVotes;

    if (totalVotes === players.length) {
      const votePassed = acceptVotes === 3 && rejectVotes === 0;
      const voteStatus = votePassed ? "passed" : "failed";

      const selectedFeatures = round.get("selectedFeaturesForInformalVote") || [];
      const resultsMessage = `This vote has ${voteStatus} with ${acceptVotes} accept, ${rejectVotes} reject. Features Included: ${selectedFeatures.join(", ")}.`;

      appendSystemMessage({
        id: generateUniqueId(),
        text: resultsMessage,
        sender: {
          id: Date.now(),
          name: "Notification",
          avatar: "",
          role: "Notification",
        }
      });

      console.log(resultsMessage);
    } else {
      console.log("Not all players have voted. No system message sent.");
    }
  }
};

//----------------------------------------------------------------------------------------------

useEffect(() => {
  const allVoted = players.every(player => player.get("vote"));

  if (allVoted) {
      round.set("votingCompleted", true);
      console.log("all voted, set votingCompleted为true");

      handleVoteResults();  /////////////////
      handleNext();        //////////////////


  }
}, [players, round, handleNext]); 


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

    const messageText = `${submitterRoleName} initiated an Informal Vote.`;


    appendSystemMessage({
      id: generateUniqueId(), 
      text: messageText,
      sender: {
        id: Date.now(),
        name: "Notification",
        avatar: "", 
        role: "Notification", 
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
    const currentPlayerRole = player.get("role");

    // 处理 submittedData_informal 中的信息
    const { decisions } = submittedData_informal;


    // 使用 features 数组和 decisions 来计算当前玩家的奖励
  const featuresAndBonuses = features.reduce((acc, feature) => {
    // 检查这个特性是否被选中
    if (decisions[feature.name]) {
      // 如果被选中，添加到累加器中，包括特性名称和当前角色的奖励
      acc.push({
        featureName: feature.name,
        // 这里假设如果特性未被选中，则奖励为 0
        bonus: feature.bonus[currentPlayerRole] || 0
      });
    }
    return acc;
  }, []);


    // const featuresAndBonuses = Object.entries(decisions).map(([featureName, bonus]) => {
    //   return { featureName, bonus };
    // });

    const totalBonus = featuresAndBonuses.reduce((total, { bonus }) => total + bonus, 0);

    return {
      submitterRole: submittedData_informal.submitterRole,
      featuresAndBonuses,
      totalBonus
    };
  };
  // 使用计算得到的信息在UI中渲染
  const submissionInfo = getSubmittedFeaturesAndBonuses();

  const desiredFeaturesForRole = features
  .filter(feature => feature.bonus[player.get("role")] > 0)
  .map(feature => feature.name)
  .join(", ");




  
  
  return (
    <div className="container">

      {showTaskBrief && <TaskBriefModal onClose={handleCloseTaskBrief} />}

      <div className="informal-text-brief-wrapper">
        <div className="informal-text-brief-1">
          <h6>{ role1 === player.get("name") ? "As "+role1+", you" : "When time is up, "+role1 } will submit a final proposal.{ role1 === player.get("name") ? "when time is up" : "" }</h6>
          <h6><br/><strong>You ALL must agree for the proposal to pass!</strong></h6>
        </div>
        <br />
        <div className="informal-text-brief-2">
          <h6>On this page, make as many informal proposals as you want.</h6>
          <h6><br/>The calculator shows your bonus for any given proposal.</h6>
          <h6><br/>You preferred features are highlighted in blue.</h6>
        </div>
      </div>
      <br />
      <br />
      <div className="table-container">
      
        {submittedData_informal && (
          <div className="table-container">
            <div className="second-styled-table thead th">
              <table className="styled-table"  >
              <thead>
                <tr  >
                  <td colspan="2" style={{borderTop:'0px',borderRight:'0px',borderLeft:'0px',fontWeight:'bold'}}>
                    Informal Proposal by {getSubmitterRoleName()}
                  </td>
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
            <div className="total-points-display"> Your bonus: ${submissionInfo && Math.round(submissionInfo.totalBonus*100)/100}</div>
            </div>
            <div className="voting-section">
              {currentVote && !allVoted && (
                <div>
                  {currentVote === "For" && <div style={{ color: 'red' }}>You voted Accept of this informal proposal. Waiting for other votes.</div>}
                  {currentVote === "Against" && <div style={{ color: 'red' }}>You voted Reject of this informal proposal. Waiting for other votes.</div>}
                </div>
              )}
            </div>
            {round.get("anySubmitted") && !currentVote && !allVoted && (
              <div className="voting-buttons-container">
                <Button className="vote-button" handleClick={() => handleVoteSubmit("For")}>Accept</Button>
              
                <Button className="vote-button" handleClick={() => handleVoteSubmit("Against")}>Reject</Button> 
              </div>
            )}
          </div>
        )}
        
        <div className="table-wrapper">        
          <table className="styled-table">
            <thead>
              <tr><td colspan="3" style={{borderTop:'0px',borderRight:'0px',borderLeft:'0px',fontWeight:'bold'}}>Calculator</td></tr>
              <tr style={{ backgroundColor: 'lightblue' }}>
                <th>Product Features</th>
                <th>Include</th>
                <th>Bonus</th>
              </tr>
            </thead>    
            <tbody>
              {features.map((feature, index) => {
                //const isSelectedForVote = round.get("selectedFeaturesForInformalVote")?.includes(feature.name);
                const isDesiredFeature = desiredFeaturesForRole.includes(feature.name);
                return (
                  <tr key={index}>
                    <td className={isDesiredFeature ? "selected-feature" : ""}>{feature.name}</td>
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
            Total Bonus: ${Math.round(totalPoints*100)/100}
          </div>
          <br />
          {!anySubmitted && (
            <div className="button-container">

              {/* <button onClick={handleShowTaskBrief} className={"taskbrief-button"}  >Show Task Brief</button> */}
              
              <button onClick={handleSubmitProposal} className={anySubmitted ? "submit-button-disabled" : "submit-button"}>
                Submit for Informal Vote
              </button>
            {/* <Button handleClick={() => player.stage.set("submit", true)}>Continue</Button>  */}
  
            {isDevelopment&&(<Button handleClick={() => player.stage.set("submit", true)}>Continue</Button>)}


            </div>
          )}
        </div>
  
        
      </div>
      <br />
    </div>
  );  
}


