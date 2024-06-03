import {  useGame, useRound } from "@empirica/core/player/classic/react";
import Chat from "./Chat"; // 导入你的Chat组件，假设它和Game.jsx在同一目录
import React from "react";
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { useEffect} from 'react';

export function Game() {
  const game = useGame();
  const round = useRound();
  const { playerCount, featureUrl } = game.get("treatment");

  
  
  var responseClone;
  useEffect(() => {
    if(game.get("featureData")===undefined) {
      fetch(featureUrl)
        .then(response => { 
          responseClone = response.clone(); // 2
          return response.json();
        })
        .then(data => { game.set("featureData",data) })
        .then(function (data) {
          // Do something with data
      }, function (rejectionReason) { // 3
          console.log('Error parsing JSON from response:', rejectionReason, responseClone); // 4
          responseClone.text() // 5
          .then(function (bodyText) {
              console.log('Received the following instead of valid JSON:', bodyText); // 6
          });
      })    
        .catch(error => console.error("Failed to load features:", error)); 
    }
  }, []);
  

  return (
    <div className="h-full w-full flex">
      <div className="h-full w-full flex flex-col">
        <Profile />
        <div className="h-full flex items-center justify-center">
          <Stage />
        </div>
      </div>

      {playerCount > 1 && (
        <div className="h-full w-256 border-l flex justify-center items-center">
          <Chat scope={round} attribute="chat" />
        </div>
      )}
    </div>
  );
}
