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

import Calculator from "../components/Calculator"
import StrawPoll from "../components/StrawPoll"


export function Choice() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const game = useGame();
  const { appendSystemMessage } = useChat();
  const timer = useStageTimer();
  const [submissionData, setSubmissionData] = useState(player.get("submissionData")); 

  let remainingSeconds = timer?.remaining ? Math.round(timer.remaining / 1000) : null;

  
  const [showTaskBrief, setShowTaskBrief] = useState(false);
  const handleShowTaskBrief = () => setShowTaskBrief(true);
  const handleCloseTaskBrief = () => setShowTaskBrief(false);
  const treatment = game.get("treatment");

  const {featureUrl}= treatment;
  const {role1} = treatment;

    // 添加一个状态来存储 features 数据
  const [featureData, setFeatureData] = useState({});
  const [features, setFeatures] = useState([]);
  const [productName, setProductName] = useState([]);


  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

  const [totalPoints, setTotalPoints] = useState(0);

  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const [votes, setVotes] = useState({});
  const anySubmitted = round.get("anySubmitted");
  
  const submittedData_informal = round.get("submittedData_informal");
  const nextClicked = round.get("nextClicked");
  const votingCompleted = round.get("votingCompleted");
  const submittedInformalVote = round.get("submittedInformalVote")

  const [loading, setLoading] = useState(true);



  const [selectedFeatures, setSelectedFeatures] = useState({});

  const allVoted = players.every(player => player.get("vote"));
  // 获取投了 'For' 和 'Against' 的玩家名单
  const forVoters = players.filter(p => p.get("vote") === "For").map(p => p.get("role")).join(", ");
  const againstVoters = players.filter(p => p.get("vote") === "Against").map(p => p.get("role")).join(", ");
  const forVotersCount = players.filter(p => p.get("vote") === "For").length;
  const againstVotersCount = players.filter(p => p.get("vote") === "Against").length;
  
  
  const proposalStatusData = round.get("proposalStatus")===undefined ? 
      {status: false, content: ""}
    :
    round.get("proposalStatus")
  
  //console.log("reading data from round")
  //console.log(proposalStatusData)
  window.proposalStatusData=proposalStatusData
  //window.round=round;
  const strawPollContent = proposalStatusData === undefined ? 
      undefined
    :
      proposalStatusData.content===undefined ? undefined : proposalStatusData.content.proposal
  

  const currentlyVoted = proposalStatusData === undefined ? undefined :
    proposalStatusData.content.proposal===undefined ? undefined : 
      proposalStatusData.content.proposal.vote===undefined ? 
            undefined 
          :
          proposalStatusData.content.proposal.vote.filter(v => Object.keys(v)[0]===player.get("role"))
          .length>0

  const currentVote = !currentlyVoted ? undefined : 
    proposalStatusData.content.proposal.vote.filter(v => Object.keys(v)[0]===player.get("role"))[0][player.get("role")]
    
  //console.log(currentVote)

  const strawPollMessage = proposalStatusData === undefined ? 
    undefined
  :
    proposalStatusData.status ? 
      currentlyVoted ? 
        <>
          {/*
            currentVote === 1 ? 
              <>You Accepted this informal proposal.</>
              :
              <>You Rejected this informal proposal.</>
          */}
          Please wait for others to vote
        </>
      :  
        "Please cast an informal vote."
    : 
      proposalStatusData.content.proposal===undefined ? 
        "status false undefined" 
      : <>
          PROPOSAL {proposalStatusData.content.proposal.result.for===treatment.playerCount ? "PASSED" : "REJECTED"}
          <br/>Yes: {proposalStatusData.content.proposal.result.for} &nbsp;&nbsp;&nbsp;&nbsp; No: {proposalStatusData.content.proposal.result.against}
        </>
      


  
  

  useEffect(() => {
    // check players number 
    
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



  useEffect(() => {
    fetch(featureUrl)
      .then(response => response.json()) // 将响应转换为 JSON
      .then(data => {
        setFeatureData(data[treatment.scenario]); // 更新特性
        setFeatures(data[treatment.scenario].features)
        setProductName(data[treatment.scenario].product_name); // 存储产品名称
        setLoading(false);
      })
      .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误

  }, []); 


  const handleVoteSubmit = (vote) => {
    
    
    var locProposalStatus = proposalStatusData
    
    const checkCurrentVote = proposalStatusData.content.proposal===undefined ? undefined : 
    proposalStatusData.content.proposal.vote===undefined ? 
      undefined 
    :
    proposalStatusData.content.proposal.vote.filter(v => Object.keys(v)[0]===player.get("role")).length>0

    if(checkCurrentVote) {
      return
    }
    
    
    const vote_record = {[player.get("role")]: vote}    
    
    if(locProposalStatus.content.proposal.vote===undefined) {
      locProposalStatus.content.proposal.vote=[vote_record]
    } else {
      locProposalStatus.content.proposal.vote.push(vote_record)
    }

    round.set("proposalStatus", locProposalStatus)
    console.log("setting status line 168")
    console.log(round.get("proposalStatus"))
    
    const countVotes = locProposalStatus.content.proposal.vote.length
    console.log("count votes"+countVotes)
    console.log("counting votes..")
  };



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



  const getSubmitterRoleName = () => {
    return submittedData_informal ? submittedData_informal.submitterRole : "None";
  };

  const MyMessageFunc = () => {

    console.log("setting status line 205")
    round.set("proposalStatus",{status:false, content:""})
    //setProposalStatusData(round.get("proposalStatus"))
    console.log(round.get("proposalStatus"))
    
    if(typeof player.get("my_value") !== 'undefined') {
      player.set("my_value", player.get("my_value")+1)
    
      return;
    }
    
    player.set("my_value",0)
    
    return;
  }

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

const handleVoteResults = () => {

  

  const resultingProposal = proposalStatusData.content.proposal

  console.log(resultingProposal)
  const votes_for = resultingProposal.vote.filter(v=>Object.values(v)==1).length
  const votes_against = resultingProposal.vote.filter(v=>Object.values(v)==0).length

  resultingProposal.result = {for: votes_for, against: votes_against}
  

  console.log("setting status line 285")
  round.set("proposalStatus", {
    status: false, 
    content: {
      message: "this is a message", 
      proposal: resultingProposal
    }
  })
  
  
  console.log("resettting")
  
  console.log(round.get("proposalStatus"))
  
};

//----------------------------------------------------------------------------------------------

useEffect(() => {
  const allVoted = players.every(player => player.get("vote"));

  if (allVoted) {
      round.set("votingCompleted", true);
      

      //handleVoteResults();  /////////////////
      //handleNext();        //////////////////


  }
}, [players, round, handleNext]); 


  const saveChoices = () => {
    const role = player.get("role");
    const returnChoices = features.reduce((choices, feature) => {
      if (selectedFeatures[feature.name]) {
        choices[feature.name] = feature.bonus[role];
      }
      return choices;
    }, {});
    
    
    return returnChoices;
  };


  const handleSubmitProposal = (submission_data) => {

    console.log("setting status line 357")
    round.set("proposalStatus", {
      status: true,
      content: {
        proposal: submission_data,
        vote: []
      }
    })
    
    console.log(round.get("proposalStatus"))

    round.set("anySubmitted", true);   
    setProposalSubmitted(true);
    round.set("submittedData_informal", {
      playerID: player._id,
      decisions: submission_data.choices,
      submitterRole: submission_data.submitterRole
    });
 
    round.set("submittedInformalVote", true);  

    const messageText = `${submission_data.submitterRole} initiated an Informal Vote.`;


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


 
  

  // 使用计算得到的信息在UI中渲染
  

  const desiredFeaturesForRole = features
  .filter(feature => feature.bonus[player.get("role")] > 0)
  .map(feature => feature.name)
  .join(", ");

  
  if(loading) return("Loading..")
  
  
  return (
    <div className="container">

      {/*showTaskBrief && <TaskBriefModal onClose={handleCloseTaskBrief} />*/}

      <div className="informal-text-brief-wrapper">
        <div className="informal-text-brief-1">
          <h6>{ role1 === player.get("name") ? "As "+role1+", you" : "When time is up, "+role1 } will submit a final proposal.{ role1 === player.get("name") ? "when time is up" : "" }</h6>
          <h6><br/><strong>You ALL must agree for the final proposal to pass!</strong></h6>
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
      
        
      <StrawPoll 
          featureData = {featureData}
          submissionData = {strawPollContent}
          handleVoteSubmission = {handleVoteSubmit}
          CurrentVote = {currentVote}
          message = {strawPollMessage}
        />
        <Calculator 
          featureData = {featureData}
          handleProposalSubmission={handleSubmitProposal}
          roleName = {player.get("role")}
          displaySubmit = { !proposalStatusData.status }
          propSelectedFeatures = {player.get("selectedFeatures") ? player.get("selectedFeatures") : {} }
          handleOptionChange = {()=>{}}
          playerRole = {player.get("role")}
        />
  
        
      </div>
      <br />
      {isDevelopment&&(
              <>
                <Button handleClick={() => player.stage.set("submit", true)}>
                  Continue
                </Button>
                <Button handleClick={() => MyMessageFunc() }>
                  Message Click
                </Button>
              </>
            )}
    </div>
  );  
}