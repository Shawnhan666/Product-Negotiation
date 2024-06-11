import React from "react";
import { useGame, usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import  { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useChat } from '../ChatContext'; 

export function Sorry({next}) {

    const player = usePlayer();
    const game = useGame();

  
    return (
      <div class="sorry-modal">
        <div class="sorry-modal-content">
         We're sorry, we were unable to match you to other players.
         <br/><br/>We will award you a partial payment of £1.00 for your waiting time.
         <br/><br/><strong>Please return the prolific task so you can try again another time!</strong>
         <br/><br/>Or enter the completion code "failed".
        </div>
      </div>          
    );
  }
  
  export default Sorry;