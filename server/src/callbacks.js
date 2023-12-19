import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

const roles = ["Stellar_Cove", "Green_Living", "Illium", "Mayor_Gabriel", "Our_Backyards", "Planning_Commission"];



Empirica.onGameStart(({ game }) => {
//游戏初始化：onGameStart是在游戏开始时触发的。这是设置游戏结构（如回合和阶段）的理想地点。在游戏开始之前定义所有的回合和阶段可以确保游戏的整体结构在游戏开始时就已经固定
  const round = game.addRound({
    name:'Round',
 });
  round.addStage({name:"choice", duration: 10000})
  round.addStage({name:"result", duration: 10000})
  //这里可以添加提交的stage，把上面的choice改为选择投票，这里就是不同的阶段
  //然后 choice 和 result需要和客户端src里创建的jsx名字相同（不用完全一致），我们在这里做的是服务器上的，让empirica知道该干什么

  // 为每个玩家分配角色
  game.players.forEach((player, index) => {
    const roleIndex = index % roles.length;
    player.set("role", roles[roleIndex]);
  });
});


Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});
//如果你的游戏需要基于先前的玩家决策或游戏状态动态创建回合或阶段，那么在onRoundStart或onStageStart中添加它们可能更有意义

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});