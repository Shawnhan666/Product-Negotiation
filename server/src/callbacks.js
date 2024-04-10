//callbacks.js
import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import { usePlayer, useGame } from "@empirica/core/player/classic/react";


Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment");

  const {role1}= treatment;
  const {role2} = treatment;
  const {role3} = treatment;
  
  
  console.log("Original roles value:", role1 ,role2, role3);

 // const roles = ["CEO", "Department_Head_A", "Department_Head_B"];

  const { numRounds, informalSubmitDuration, formalSubmitDuration, formalVoteDuration, resultDuration } = treatment;

  for (let i = 0; i < numRounds; i++) {
    const round = game.addRound({
      name: `Round ${i+1}`,
    });
    round.addStage({ name: "Informal Submit", duration: informalSubmitDuration });
    round.addStage({ name: "Formal Submit", duration: formalSubmitDuration });
    round.addStage({ name: "Formal Vote", duration: formalVoteDuration });
    round.addStage({name:"Result", duration: resultDuration})
  }


 
const roles = ["role1", "role2", "role3"]; 
game.players.forEach((player, index) => {
  const roleIdentifier = roles[index % roles.length]; 
  player.set("role", roleIdentifier);  
  
  const roleNameMapping = {role1, role2,role3};
  player.set("role", roleIdentifier); 
  player.set("name", roleNameMapping[roleIdentifier]); 
});


  // const roles = [role1, role2, role3]; // 将角色放入数组以方便访问
  // game.players.forEach((player, index) => {
  //   // 直接根据索引分配角色
  //   const roleName = roles[index]; // 由于玩家和角色数量匹配，直接这样分配
  //   player.set("role", roleName);
  //   player.set("name", roleName);
  // });


 
  // game.players.forEach((player, index) => {
  //   // const roleIndex = index % roles.length;
  //   // const roleName = roles[roleIndex]; // 获取角色名
  //   // player.set("role", roles[roleIndex]);
  //   // player.set("name", roleName); 
  // });



  game.set("submitCount", 0);
  game.set("submissions", []);
  game.set("roundResults", []);

});


Empirica.onRoundStart(({ round }) => { 
  // 假设系统消息存储在round的一个名为'systemMessages'的属性中
  // 您需要根据实际情况调整属性名
  round.set("systemMessages", []); // 重置为一个空数组
});
 

Empirica.onStageStart(({ stage }) => {

  if (stage.get("name") === "Informal Submit") {
    console.log("start of informal submit");
    const players = stage.currentGame.players;
    
    for (const player of players) {
      player.set("vote", null);
      player.set("currentVote", null); // 如果你有这个状态的话
      player.set("allVoted", false)
         // 重置与投票相关的轮次状态
    stage.set("anySubmitted", false);
    stage.set("votingCompleted", false);
    stage.set("submittedData_informal", null);
    stage.set("allVoted", false)
      console.log(`Reset vote for player ${player.id}`);
    }

  }
});

// Empirica.onStageEnded(({ stage, game }) => {

//   if (stage.get("name") !== "Formal Vote") return;
//   console.log("End of formal vote stage");
//   const players = stage.currentGame.players;
//   const round = stage.round;
//   const roundIndex = round.get("index"); // 获取当前轮次的索引




//   let totalPoints = round.get("totalPoints"); // 使用let声明totalPoints以便可以修改它

//   const pass = round.get("pass"); // 获取这一轮是否通过的标志

//    // 如果这一轮没有通过，则设置这一轮的总分为0
//    if (!pass) {
//     totalPoints = 0;
//   }
//    const cumulativePoints = stage.currentGame.get("GamePoints") || 0;
//    const updatedCumulativePoints = totalPoints + cumulativePoints;
//    stage.currentGame.set("GamePoints", updatedCumulativePoints);

//   // 更新或初始化每轮的总分数组
//   const roundPointsHistory = stage.currentGame.get("RoundPointsHistory") || [];
//   roundPointsHistory.push({ roundIndex, totalPoints });
//   stage.currentGame.set("RoundPointsHistory", roundPointsHistory);

//    for (const player of players) {
//    // 在控制台中展示当前轮次的索引、总分和游戏目前的总分数
//    player.set("roundPoints", totalPoints);
//    player.set("cumulativePoints", updatedCumulativePoints);
//    player.set("roundPointsHistory", roundPointsHistory);
//   }

//   console.log(`Round ${roundIndex+1}: Total points for this round: ${totalPoints}`);
//    console.log(`Cumulative GamePoints so far: ${updatedCumulativePoints}`);
//    console.log("Round Points History:");
   
//    roundPointsHistory.forEach((roundData) => {
//   console.log(`Round ${roundData.roundIndex+1}: Total points: ${roundData.totalPoints}`);
  
//    });


//  });

Empirica.onStageEnded(({ stage, game }) => {
  if (stage.get("name") !== "Formal Vote") return;
  console.log("End of formal vote stage");

  const players = stage.currentGame.players;
  const round = stage.round;
  const roundIndex = round.get("index"); // 获取当前轮次的索引
  const pass = round.get("pass"); // 获取这一轮是否通过的标志

  // 从round获取存储的每个角色奖励分数
  const playerBonusesByRole = round.get("playerBonusesByRole") || {};

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
 });



//   // 更新或初始化每轮的总分数组
//   const roundPointsHistory = stage.currentGame.get("RoundPointsHistory") || [];
  
//   for (const player of players) {
//     const role = player.get("role");
//     const roleName = player.get("name"); // 获取玩家的角色名


//     let totalPoints = playerBonusesByRole[role] || 0; 

//     const cumulativePoints = player.get("cumulativePoints") || 0;
//     const updatedCumulativePoints = totalPoints + cumulativePoints;

//     player.set("roundPoints", totalPoints);
//     player.set("cumulativePoints", updatedCumulativePoints);
//     player.set("RoundPointsHistory", roundPointsHistory);
//     // 将本轮分数添加到历史记录中
//     roundPointsHistory.push({ roundIndex, totalPoints,  roleName: roleName  });
//   }

//   console.log("Round Points History:");

  
//   roundPointsHistory.forEach((roundData) => {
//     console.log(`Round ${roundData.roundIndex + 1}:  Role: ${roundData.roleName}, Total points: ${roundData.totalPoints}`);
//   });
// });




Empirica.onRoundEnded(({ round }) => {

 







});




Empirica.onGameEnded(({ game }) => {});

 

 