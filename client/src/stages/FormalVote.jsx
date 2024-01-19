//formalvote.jsx
import { usePlayer, useRound  } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";
import { useGame } from "@empirica/core/player/classic/react";
import React from "react";
import './TableStyles.css';
import { useState, useEffect} from 'react';
import { useStage } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";

const MAX_FAIL_ATTEMPTS = 4;



  export function FormalVote() {
    const player = usePlayer();
    const players = usePlayers();
    const round = useRound();
    const [submittedData, setSubmittedData] = useState(null);
    const stage = useStage();
    const game = useGame();
    //const [roundData, setRoundData] = useState({});


    useEffect(() => {
      // 初始化计数器，如果还没有的话
      if (!round.get("failAttempts")) {
        round.set("failAttempts", 0);
      }
    }, []);


    const [hasIncremented, setHasIncremented] = useState(false);

    useEffect(() => {
      console.log(`useEffect triggered. allVoted: ${round.get("allVoted")}, hasIncremented: ${hasIncremented}`);
    
      const allVoted = round.get("allVoted");
      const proposalPassed = players.filter(p => p.get("vote") === "For").length === players.length;
    
      if (allVoted === true && !proposalPassed && !hasIncremented) {
        const currentFailAttempts = round.get("failAttempts");
        round.set("failAttempts", currentFailAttempts + 1);
        setHasIncremented(true); // 标记已经处理过未通过的情况
        console.log(`Proposal failed, incrementing failAttempts counter to ${currentFailAttempts + 1}`);
      } else if (allVoted === false && hasIncremented) {
        setHasIncremented(false); // 重置标记
        console.log(`Resetting hasIncremented to false`);
      }
    }, [round.get("allVoted")]);
    //这里有点奇怪，每次都会多一个failAttempts的值，所以我把MAX_FAIL_ATTEMPTS = 4设为了4.
    

    


  // get submitted data from Stella
    useEffect(() => {
      console.log("Current allVoted status: ", round.get("allVoted"));
      const dataFormal = round.get("submittedData");
      //console.log("Submitted Data:", dataFormal);
      if (dataFormal) {
        setSubmittedData(dataFormal);
      }
    }, [round]);

  // handle vote
    const handleVote = (vote) => {
      player.set("vote", vote);

      console.log(`Player ${player.id} voted: ${vote}`);

      const allOtherPlayersVoted = players.filter(p => p.get("role") !== "Stellar_Cove").every(p => p.get("vote"));

      console.log("All other players voted: ", allOtherPlayersVoted);

      if (allOtherPlayersVoted) {
        round.set("allVoted", true);
        console.log("Setting allVoted to true");
        
      }
    };

    
  //define display proposal details
    const displayProposalDetails = () => {
      return (
        <div>
          <p>Property Mix: {submittedData?.decisions.mix}</p>
          <p>Low Income Housing: {submittedData?.decisions.li}</p>
          <p>Green Space: {submittedData?.decisions.green}</p>
          <p>Maximum Building Height: {submittedData?.decisions.height}</p>
          <p>Entertainment Venues: {submittedData?.decisions.venues}</p>
        </div>
      );
    };

      const handleRevote = () => {
        players.forEach(player => {
            player.set("vote", null); 
        });
        round.set("allVoted", false); 
        round.set("submittedData", null); 
        round.set("isSubmitted", false); 
        setHasIncremented(false); // 重置 hasIncremented 标记
    };

      const displayResults = () => {
        const forVotes = players.filter(p => p.get("vote") === "For").length;
        const againstVotes = players.filter(p => p.get("vote") === "Against").length;
        const totalForVotes = forVotes + 1; // Include "Stellar Cove"
        const totalAgainstVotes = againstVotes;
        const proposalPassed = totalAgainstVotes === 0;
        const failAttempts = round.get("failAttempts");


        if (proposalPassed) {
          return (
            <div>
              <strong>Voting Results</strong>
              <p>The proposal passed! All parties voted for the proposal, no one voted against it.</p>
              <br /><br />
              <p>Proposal details:</p>
              <br /><br />
              {displayProposalDetails()}
              <Button handleClick={() => player.stage.set("submit", true)}>
               Continue
              </Button>
            </div>
          );
        }
      
              // 检查失败尝试是否达到3次
        if (failAttempts >= MAX_FAIL_ATTEMPTS) {
          return (
            <div>
              <strong>Voting Results</strong>
              <br /><br />
              <p>The Proposal did not pass. {totalForVotes} parties voted for, {totalAgainstVotes} voted against the proposal.</p>
              <br /><br />
              <p>The maximum number of 3 formal votes has been reached, please click "Continue" to go to the results page.</p>
              <Button handleClick={() => player.stage.set("submit", true)}>
                Continue
              </Button>
            </div>
          );
        }


        
        else {
          // 提案未通过的逻辑
          
    
          
     
        return (

          
          <div>
          <strong>Voting Results</strong>
          <p>The Proposal did not pass. {totalForVotes} parties voted for, {totalAgainstVotes} voted against the proposal.</p>
          <button onClick={handleRevote}>Revote</button>  
      </div>
  );
}
      };

      if (round.get("allVoted")) {
        return displayResults();
      }

      if (!submittedData) {
        return <div>Please wait while Stellar Cove enters a proposal for you to vote on.</div>;
      }

      if (player.get("vote") || player.get("role") === "Stellar_Cove") {
        return <div>(formalvote)Other parties are still voting. Once votes are in and tallied, the results will be shown.</div>;
      }

      return (
        <div>
          <h5>Stellar Cove has asked you to vote on the following formal and binding proposal:</h5>

          <br /><br />
              <p>The <strong>Property Mix</strong> of the project would be <strong>{submittedData.decisions.mix}</strong>.</p>
              <p>The project would have <strong>{submittedData.decisions.li}</strong> low income housing.</p>
              <p>The <strong>Green Space</strong> would be <strong>{submittedData.decisions.green}</strong> acres.</p>
              <p>The <strong>Maximum Building Height</strong> would be <strong>{submittedData.decisions.height}</strong> ft.</p>
              <p>The project could have <strong>{submittedData.decisions.venues}</strong> for entertainment.</p>
            <br /><br />

        
          <div>
            <button className="button-spacing" onClick={() => handleVote("For")}>Vote For</button>
            <button onClick={() => handleVote("Against")}>Vote Against</button>
          </div>
        </div>
      );
      }

      export default FormalVote;