
import React from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";


import { useStage } from "@empirica/core/player/classic/react";



const handleButtonClick = () => {
  stage.submitt();  // 提交当前玩家的阶段
};


export function Result() {

  const player = usePlayer();

  const players = usePlayers();
  const stage = useStage();


  function onClick(result) {
    player.stage.set("submit", true);
  }





  const handleButtonClick = () => {
    if (stage && stage.submit) {
      stage.submit();  // 确保 stage 和 stage.submit 存在
    } else {
      console.error("Stage or stage.submit is not available.");
    }
  };

  return (
    <div>
 
      <br />
      <p>TO be continued</p>


        <Button className="m-5" handleClick={() => onClick("silentt")}>
          🤐 Keep silent
        </Button>
        <Button className="m-5" handleClick={() => onClick("testifyy")}>
          📣 Testify
        </Button>

      {/* <Button handleClick={handleButtonClick}>
        Continue
      </Button> */}

      {/* <Button handleClick={() => player.stage.set("submit", true)}>
        Continue
      </Button> */}
    </div>
  );
}



 