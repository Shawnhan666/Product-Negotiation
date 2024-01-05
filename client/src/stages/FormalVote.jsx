import { usePlayer, useRound  } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";
import React from "react";
import './TableStyles.css';
import { useState, useEffect} from 'react';
import { useStage } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";

const rolesData = {
    "Stellar_Cove": {
      mix_1: 23, mix_2: 9, mix_3: 0, li_1: 11, li_2: 8, li_3: 4, li_4: 0,
      green_1: 17, green_2: 11, green_3: 8, green_4: 0,
      height_1: 0, height_2: 0, height_3: 10, height_4: 20, height_5: 30,
      venues_1: 0, venues_2: 5, venues_3: 11, venues_4: 14, venues_5: 19
    },
    "Green_Living": {
      mix_1: 0, mix_2: 10, mix_3: 20, li_1: 0, li_2: 5, li_3: 20, li_4: 25,
      green_1: 0, green_2: 10, green_3: 15, green_4: 35,
      height_1: 15, height_2: 10, height_3: 5, height_4: 0, height_5: 0,
      venues_1: 5, venues_2: 5, venues_3: 5, venues_4: 0, venues_5: 0
    },
    "Illium": {
      mix_1: 0, mix_2: 5, mix_3: 10, li_1: 0, li_2: 5, li_3: 10, li_4: 15,
      green_1: 0, green_2: 4, green_3: 10, green_4: 15,
      height_1: 25, height_2: 15, height_3: 10, height_4: 5, height_5: 0,
      venues_1: 35, venues_2: 20, venues_3: 20, venues_4: 0, venues_5: 0
    },
    "Mayor_Gabriel": {
        mix_1: 21, mix_2: 10, mix_3: 0, li_1: 0, li_2: 2, li_3: 4, li_4: 10,
        green_1: 30, green_2: 20, green_3: 9, green_4: 0,
        height_1: 0, height_2: 5, height_3: 10, height_4: 15, height_5: 25,
        venues_1: 0, venues_2: 5, venues_3: 6, venues_4: 9, venues_5: 14
    },
    "Our_Backyards": {
        mix_1: 0, mix_2: 13, mix_3: 6, li_1: 9, li_2: 6, li_3: 3, li_4: 0,
        green_1: 0, green_2: 8, green_3: 16, green_4: 24,
        height_1: 38, height_2: 20, height_3: 10, height_4: 0, height_5: 0,
        venues_1: 4, venues_2: 12, venues_3: 16, venues_4: 8, venues_5: 0
    },
    "Planning_Commission": {
        mix_1: 0, mix_2: 20, mix_3: 10, li_1: 0, li_2: 15, li_3: 15, li_4: 0,
        green_1: 0, green_2: 20, green_3: 30, green_4: 0,
        height_1: 0, height_2: 20, height_3: 15, height_4: 5, height_5: 5,
        venues_1: 0, venues_2: 15, venues_3: 15, venues_4: 15, venues_5: 0
    },
  };
  
const optionMappings = {
  mix: { "1": "30:70", "2": "50:50", "3": "70:30" },
  li: { "1": "6%", "2": "9%", "3": "12%", "4": "15%" },
  green: { "1": "14 acres", "2": "16 acres", "3": "18 acres", "4": "20 acres" },
  height: { "1": "400ft", "2": "500ft", "3": "600ft", "4": "700ft", "5": "800ft" },
  venues: { "1": "0 venues", "2": "1 venues", "3": "2 venues", "4": "3 venues", "5": "4 venues" },
  };

  export function FormalVote() {
    const player = usePlayer();
    const players = usePlayers();
    const round = useRound();
    const [submittedData, setSubmittedData] = useState(null);
    const stage = useStage();

 
  // 获取提案数据
    useEffect(() => {
      console.log("Current allVoted status: ", round.get("allVoted"));
      const dataFormal = round.get("submittedData");
      console.log("Submitted Data:", dataFormal);
      if (dataFormal) {
        setSubmittedData(dataFormal);
      }
    }, [round]);

  // 处理投票
    const handleVote = (vote) => {
      player.set("vote", vote);
      const allOtherPlayersVoted = players.filter(p => p.get("role") !== "Stellar_Cove").every(p => p.get("vote"));
      if (allOtherPlayersVoted) {
        round.set("allVoted", true);
        console.log("Setting allVoted to true");
      }
    };
  //投票细节定义
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
////////////

      const displayResults = () => {
        const forVotes = players.filter(p => p.get("vote") === "For").length;
        const againstVotes = players.filter(p => p.get("vote") === "Against").length;
        const totalForVotes = forVotes + 1; // Include "Stellar Cove"
        const totalAgainstVotes = againstVotes;
        const proposalPassed = totalAgainstVotes === 0;

        if (proposalPassed) {
          return (
            <div>
              <strong>Voting Results</strong>
              <p>The proposal passed! All parties voted for the proposal, no one voted against it.</p>
              {displayProposalDetails()}
              <Button handleClick={() => stage.submit()}>
                Continue
              </Button>
            </div>
          );
        }

        return (
          <div>
            <strong>Voting Results</strong>
            <p>The Proposal did not pass. {totalForVotes} parties voted for, {totalAgainstVotes} voted against the proposal.</p>
          </div>
        );
      };

      if (round.get("allVoted")) {
        return displayResults();
      }

      if (!submittedData) {
        return <div>Please wait while Stellar Cove enters a proposal for you to vote on.</div>;
      }

      if (player.get("vote") || player.get("role") === "Stellar_Cove") {
        return <div>Other parties are still voting. Once votes are in and tallied, the results will be shown.</div>;
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

          {/* 投票按钮 */}
          <div>
            <button className="button-spacing" onClick={() => handleVote("For")}>Vote For</button>
            <button onClick={() => handleVote("Against")}>Vote Against</button>
          </div>
        </div>
      );
      }

      export default FormalVote;





// ///////////
// // 显示投票结果
// const displayResults = () => {
//   const forVotes = players.filter(p => p.get('vote') === 'For').length;
//   const againstVotes = players.filter(p => p.get('vote') === 'Against').length;
//   const proposalPassed = forVotes + 1 === players.length; // 包括 Stellar Cove

//   if (proposalPassed) {
//     return (
//       <div>
//         <strong>Voting Results</strong>
//         <p>The proposal passed! All parties voted for the proposal, no one voted against it.</p>
        
//         {/* 显示提案细节 */}
//         {displayProposalDetails()}

//         <Button handleClick={() => stage.submit()}>
//           Continue
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <strong>Voting Results</strong>
//       <p>The Proposal did not pass. {forVotes + 1} parties voted for, {againstVotes} voted against the proposal.</p>
//     </div>
//   );
// };







// …………………………………………………………………………………………

//     const allVoted = round.get("allVoted");

//     ////////////////// VOTE Result
//     const displayResults = () => {
//       const stage = useStage();

//       if (!allVoted) {
//         return null;
//       }

//     const forVotes = players.filter(p => p.get("vote") === "For").length;
//     const againstVotes = players.filter(p => p.get("vote") === "Against").length;
//     const totalForVotes = forVotes + 1; // "Stellar Cove" 默认计为 'For'
//     const totalAgainstVotes = againstVotes;

//     const proposalPassed = totalAgainstVotes === 0;




//       // 检查是否所有人都投了赞成票
//       if (proposalPassed) {
//         return (
//           <div>
//             <strong>Voting Results</strong>
//             <br /><br />
//             <p>The proposal passed!</p>
//             <br /><br />
//             <p>All parties voted for the proposal, no one voted against it.</p>
//             <br /><br />


//             <strong>Proposal details: </strong>
//             {/* {submittedData.decisions.mix} */}
//         {/* <p>Property Mix: {submittedData.decisions.mix}</p>
//         <p>Low Income Housing: {submittedData.decisions.li}</p>
//         <p>Green Space: {submittedData.decisions.green}</p>
//         <p>Maximum Building Height: {submittedData.decisions.height}</p>
//         <p>Entertainment Venues: {submittedData.decisions.venues}</p> */}

//             <br /><br />
//             <p>You are now done with this exercise. Click next for your results summary.</p>
//             <br /><br />

//             <Button handleClick={handleButtonClick}>
//         Continue
//       </Button>

//             {/* <Button handleClick={() => player.stage.set("submitt", true)}>
//               Continue
//             </Button>
//      */}
//           </div>
//         );
//       }

//       // 如果不是所有人都投了赞成票
//       return (
//         <div>
//           <strong>Voting Results</strong>
//           <br /><br />
//           <p>The Proposal did not pass.</p>
//           <p>{totalForVotes} parties voted for, {totalAgainstVotes} voted against the proposal.</p>


//         </div>
//       );
//     };




//   // 当所有玩家完成投票
//   if (allVoted) {
//     // 调用 displayResults 显示投票结果
//     return displayResults();
//   }


//       // 如果 submittedData 不存在，则显示等待信息
//   if (!submittedData) {
//     return (
//       <div>Votepage, Please wait while Stellar Cove enters a proposal for you to vote on.</div>
//     );
//   }


//   if (!submittedData || player.get("vote") || player.get("role") === "Stellar_Cove") {
//     // 如果当前玩家已经投票或者所有玩家都已投票
//     return (
//       <div>
//         Other parties are still voting. Once votes are in and tallied, the results will be shown.
//       </div>
//     );
//   }



//     return (
//             <div>
//               <h5>Stellar Cove has asked you to vote on the following <em>formal and binding</em> proposal:</h5>
              // <br /><br />
              // <p>The <strong>Property Mix</strong> of the project would be <strong>{submittedData.decisions.mix}</strong>.</p>
              // <p>The project would have <strong>{submittedData.decisions.li}</strong> low income housing.</p>
              // <p>The <strong>Green Space</strong> would be <strong>{submittedData.decisions.green}</strong> acres.</p>
              // <p>The <strong>Maximum Building Height</strong> would be <strong>{submittedData.decisions.height}</strong> ft.</p>
              // <p>The project could have <strong>{submittedData.decisions.venues}</strong> for entertainment.</p>
        
//               {/* 投票按钮 */}
//               <div>
//                 <button className="button-spacing" onClick={() => handleVote("For")}>Vote For</button>
//                 <button onClick={() => handleVote("Against")}>Vote Against</button>
//               </div>
//             </div>
//           );
//         }
      
//         export default FormalVote;