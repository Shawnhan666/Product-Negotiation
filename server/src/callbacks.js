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

Empirica.onStageEnded(({ stage, game }) => {
  if (stage.get("name") === "Result") {
    console.log("End of Result stage");

    const players = stage.currentGame.players;
    let allVotedNotAgainst = true; // 初始化为 true

    // for (const player of players) {
    //   if (player.get("vote") === "Against") {
    //     allVotedNotAgainst = false; // 如果有玩家投票 'Against'，设置为 false
    //     break; // 跳出循环，因为不再需要检查其他玩家
    //   }
    // }

    // if (allVotedNotAgainst) {
    //   console.log("No players have voted 'Against'. Ending the game early.");
    //   stage.currentGame.end("failed", "No players voted Against"); // 结束游戏
    //   return; // 退出函数
    // }
 
  }
});




Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});

 

 