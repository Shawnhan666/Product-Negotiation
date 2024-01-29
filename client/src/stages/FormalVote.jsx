//formalvote.jsx
import { usePlayer, useRound  } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";
import { useGame } from "@empirica/core/player/classic/react";
import React from "react";
import './TableStyles.css';
import { useState, useEffect} from 'react';
import { useStage } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";

export function FormalVote() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    // 当轮次改变时重置所有玩家的投票状态
    players.forEach(p => {
      p.set("vote", null);
    });

    // 重置 allVoted 标记
    round.set("allVoted", false);

  }, [players, round]);

  
  // 获取Stella提交的数据
  useEffect(() => {
    const dataFormal = round.get("submittedData");
    if (dataFormal) {
      setSubmittedData(dataFormal);
    }
  }, [round]);

  // 处理投票逻辑
  const handleVote = (vote) => {





    
    player.set("vote", vote);
    player.stage.set("submit", true);
    console.log( player.get("vote"));
    // 检查是否所有其他玩家都已经投票
    const allPlayersVoted = players.every(p => p.get("vote") || p.get("role") === "Stellar_Cove");
    if (allPlayersVoted) {
      round.set("allVoted", true);
    }

  };



  if (!submittedData) {
    return <div>Please wait while Stellar Cove enters a proposal for you to vote on.</div>;
  }

  // 如果所有玩家都已投票，转入结果页面
  if (round.get("allVoted")) {
    player.stage.set("submit", true); // 这里假设 "submit" 是进入结果页面的正确阶段键
    return <div>Transferring to the results page...</div>;
  }

  // 如果当前玩家已经投票，或者玩家是 "Stellar_Cove"，则显示等待
  if (player.get("vote") || player.get("role") === "Stellar_Cove") {
    return <div>Other parties are still voting. Once votes are in and tallied, the results will be shown.</div>;
  }

  // 显示投票选项
  return (
    <div>
      <h5>Stellar Cove has asked you to vote on the following formal and binding proposal:</h5>
      <p>Property Mix: {submittedData?.decisions.mix}</p>
      <p>Low Income Housing: {submittedData?.decisions.li}</p>
      <p>Green Space: {submittedData?.decisions.green}</p>
      <p>Maximum Building Height: {submittedData?.decisions.height}</p>
      <p>Entertainment Venues: {submittedData?.decisions.venues}</p>
      <div>
        <Button handleClick={() => handleVote("For")}>Vote For</Button>
        <Button handleClick={() => handleVote("Against")}>Vote Against</Button>
      </div>
    </div>
  );
}

export default FormalVote;
































// //formalvote.jsx
// import { usePlayer, useRound  } from "@empirica/core/player/classic/react";
// import { usePlayers } from "@empirica/core/player/classic/react";
// import { useGame } from "@empirica/core/player/classic/react";
// import React from "react";
// import './TableStyles.css';
// import { useState, useEffect} from 'react';
// import { useStage } from "@empirica/core/player/classic/react";
// import { Button } from "../components/Button";

// const MAX_FAIL_ATTEMPTS = numRounds;

//   export function FormalVote() {

//     const player = usePlayer();
//     const players = usePlayers();
//     const round = useRound();
//     const [submittedData, setSubmittedData] = useState(null);
//     const stage = useStage();
//     const game = useGame();

//     const forVotes = players.filter(p => p.get("vote") === "For").length;
//     const totalForVotes = forVotes + 1; // Include "Stellar Cove"
//     const againstVotes = players.filter(p => p.get("vote") === "Against").length;
//     const totalAgainstVotes = againstVotes;
//     const proposalPassed = totalAgainstVotes === 0;
//     const failAttempts = round.get("failAttempts");



//   // get submitted data from Stella
//     useEffect(() => {
//       console.log("Current allVoted status: ", round.get("allVoted"));
//       const dataFormal = round.get("submittedData");
//       //console.log("Submitted Data:", dataFormal);
//       if (dataFormal) {
//         setSubmittedData(dataFormal);
//       }
//     }, [round]);

// //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //投票部分A：
// //1. 在console里显示每个id的投票，for or agianst。
// //2. 当所有人都投票时，设为allVoted。

//     const handleVote = (vote) => {// （）里代表参数，vote或者against
//       player.set("vote", vote);

//       console.log(`Player ${player.id} voted: ${vote}`);

//       const allOtherPlayersVoted = players.filter(p => p.get("role") !== "Stellar_Cove").every(p => p.get("vote"));
//       console.log("All other players voted: ", allOtherPlayersVoted);
//       if (allOtherPlayersVoted) {
//         round.set("allVoted", true);
//         console.log("Setting allVoted to true");
//       }
//     };


// //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //展示Stella所做的proposal。show stella's proposal.

//     const displayProposalDetails = () => {
//       return (
//         <div>
//           <p>Property Mix: {submittedData?.decisions.mix}</p>
//           <p>Low Income Housing: {submittedData?.decisions.li}</p>
//           <p>Green Space: {submittedData?.decisions.green}</p>
//           <p>Maximum Building Height: {submittedData?.decisions.height}</p>
//           <p>Entertainment Venues: {submittedData?.decisions.venues}</p>
//         </div>
//       );
//       };
// //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



//       const handleRevote = () => {
//         players.forEach(player => {
//             player.set("vote", null); 
//         });
//         round.set("allVoted", false); 
//         round.set("submittedData", null); 
//         round.set("isSubmitted", false); 
//         setHasIncremented(false); // 重置 hasIncremented 标记
//     };



// //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //展示提案

//       const displayResults = () => {
//         const forVotes = players.filter(p => p.get("vote") === "For").length;
//         const againstVotes = players.filter(p => p.get("vote") === "Against").length;
//         const totalForVotes = forVotes + 1; // Include "Stellar Cove"
//         const totalAgainstVotes = againstVotes;
//         const proposalPassed = totalAgainstVotes === 0;
//         const failAttempts = round.get("failAttempts");

// //提案通过，点击原装按钮进入result页面
//         if (proposalPassed) {
//           return (
//             <div>
//               <strong>Voting Results</strong>
//               <p>The proposal passed! All parties voted for the proposal, no one voted against it.</p>
//               <br /><br />
//               <p>Proposal details:</p>
//               <br /><br />
//               {displayProposalDetails()}
//               <Button handleClick={() => player.stage.set("submit", true)}>
//                Continue
//               </Button>
//             </div>
//           );
//         }

//               // 检查失败尝试是否达到3次
//         if (failAttempts >= MAX_FAIL_ATTEMPTS) {
//           return (
//             <div>
//               <strong>Voting Results</strong>
//               <br /><br />
//               <p>The Proposal did not pass. {totalForVotes} parties voted for, {totalAgainstVotes} voted against the proposal.</p>
//               <br /><br />
//               <p>The maximum number of 3 formal votes has been reached, please click "Continue" to go to the results page.</p>
//               <Button handleClick={() => player.stage.set("submit", true)}>
//                 Continue
//               </Button>
//             </div>
//           );
//         }

//         else {// 提案未通过的逻辑
//           return (
//             <div>
//             <strong>Voting Results</strong>
//             <p>The Proposal did not pass. {totalForVotes} parties voted for, {totalAgainstVotes} voted against the proposal.</p>
//             <button onClick={handleRevote}>Revote</button>  
//         </div>
//         );
//         }

//       };
    
//       if (round.get("allVoted")) {
//         return displayResults();
//       }

//       if (!submittedData) {
//         return <div>Please wait while Stellar Cove enters a proposal for you to vote on.</div>;
//       }

// // 当前玩家已经投票，或者玩家是 "Stellar_Cove"，则显示等待
//       if (player.get("vote") || player.get("role") === "Stellar_Cove") {
//         return <div>(formalvote)Other parties are still voting. Once votes are in and tallied, the results will be shown.</div>;
//       }
// //如果上面的都不满足，显示下面的

//       return (
//         <div>
//           <h5>Stellar Cove has asked you to vote on the following formal and binding proposal:</h5>

//           <br /><br />
//               <p>The <strong>Property Mix</strong> of the project would be <strong>{submittedData.decisions.mix}</strong>.</p>
//               <p>The project would have <strong>{submittedData.decisions.li}</strong> low income housing.</p>
//               <p>The <strong>Green Space</strong> would be <strong>{submittedData.decisions.green}</strong> acres.</p>
//               <p>The <strong>Maximum Building Height</strong> would be <strong>{submittedData.decisions.height}</strong> ft.</p>
//               <p>The project could have <strong>{submittedData.decisions.venues}</strong> for entertainment.</p>
//             <br /><br />

        
//           <div>
//             <button className="button-spacing" onClick={() => handleVote("For")}>Vote For</button>
//             <button onClick={() => handleVote("Against")}>Vote Against</button>
//           </div>
//         </div>
//       );
//       }

//       export default FormalVote;