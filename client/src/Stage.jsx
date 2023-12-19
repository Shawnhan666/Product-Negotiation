//这一部分按照惯例，他处理游戏不同阶段之间的显示切换
import {
  usePlayer,
  usePlayers,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
//这些hook的使用都要在顶部
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { Choice } from "./stages/Choice";
import { Result } from "./stages/Result";

export function Stage() {
  //here we call the hook to gain access to the stage object
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();

  if (player.stage.get("submit")) {
    //这里get方法从player.stage对象中获取名为"submit"的属性值。
    //***重要！！！player.stage.get("submit")可能用于查询玩家在当前阶段是否完成了某些任务（如提交了答案或做出了选择）。
    //这是一个布尔值，通常用于控制UI的显示（例如，是否显示等待屏幕或进入下一阶段）。
    if (players.length === 1) {
      return <Loading />;
    }

    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player(s).
      </div>
    );
  }
  
  switch (stage.get("name")) {
    //这里，get方法从stage对象中获取名为name的属性值。stage可能代表当前游戏阶段的状态。例如，stage.get("name")可能返回当前阶段的名称，如"choice"或"result，对于otree，可以设立别的“
    case "choice":
      return <Choice />;
    case "result":
      return <Result />;
    default:
      return <Loading />;
  }


}