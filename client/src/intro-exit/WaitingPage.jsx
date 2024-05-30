import React, { useState } from "react";
import { Button } from "../components/Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";

export function WaitingPage({ next }) {



  const game = useGame(); 
  const player = usePlayer();

  const goTime = Date()

  const ButtonText = goTime ?   
    <Button handleClick={next} autoFocus >
      <p>Next</p>
    </Button>
  : 
    ""
  

  return (
    <div className="mt-3 sm:mt-5 p-20">
      Wait Here Please<br/>
      {ButtonText}
    </div>
  );
}
