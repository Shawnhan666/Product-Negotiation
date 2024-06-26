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
  

  
  const featureData = game.get("featureData")===undefined ? undefined : game.get("featureData")[treatment.scenario]
  const features = featureData === undefined ? undefined : featureData.features
  const productName = featureData === undefined ? undefined : featureData.product_name



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

  window.featureData = featureData
  
  player.set("name", 
    featureData === undefined ? "" : 
      featureData.roleNames === undefined ? 
        "" : featureData.roleNames[player.get("role")]
  )
  const role1 = featureData === undefined ? "" :
    featureData.roleNames === undefined ? "" : 
      featureData.roleNames['role1']
  const [selectedFeatures, setSelectedFeatures] = useState({});

  const allVoted = players.every(player => player.get("vote"));
  const forVoters = players.filter(p => p.get("vote") === "For").map(p => p.get("role")).join(", ");
  const againstVoters = players.filter(p => p.get("vote") === "Against").map(p => p.get("role")).join(", ");
  const forVotersCount = players.filter(p => p.get("vote") === "For").length;
  const againstVotersCount = players.filter(p => p.get("vote") === "Against").length;
  
  const [showInstructionsModal, setShownInstructionsModel] = useState(true);
  
  // set the proposal status data from the round variable
  // or set to a blank proposal, if the round variable is undefined
  const proposalStatusData = round.get("proposalStatus")===undefined ? 
      {status: false, content: ""}
    :
    round.get("proposalStatus")
  
  
  // set the proposal displayed in the straw poll component
  const strawPollContent = proposalStatusData === undefined ? 
      undefined
    :
      proposalStatusData.content===undefined ? undefined : proposalStatusData.content.proposal
  
  // determine whether player has already voted, conditional on an open poll
  const currentlyVoted = proposalStatusData === undefined ? undefined :
    proposalStatusData.content.proposal===undefined ? undefined : 
      proposalStatusData.content.proposal.vote===undefined ? 
            undefined 
          :
          proposalStatusData.content.proposal.vote.filter(v => Object.keys(v)[0]===player.get("role"))
          .length>0

  // calculate player's current vote
  const currentVote = !currentlyVoted ? undefined : 
    proposalStatusData.content.proposal.vote.filter(v => Object.keys(v)[0]===player.get("role"))[0][player.get("role")]
    

  // set message shown in straw poll component 
  // depending on proposal status and content
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
          PROPOSAL {proposalStatusData.content.proposal.result.for===treatment.playerCount ? "PASSED (unofficial)" : "REJECTED"}
          <br/>Yes: {proposalStatusData.content.proposal.result.for} &nbsp;&nbsp;&nbsp;&nbsp; No: {proposalStatusData.content.proposal.result.against}
        </>
      

  
  
  
  // code for handling countdown reminder notifications
  useEffect(() => {
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

  const handleInstructionsModal = function() {
    setShownInstructionsModel(!showInstructionsModal)   
  }



  // handle a vote click from the StrawPoll component
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
    
  }

  const handleOptionChange = featureName => {
    
  };


  const handleSubmitProposal = (submission_data) => {

    console.log("setting status line 357")

    const ph = round.get("proposalHistory")
    ph.push(submission_data)
    round.set("proposalHistory", ph)

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


 

  const header = 
    <>
        <div className="informal-text-brief-1" style={{position: "relative", marginBottom:"50px", marginTop:"50px"}}>

         <div
          className="modal-closer"
          onClick={handleInstructionsModal}
        >
          {showInstructionsModal ? <b>X</b> : "▼" } 
        </div>
        <h6><strong>INSTRUCTIONS</strong></h6>
          {showInstructionsModal&&(<>
            
            <br/>
          <h6>Submit as many informal proposals as you want below.</h6>
          <h6><br/>The calculator shows what proposal is worth.</h6>
        
          <br />
        
          <h6>{ 'role1' === player.get("role") ? "As "+role1+", you" : "At the end, "+role1 } will submit a final proposal { 'role1' === player.get("role") ? "at the end." : "" }</h6>
          <h6><br/><strong>You ALL must agree for the final proposal to pass!</strong></h6>
        
          </>)}      
        </div>   
    </>
  
  
  
  return (
    <div className="h-full w-full flex">
    <div className="h-full w-full flex flex-col">
      <div className="informal-text-brief-wrapper" style={{position:"relative"}}>
        {header}
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
          playerRole = {player.get("role")}
        />
        <Calculator 
          featureData = {featureData}
          handleProposalSubmission={handleSubmitProposal}
          roleName = {player.get("name")}
          displaySubmit = { !proposalStatusData.status }
          propSelectedFeatures = {player.get("selectedFeatures") ? player.get("selectedFeatures") : {} }
          handleOptionChange = {handleOptionChange}
          playerRole = {player.get("role")}
        />
  
        
      </div>
      <br />
      {isDevelopment&&(
              <>
                <Button handleClick={() => player.stage.set("submit", true)}>
                  Continue
                </Button>
                <Button handleClick={() => {round.set("watchValue", round.get("watchValue")+1);console.log(round.get("watchValue"))} }>
                  Click Me
                </Button>
              </>
            )}
    </div></div>
  );  
}