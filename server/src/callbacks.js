//callbacks.js
import { ClassicListenersCollector } from "@empirica/core/admin/classic";


export const Empirica = new ClassicListenersCollector();
//import { usePlayer, useGame } from "@empirica/core/player/classic/react";

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment");
  const { role1, role2, role3, numRounds, informalSubmitDuration, formalSubmitDuration, formalVoteDuration, resultDuration, featureUrl } = treatment;


  for (let i = 0; i < numRounds; i++) {
    const round = game.addRound({
      name: `Round ${i + 1}`,
    });
    round.addStage({ name: "Discussion and Informal Vote", duration: informalSubmitDuration });
    round.addStage({ name: "Submit Formal Vote", duration: formalSubmitDuration });
    round.addStage({ name: "Formal Vote", duration: formalVoteDuration });
    
    
    if (i < numRounds - 1) {
      round.addStage({ name: "Result", duration: resultDuration });
    }
  }

  const roles = [{ key: "role1", name: role1 }, { key: "role2", name: role2 }, { key: "role3", name: role3 }];

 
  const shuffledRoles = roles.sort(() => Math.random() - 0.5); 
  game.players.forEach((player, index) => {
    const roleIndex = index % shuffledRoles.length; 
    const role = shuffledRoles[roleIndex];
    player.set("role", role.key); 
    player.set("name", role.name); 
  });
  game.set("submitCount", 0);
  game.set("submissions", []);
  game.set("roundResults", []);
});


Empirica.onRoundStart(({ round }) => { 

  
  const featureUrl = round.currentGame.get("treatment").featureUrl;

  if(round.currentGame.get("featureData")==="undefined") {
    console.log("round start fetch")
    fetch(featureUrl)
    .then(response => response.json()) // 将响应转换为 JSON
    .then(data => {
      round.currentGame.set("featureData", data)
      console.log("done inside roundstart")
    })
    .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
  }
  
  round.set("proposalVoteHistory", [])
  round.set("proposalHistory", [])
  round.set("systemMessages", []);
  const startTime = Date.now();
  round.set("roundStartTime", startTime);
  console.log(`Round ${round.get("index")} Start: Round start time set at ${new Date(startTime).toISOString()}`);
});
 
Empirica.onStageStart(({ stage }) => {
  if (stage.get("name") === "Informal Submit") {
   
    const players = stage.currentGame.players;
    for (const player of players) {
      console.log(`Reset vote for player ${player.id}`);
    }
  }
});



Empirica.onStageEnded(({ stage, game }) => {
  
  const players = stage.currentGame.players;
  const round = stage.round;
  const roundIndex = round.get("index"); // 获取当前轮次的索引
  const pass = round.get("pass"); // 获取这一轮是否通过的标志
  const playerBonusesByRole = round.get("playerBonusesByRole") || {};  // 从round获取存储的每个角色奖励分数

  // only needed for the formal vote
 // if (stage.get("name") !== "Formal Vote") return;
  if (stage.get("name") !== "Formal Vote" && stage.get("name") !== "Discussion and Informal Vote") return;


    // 特别处理 "Formal Vote" 阶段的结束
    if (stage.get("name") === "Formal Vote") {
     // 如果这一轮没有通过，我们可以选择将所有玩家的本轮分数设置为0
  if (!pass) {
    for (const role in playerBonusesByRole) {
      playerBonusesByRole[role] = 0;
    }
  }

   // 获取之前所有轮次的分数历史记录
   let roundPointsHistory = stage.currentGame.get("RoundPointsHistory") || [];
  
   for (const player of players) {
     const role = player.get("role");
     const roleName = player.get("name"); // 获取玩家的角色名
 
     let totalPoints = playerBonusesByRole[role] || 0; // 从playerBonusesByRole获取分数，默认为0
 
     const cumulativePoints = player.get("cumulativePoints") || 0;
     const updatedCumulativePoints = totalPoints + cumulativePoints;
 
     player.set("roundPoints", totalPoints);
     player.set("cumulativePoints", updatedCumulativePoints);
     player.set("RoundPointsHistory", roundPointsHistory);
     // 将本轮分数添加到历史记录中
     roundPointsHistory.push({ roundIndex, totalPoints,  roleName, role });
   }
 
   // 更新游戏对象中的历史记录
   stage.currentGame.set("RoundPointsHistory", roundPointsHistory);
 
   console.log("Round Points History:");
 
   roundPointsHistory.forEach((roundData) => {
     console.log(`Round ${roundData.roundIndex + 1}: Rolename: ${roundData.roleName}, Role: ${roundData.role}, Total points: ${roundData.totalPoints}`);
   });
    }
////////////////////////////////////////

    // 在 "Discussion and Informal Vote" 阶段结束时检查 goBackTriggered
    if (stage.get("name") === "Discussion and Informal Vote") {
      console.log(`Checking goBackTriggered for Discussion and Informal Vote stage: ${stage.get("goBackTriggered")}`);
      if (stage.get("goBackTriggered")) {
        console.log("goBackTriggered is set. Preparing to jump to Result stage...");
  
 // 查找当前轮次
 const currentRound = game.getRound(stage.get("roundId"));
 // 查找名为 "Result" 的阶段
 const resultStage = currentRound.stages.find(s => s.name === "Result");

 if (resultStage) {
   console.log("Result stage found. Jumping to Result stage...");
   game.gotoStage(resultStage);
 } else {
   console.log("Result stage not found. Check game configuration.");
 }

 // 重置 goBackTriggered 状态，避免重复触发
 stage.set("goBackTriggered", false);
 console.log("goBackTriggered has been reset.");
} else {
 console.log("goBackTriggered not set. No action needed.");
}
}




  
 });





Empirica.onRoundEnded(({ round }) => {
  console.log("hello/adsf")

  round.currentGame.set("test", 1)
  round.currentGame.set("missingProposal", round.get("missingProposal"))
  round.currentGame.set("pass", round.get("pass"))
});
Empirica.onGameEnded(({ game }) => {});

 


Empirica.on("round", "proposalStatus", (ctx, {round, proposalStatus}) => {
  
  
  playerCount=round.currentGame.get("treatment").playerCount

  if(proposalStatus.status && proposalStatus.content.proposal.vote){
    countVotes = proposalStatus.content.proposal.vote.length
    if(countVotes>=playerCount) {
      
      
      const resultingProposal = proposalStatus.content.proposal

      
      const votes_for = resultingProposal.vote.filter(v=>Object.values(v)==1).length
      const votes_against = resultingProposal.vote.filter(v=>Object.values(v)==0).length

      resultingProposal.result = {for: votes_for, against: votes_against}
      
      const  proposalItems = Object.keys(proposalStatus.content.proposal.decisions).join(", ")
      
      // reset vote status 
      round.set("proposalStatus", {
        status: false, 
        content: {
          message: "this is a message", 
          proposal: resultingProposal
        }
      })

      // save proposal and vote to history
      //const ph = round.get("proposalHistory")
      //ph.push(resultingProposal)
      //round.append("proposalHistory", "resultingProposal")
      const ph = round.get("proposalVoteHistory")
      ph.push(resultingProposal)
      round.set("proposalVoteHistory", ph)
  

      const passtext = votes_for >= playerCount ? "Proposal passed." : "Proposal rejected with " + votes_for + " yes votes."
      const text = passtext + " Items included: " + proposalItems
      round.append("chat", {
        text,
        sender: {
          id: Date.now(), 
          name: "Notification",
          role: "Notification", 
        },
      });
      

    }
  } else {
    console.log("resetting vote")
  }
});


 Empirica.on("round", "watchValue", (ctx, { round, watchValue }) => {

   console.log("proposal")
   console.log(round.get("proposalHistory"))

   console.log("proposal with vote")
   console.log(round.get("proposalVoteHistory"))

  //round.set("proposalHistory",[])
  //round.set("proposalVoteHistory",[])

});