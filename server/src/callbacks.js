//callbacks.js
import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import { roles } from '../../AAA';
 


export const Empirica = new ClassicListenersCollector();


Empirica.onGameStart(({ game }) => {



  const treatment = game.get("treatment");
  const { numRounds, informalSubmitDuration, formalSubmitDuration } = treatment;

  for (let i = 0; i < numRounds; i++) {
    const round = game.addRound({
      name: `Round ${i+1}`,
    });
    //round.addStage({ name: "Informal Submit", duration: informalSubmitDuration });
    round.addStage({ name: "Informal Submit", duration: 5000 });

    round.addStage({ name: "Formal Submit", duration: 2000 });
    round.addStage({name:"Result", duration: 600})
  }




  game.players.forEach((player, index) => {
    const roleIndex = index % roles.length;
    const roleName = roles[roleIndex]; // 获取角色名
    player.set("role", roles[roleIndex]);
    player.set("name", roleName); 
  });


  
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

    for (const player of players) {
      if (player.get("vote") === "Against") {
        allVotedNotAgainst = false; // 如果有玩家投票 'Against'，设置为 false
        break; // 跳出循环，因为不再需要检查其他玩家
      }
    }

    if (allVotedNotAgainst) {
      console.log("No players have voted 'Against'. Ending the game early.");
      stage.currentGame.end("failed", "No players voted Against"); // 结束游戏
      return; // 退出函数
    }
 
  }
});




Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});

 

// Empirica.on("round", "submittedInformalVote", (ctx, round, submittedInformalVote) => {
//   console.log("Handling 'submittedInformalVote' change:", submittedInformalVote);
//   console.log("Current round:", ctx.currentRound); // 示例使用ctx参数

//   // 检查是否已处理过提交，避免重复发送消息
//   if (!submittedInformalVote) {
//     console.log("No new submission. Exiting callback.");
//     return;
//   }

//   console.log("New submission detected. Sending system message.");
//   // 假设您已经有了一个处理消息的函数
//   sendSystemMessage(game, "Hello, Someone just submitted an informal vote.");
// });

// function sendSystemMessage(game, text) {    //// test!!!!!!!!
//   console.log("Fetching current messages from the game.");
//   const currentMessages = game.get("messages") || [];
//   console.log("Current messages:", currentMessages);

//   const newMessage = {
//     text: text,
//     sender: "System",
//     createdAt: new Date().toISOString(),
//   };

//   console.log("Adding new message:", newMessage);
//   const updatedMessages = [...currentMessages, newMessage];
//   game.set("messages", updatedMessages);
//   console.log("Updated messages have been set.");
// }
