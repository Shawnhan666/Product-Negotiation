import React, { useState } from "react";
import { Button } from "../components/Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import { Calculator } from "../components/Calculator"
import { StrawPoll } from "../components/StrawPoll"
import { useEffect} from 'react';
import Chat from "../Chat";
import { useChat } from '../ChatContext'; 

export function Walkthrough({ next }) {



  const game = useGame(); 
  const player = usePlayer();
  const treatment = game.get("treatment");
  const {instructionPage} = treatment;
  const { appendSystemMessage } = useChat();

  const [submissionData, setSubmissionData] = useState(null); 
  const [voteButtonActive, setVoteButtonActive] = useState(true); 
  const [showNextButton, setShowNextButton] = useState(false); 

  const handleProposalSubmission = (submission_data) => {
    setSubmissionData(submission_data)
    sendSystemMessage("Good!  Now, even though this is your own proposal, you still need to vote.")

    setTimeout(
      (sendSystemMessage, myMessage)=>{sendSystemMessage(myMessage)}
      ,3000
      ,sendSystemMessage
      ,"Go ahead and vote on your proposal."
    )
    setVoteButtonActive(false)
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

      console.log("ok");
  
      console.log("onLoad run")
      player.set("walkThroughStatus", 1)
    }
  }

  onLoad();

  return (
    <div className="h-full w-full flex">
      <div className="container">
        {showNextButton&&(<center>
          <br/>
          <Button handleClick={next} autoFocus >
            <p>Next (Continue To Game)</p>
          </Button>
        </center>)}
        {player.get("name")}
        <Calculator 
          featureUrl="https://raw.githubusercontent.com/joshua-a-becker/RTools/master/testscoresheet.json" 
          handleProposalSubmission={handleProposalSubmission}
          showVoteButton={true}
          roleName = {"role1"}
          voteButtonActive = {voteButtonActive}
        />
        <StrawPoll 
          featureUrl="https://raw.githubusercontent.com/joshua-a-becker/RTools/master/testscoresheet.json" 
          submissionData = {submissionData}
          handleVoteSubmission = {handleVoteSubmission}
        />
      </div>
      <div className="h-full w-256 border-l flex justify-center items-center">
        <Chat scope={player} attribute="mychat" />
      </div>
    </div>

  );
}
