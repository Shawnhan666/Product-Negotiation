import {  useGame, useRound } from "@empirica/core/player/classic/react";
import Chat from "./Chat"; // 导入你的Chat组件，假设它和Game.jsx在同一目录
import React from "react";
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { useState, useEffect} from 'react';

export function Game() {
  const game = useGame();
  const round = useRound();
  const { playerCount } = game.get("treatment");

  if(game.get("featureData")===undefined) {
    console.log("triggering re-render..")
    useEffect(() => { 
      const timer = setTimeout(() => setState(prev => !prev), 3000); 
      return () => clearTimeout(timer); 
    }, []);
  }

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
