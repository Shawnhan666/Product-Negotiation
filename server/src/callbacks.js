//callbacks.js
import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

const roles = ["Stellar_Cove", "Green_Living", "Illium", "Mayor_Gabriel", "Our_Backyards", "Planning_Commission"];


Empirica.onGameStart(({ game }) => {

  const treatment = game.get("treatment");
  const { numRounds } = treatment;

  for (let i = 0; i < numRounds; i++) {
    const round = game.addRound({
      name: `Round ${i+1}`,
    });
    round.addStage({name:"Informal Submit", duration: 5})
    round.addStage({name:"Formal Submit", duration: 12000})
    round.addStage({name:"Result", duration: 2000})
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

 

Empirica.onStageStart(({ stage }) => {});

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


