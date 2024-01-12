//callbacks.js
import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

const roles = ["Stellar_Cove", "Green_Living", "Illium", "Mayor_Gabriel", "Our_Backyards", "Planning_Commission"];



Empirica.onGameStart(({ game }) => {

  const round = game.addRound({
    name:'Round',
 });
  round.addStage({name:"Informal Submit", duration: 120})
  round.addStage({name:"Formal Submit", duration: 12000})
  //round.addStage({name:"Formal Vote", duration: 1})
  round.addStage({name:"Result", duration: 2000})
 




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


Empirica.onStageEnded(({ stage }) => {});



Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});


