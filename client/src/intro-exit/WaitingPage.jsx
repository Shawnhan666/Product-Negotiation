import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import { isDevelopment } from "@empirica/core/player"

export function WaitingPage({ next }) {



  const game = useGame(); 
  const player = usePlayer();

  

  const [startTime, setStartTime] = useState("NA");
  const [closeTime, setCloseTime] = useState("NA");


  const [timeToStart, setTimeToStart] = useState("NA")
  const [timeToClose, setTimeToClose] = useState("NA")
  const [loaded, setLoaded] = useState(false)

  const [now, setNow] = useState(Date.now())
  
  const target = new Date().setHours(startTime.split(':')[0],startTime.split(':')[1], 0)

  const hours = Math.floor(((target-now)/1000)/60/60)
  const mins = Math.floor(((target-now)/1000)/60 % 60)
  const secs = Math.floor(((target-now)/1000) % 60)

  if(loaded) {
    if(startTime==="NA") next(); 
  }
  
  setTimeout(()=>{setNow(Date.now())}, 1000)
  
  if(startTime!="NA") {
    
    let secondsUntilTarget = (target => (new Date(new Date().setHours(...target.split(':')) - Date.now()) / 1000))(startTime);
    let secondsUntilClose = (target => (new Date(new Date().setHours(...target.split(':')) - Date.now()) / 1000))(closeTime);
    
    if (secondsUntilTarget!==timeToStart) {
      setTimeToStart(secondsUntilTarget)
      setTimeToClose(secondsUntilClose)
    }
  }

  useEffect(() => {
    fetch("https://decide.empirica.app/data/json/settings.json")
      .then(response => response.json()) // 将响应转换为 JSON
      .then(data => {
        setStartTime(data["startTime"]);
        setCloseTime(data["closeTime"]);
        if(isDevelopment) setStartTime("0:45")
        if(isDevelopment) setCloseTime("NA")
        setLoaded(true)
      })
      .catch(error => console.error("Failed to load features:", error)); // 处理可能的错误
  }, []); 

  const waitingContent = 
    <>
      Please wait here until the game starts, which will be {startTime} UK time.<br/><br/>
      <strong>Time to start: </strong> {hours>0?hours+":":""}{hours>0&&mins<10?0:""}{mins}:{(hours>0||mins)&&secs<10?0:""}{secs}
        <br/><br/><br/>
        <center>
        <button className="bg-gray text-black font-bold py-2 px-4 rounded">
        (Not Open Yet)
        </button>
        </center>
    </>

  const startedContent = (timeToClose > 0) | closeTime==="NA" ?
  <>
    The game is now open, but will close soon so enter now!
    <br/><br/>You may have to wait a moment to get matched with other players.
        <br/><br/><br/>
        <center>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={next}>
        Enter Game
        </button>
        </center>
  </>
  : 
  <>Sorry, game closed!</>
  
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
       {timeToStart < 0 ? startedContent : waitingContent}
    </div></div>
    </div></div>
  </>

  );
}
