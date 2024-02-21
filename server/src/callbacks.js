//callbacks.js
import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import { roles } from '../../AAA';

//const roles = ["Stellar_Cove", "Green_Living", "Illium", "Mayor_Gabriel", "Our_Backyards", "Planning_Commission"];


export const Empirica = new ClassicListenersCollector();


Empirica.onGameStart(({ game }) => {

  const treatment = game.get("treatment");
  const { numRounds, informalSubmitDuration, formalSubmitDuration } = treatment;

  for (let i = 0; i < numRounds; i++) {
    const round = game.addRound({
      name: `Round ${i+1}`,
    });
    //round.addStage({ name: "Informal Submit", duration: informalSubmitDuration });
    round.addStage({ name: "Informal Submit", duration: 8000 });
    round.addStage({ name: "Formal Submit", duration: formalSubmitDuration });
    round.addStage({name:"Result", duration: 600})
  }




  game.players.forEach((player, index) => {
    const roleIndex = index % roles.length;
    player.set("role", roles[roleIndex]);
  });


  
  game.set("submitCount", 0);
  game.set("submissions", []);
  game.set("roundResults", []);

});


Empirica.onRoundStart(({ round }) => {});

 

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


