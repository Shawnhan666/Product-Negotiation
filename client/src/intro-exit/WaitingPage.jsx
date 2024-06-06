import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import { isDevelopment } from "@empirica/core/player"

export function WaitingPage({ next }) {



  const game = useGame(); 
  const player = usePlayer();

  const [startTime, setStartTime] = useState("NA");

  const [timeToStart, setTimeToStart] = useState("NA")

  if(startTime!="NA") {
    console.log(startTime)
    console.log(timeToStart)
    let secondsUntilTarget = (target => (new Date(new Date().setHours(...target.split(':')) - Date.now()) / 1000))(startTime);
    console.log(secondsUntilTarget)
    if (secondsUntilTarget!==timeToStart) {
      setTimeToStart(secondsUntilTarget)
    }
  }

  useEffect(() => {
    fetch("https://decide.empirica.app/data/json/settings.json")
      .then(response => response.json()) // 将响应转换为 JSON
      .then(data => { 
        setStartTime(data["startTime"]);
        if(isDevelopment) setStartTime("13:30")
      })
      .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
  }, []); 


  const ButtonText = 
    <Button handleClick={next} autoFocus >
      <p>Next</p>
    </Button>
  

  return (
    <>
    <div
      className="task-brief-modal"
      style={{
        position: "fixed",
        margin: 0,
        top: 1,//"20%",
        right: 1,
        left: 1,
        bottom: 1,//"5%",
        padding: 0,//"10px",
        //borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        zIndex: 100,
        backgroundColor: "rgb(20, 20, 20,0.80)",
      }}
    >
    <div
    className="task-brief-modal"
    style={{
      position: "fixed",
      top: "30%",
      right: "30%",
      left: "30%",
      bottom: "30%",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      zIndex: 100,
      backgroundColor: "#FFFFFF",
    }}
>
    <div className="h-full w-full flex items-center justify-center">
    <div className=" items-center justify-center">

    Please wait here until the game starts, which will be {startTime} UK time.<br/><br/>
    <strong>Time to start: </strong> {timeToStart}
      <br/><br/><br/>
      <center>
      asdf
      </center>
    </div></div>
    </div></div>
  </>

  );
}
