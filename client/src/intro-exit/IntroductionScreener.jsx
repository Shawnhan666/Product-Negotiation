import { isDevelopment } from "@empirica/core/player"
import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Profile } from "../Profile";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";

export function IntroductionScreener({ next }) {


  const [boxCount, setBoxCount] = useState(0);
  const [loadedStartTime, setLoadedStartTime] = useState(true);
  const game = useGame(); 
  //const player = usePlayer();
  const treatment = game.get("treatment");

  const [role1, setRole1] = useState("the project head")

  const [closeTime, setCloseTime] = useState("NA");
  const [timeToClose, setTimeToClose] = useState("NA")

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
      
      fetch("https://decide.empirica.app/data/json/settings.json")
      .then(response => response.json()) // 将响应转换为 JSON
      .then(data => {
        
        setCloseTime(data["closeTime"]);
        if(isDevelopment) setCloseTime("19:30")
        setLoadedStartTime(true)
      })
      .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误

  }, []);


  if(loadedStartTime && closeTime!="NA"){
    let secondsUntilClose = (target => (new Date(new Date().setHours(...target.split(':')) - Date.now()) / 1000))(closeTime);
    console.log(secondsUntilClose)
    if(secondsUntilClose<=0) {return(
      <div style={{width:"100vw",height:"100vh",verticalAlign:"middle",display:"flex"}}> 
        <div style={{margin:"auto",fontSize:"larger",fontWeight:"400"}}>
          Sorry, you are too late for this activity!  
          <br/><br/>Please keep an eye out for future activities.
          <br/><br/>Email joshua.becker@ucl.ac.uk with any questions.
        </div>
      </div>
    )} else {
      next()
    }
  }

  return (
    <div style={{width:"100vw",height:"100vh",verticalAlign:"middle",display:"flex"}}> 
        <div style={{margin:"auto",fontSize:"larger",fontWeight:"400"}}>
          Loading...
        </div>
      </div>
  );
}
