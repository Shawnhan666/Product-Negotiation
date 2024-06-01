import React, { useState } from "react";
import { Button } from "../components/Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import Calculator from "../components/Calculator"
import StrawPoll from "../components/StrawPoll"
import { useEffect} from 'react';
import Chat from "../Chat";
import { useChat } from '../ChatContext'; 
import { IntroProfile } from "../IntroProfile";

export function Walkthrough({ next }) {
  
  const game = useGame(); 
  const player = usePlayer();
  const treatment = game.get("treatment");
  const role1 = treatment.role1;
  const {instructionPage} = treatment;
  const { appendSystemMessage } = useChat();

  //const walkThroughFeatures = featureData["walkthrough_features"];
  //window.features=featureData

  const [walkThroughFeatures, setWalkThroughFeatures] = useState({features:[]});
  const [submissionData, setSubmissionData] = useState(player.get("submissionData")); 
  const [voteButtonActive, setVoteButtonActive] = useState(true); 
  const [showNextButton, setShowNextButton] = useState(false); 

  const [playerMessage, setPlayerMessage] = useState("")

  useEffect(() => {
    fetch(treatment.featureUrl)
      .then(response => response.json()) // 将响应转换为 JSON
      .then(data => { setWalkThroughFeatures(data["walkthrough_features"]) })
      .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
  }, []); 
  


  const handleProposalSubmission = (submission_data) => {
    setSubmissionData(submission_data)
    player.set("submissionData", submission_data)
    sendSystemMessage("Good!  Now, even though this is your own proposal, you still need to vote.")

    setTimeout(
      (sendSystemMessage, myMessage)=>{sendSystemMessage(myMessage)}
      ,3000
      ,sendSystemMessage
      ,"Go ahead and vote on your proposal."
    )
    setVoteButtonActive(false)

  }

  const handleCalcOptionChange = (selectedFeatures) => {
    player.set("selectedFeatures", selectedFeatures)
    
  }

  const handleVoteSubmission = (vote) => {
    sendSystemMessage("Good job!  You'll see the same thing when someone else offers a proposal.")
    setTimeout(
      (sendSystemMessage, myMessage)=>{sendSystemMessage(myMessage)}
      ,2000
      ,sendSystemMessage
      ,"All done!  Click 'next' to continue to the game."
    )
    setShowNextButton(true);
    player.set("currentVote", vote)
    setPlayerMessage(
      <>If this were a real game, you'd be waiting for other players to vote.<br/><br/>Note: this vote doesn't count!  Only the final vote counts.</>
    )
    return(0);
  }

  const sendSystemMessage = (thisMessage) => {
    appendSystemMessage({
      id: 0,
      text: thisMessage,
      sender: {
        id: "system",
        name: "System",
        avatar: "",
        role: "System",
      }
    });

  }
  
        
  const onLoad = () => {
    if(!player.get("walkThroughStatus")) {
      sendSystemMessage("Welcome to the game!  This demo will walk you through the basic setup.")

      setTimeout(
        (sendSystemMessage, myMessage)=>{sendSystemMessage(myMessage)}
        ,5000
        ,sendSystemMessage
        ,"On your screen you see a calculator.  You can use the calculator to determine the bonus you'd get for various designs"
      )
       
      
      setTimeout(
        (sendSystemMessage, myMessage)=>{sendSystemMessage(myMessage)}
        ,10000
        ,sendSystemMessage
        ,"You can also use the calculator to send a vote to others for consideration. "
      )

      setTimeout(
        (sendSystemMessage, myMessage)=>{sendSystemMessage(myMessage)}
        ,11000
        ,sendSystemMessage
        ,"To do this, pick a proposal and then click 'submit for informal vote'."
      )

      player.set("walkThroughStatus", 1)
    }
  }

  onLoad();

  const header = 
    <>

      <div className="informal-text-brief-wrapper">
        {/*<div className="next-button-container">
        player.get("currentVote")&&(
            <button onClick={next} className="next-button wiggle">
              <strong>Next (Continue to Game)</strong>
            </button>
        }
      </div>*/}
        
        <div className="informal-text-brief-1">
          <h6><strong>THIS IS A DEMO.</strong></h6>
          <h6><br/>This platform will help your group agree on a plan for lunch.  Try out proposals using the informal vote, to find out how people feel</h6>
          <h6><br/>Use the chat to discuss the proposals as you proceed.</h6>
          <h6><br/>This calculator shows your bonus different options and let's you make informal proposals.  They don't count, though!  Only the final vote counts.</h6>
        </div>
        <br/>
        <div className="informal-text-brief-1">          
          <h6>In the game, when time is up, {role1} will submit a final proposal.</h6>
          <h6><br/><strong>You ALL must agree for the final proposal to pass!</strong></h6>
        </div>
      </div>
    </>
  

  const walkThroughContent = 
  <>
    <div className="flex-container walkthrough-content">    
      <div className="flex-child">
        <StrawPoll 
          featureData = {walkThroughFeatures}
          submissionData = {submissionData}
          handleVoteSubmission = {handleVoteSubmission}
          message = {playerMessage}
          CurrentVote = {player.get("currentVote")}
          playerRole = "role1"
        />
      </div>

      <div className="flex-child">
        <Calculator 
          featureData = {walkThroughFeatures}
          handleProposalSubmission={handleProposalSubmission}
          showVoteButton={true}
          roleName = "Lunch Attendee"
          playerRole = "role1"
          displaySubmit = {!player.get("submissionData")}
          propSelectedFeatures = {player.get("selectedFeatures") ? player.get("selectedFeatures") : {} }
          handleOptionChange = {handleCalcOptionChange}
        />
      </div>
    </div>
  </>

  

  return (
    <div className="h-full w-full flex">
      <div className="h-full w-full flex flex-col">
      <IntroProfile featureData={walkThroughFeatures} showNextButton={showNextButton} onNext={next} roleName={"Lunch Attendee"} />
        <div className="h-full flex items-center justify-center">
          {header}
        </div>
        <div className="h-full flex items-center justify-center">
          {walkThroughContent}
        </div>
      </div>
      <div className="h-full w-256 border-l flex justify-center items-center">
        <Chat scope={player} attribute="mychat" />
      </div>
    </div>
  );
}
