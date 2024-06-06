import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Profile } from "../Profile";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";

export function Introduction2({ next }) {


  const [boxCount, setBoxCount] = useState(0);
  const [startTime, setStartTime] = useState("");

  const game = useGame(); 
  //const player = usePlayer();
  const treatment = game.get("treatment");

  const instructions =  [
      'On the next page, you will be shown a simple demo walkthrough of the app.'
    , 'No other people are here yet.  This is just a demonstration.'
    , 'After you complete this demo, you can enter a waiting room to be paired with other people.'
  ]

  if(startTime!=="NA") instructions.push('The game will open at exactly '+startTime+'.')

  useEffect(() => {
    fetch("https://decide.empirica.app/data/json/settings.json")
      .then(response => response.json()) // 将响应转换为 JSON
      .then(data => { setStartTime(data["startTime"]) })
      .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
  }, []); 

  return (
    <>
      <div className="intro-container">
      <br/><br/>

        {((boxCount)>=(instructions.length))&&(
          <><br/><br/>
          <Button handleClick={next} autoFocus >
            <p>Next</p>
          </Button><br/><br/></>
        )}
        {instructions.slice(0, boxCount+1).reverse().map((element, index) => (
          <>
          <div className="introduction-box">
           {element}
          {(index==0 && boxCount<instructions.length)&&(
            <><br/><br/>
              <center><Button handleClick={()=>{setBoxCount(boxCount+1)}} autoFocus >
                <p>Ok</p>
              </Button></center>
            </>
          )}
  </div>
  </>
        ))}
       
      </div>
    </>
  );
}
