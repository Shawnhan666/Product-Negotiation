import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Profile } from "../Profile";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";

export function Introduction2({ next }) {


  const [boxCount, setBoxCount] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [role1, setRole1] = useState("the project leader");

  const game = useGame(); 
  //const player = usePlayer();
  const treatment = game.get("treatment");

  const instructions =  [
      'On the next page, you will be shown a simple demo walkthrough of the app.'
    , 'Once you enter the game, you will be randomly assigned a role, possibly ' + role1 + "."
    , 'This demo doesn\'t have any other people, and uses a lunch plan as an example of the platform.'
    , 'After you complete this demo, you can enter a waiting room to be paired with other people.'
    
  ]

  if(startTime!=="NA") instructions.push('The game will open at exactly '+startTime+'.')

  useEffect(() => {
    fetch("https://decide.empirica.app/data/json/settings.json")
      .then(response => response.json()) // 将响应转换为 JSON
      .then(data => { setStartTime(data["startTime"]) })
      .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
  }, []); 

  useEffect(() => {
    if(game.get("featureData")===undefined) {
      console.log("is undefined")
      fetch(treatment.featureUrl)
        .then(response => response.json()) 
        .then(data => { setRole1(data[treatment.scenario].roleNames.role1) })
        .catch(error => console.error("Failed to load features:", error));
        
      } else {
        console.log("defined")
        setRole1(game.get("featureData")[treatment.scenario].roleNames.role1)
      }
      
  }, []);

  return (
    <>
      <div className="big-container"> 
        <div className="scroller">
          <div className="scroller-content">
            <div className="box-content">
              {instructions.slice(0, boxCount+1).reverse().map((element, index) => (
                <>
                  <div className="introduction-box item" style={(index===(0) ? {background: "rgba(193, 235, 250, 0.5)"} : {})}>
                    {element}          
                  </div>
                </>
              ))}    
            </div>
            <div class="next-button-container">
              {((boxCount)<(instructions.length))&&(
                <Button class="next-button" handleClick={()=>{setBoxCount(boxCount+1)}} autoFocus >
                  <p>Ok</p>
                </Button>
              )}
              {((boxCount)>=(instructions.length))&&(
                <Button handleClick={next} autoFocus >
                  <p>Next Page</p>
                </Button>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}
