import React from "react";
import { useGame, usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";


import { Button } from "../components/Button";

import { useChat } from '../ChatContext'; 
export function Result() {

  const player = usePlayer();
  const game = useGame();
  const round = useRound();
  const { appendSystemMessage } = useChat();
  
  const players = usePlayers();
  const forVotes = players.filter(p => p.get("vote") === "For").length;
  const againstVotes = players.filter(p => p.get("vote") === "Against").length;
  const submissions = game.get("submissions") || [];
  const pass = players.filter(p => p.get("role") !== "CEO").every(p => p.get("vote") === "For");


    // 如有反对票
    if (againstVotes > 0) {
      return (
        <div>
          <h4>Voting Results:</h4>
          <p>Votes For: {forVotes}</p>
          <p>Votes Against: {againstVotes}</p>
          <p>The vote did not pass. Please click the button to try again. If this is the last round, you will go to Exit-Sruvey page.</p>
          <Button handleClick={() => player.stage.set("submit", true)}>Continue</Button>
        </div>
      );
    }
    console.log(`Round result: ${pass ? 'Passed' : 'Did Not Pass'}`);

     // 如果没有反对票
    return (
    <div>
    <h4>
    This activity is complete!
    Please record your results before closing this window.
    </h4>
    <br />
    <h4>Voting Results:</h4>

    <br />
    {submissions.map((submission, index) => {
      // 对于最后一轮，使用当前计算的 pass 值；对于之前的轮次，显示为未通过
      const isLastRound = index === submissions.length - 1;
      const roundPassed = isLastRound ? pass : false;

      return (
        <div key={index}>
          <p>
            <strong>Round {index + 1}:</strong>
            <span style={{ color: roundPassed ? 'green' : 'red' }}>
              {' '}{roundPassed ? 'Passed' : 'Did Not Pass'}
            </span>
          </p>
          {/* 显示该轮的详细信息 */}
          
          <br />
        </div>
      );
    })}
        <Button handleClick={() => player.stage.set("submit", true)}>Continue</Button>
  </div>
  );
}

export default Result;




 

//   // 确保所有玩家都已投票且当前是投票阶段
//   // if (!allVoted) {
//   //   return <div>Waiting for all votes to be tallied...</div>;
//   // }

//   // 根据投票结果展示不同的信息
//   if (pass) {
//     // 如果投票通过
//     return (
//       <div>
//         <h4>Voting Results:</h4>
//         <p>Votes For: {forVotes}</p>
//         <p>Votes Against: {againstVotes}</p>
//         <p>The vote has passed. Congratulations!</p>
//         {/* 这里可以添加后续的操作按钮或逻辑 */}
//         <Button handleClick={() => player.stage.set("submit", true)}>Continue</Button>
//       </div>
//     );
//   } else {
//     // 如果投票未通过
//     return (
//       <div>
//         <h4>Voting Results:</h4>
//         <p>Votes For: {forVotes}</p>
//         <p>Votes Against: {againstVotes}</p>
//         <p>The vote did not pass. Please try again or proceed to the next step.</p>
//         <Button handleClick={() => player.stage.set("submit", true)}>Continue</Button>
//       </div>
//     );
//   }
// }












// import { useGame, usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
// import React from "react";
// import { Button } from "../components/Button";

// export function Result() {
//   const player = usePlayer();
//   const game = useGame();
//   const round = useRound();
//   const players = usePlayers();
//   const forVotes = players.filter(p => p.get("vote") === "For").length;
//   const againstVotes = players.filter(p => p.get("vote") === "Against").length;
//   const submissions = game.get("submissions") || [];

//   const pass = players.filter(p => p.get("role") !== "Stellar_Cove").every(p => p.get("vote") === "For");

//   // 如有反对票
//   if (againstVotes > 0) {
//     return (
//       <div>
//         <h4>Voting Results:</h4>
//         <p>Votes For: {forVotes}</p>
//         <p>Votes Against: {againstVotes}</p>
//         <p>The vote did not pass. Please click the button to try again. If this is the last round, you will go to Exit-Sruvey page.</p>
//         <Button handleClick={() => player.stage.set("submit", true)}>Continue</Button>
//       </div>
//     );
//   }
//   console.log(`Round result: ${pass ? 'Passed' : 'Did Not Pass'}`);

//   // 如果没有反对票
//   return (
//     <div>
// <h4>
// This activity is complete!
// Please record your results before closing this window.
// </h4>
// <br />
//     <h4>Voting Results:</h4>
//     <br />
//     {submissions.map((submission, index) => {
//       // 对于最后一轮，使用当前计算的 pass 值；对于之前的轮次，显示为未通过
//       const isLastRound = index === submissions.length - 1;
//       const roundPassed = isLastRound ? pass : false;
//       return (
//         <div key={index}>
//           <p>
//             <strong>Round {index + 1}:</strong>
//             <span style={{ color: roundPassed ? 'green' : 'red' }}>
//               {' '}{roundPassed ? 'Passed' : 'Did Not Pass'}
//             </span>
//           </p>
//           {/* 显示该轮的详细信息 */}
//           <p>Property Mix: {submission.choices.mix}</p>
//           <p>Low Income Housing: {submission.choices.li}</p>
//           <p>Green Space: {submission.choices.green}</p>
//           <p>Maximum Building Height: {submission.choices.height}</p>
//           <p>Entertainment Venues: {submission.choices.venues}</p>
//           <br />

//         </div>

//       );
//     })}
// <Button handleClick={() => player.stage.set("submit", true)}>
//              Continue
//              </Button>
//   </div>
//   );
// }

// export default Result;


