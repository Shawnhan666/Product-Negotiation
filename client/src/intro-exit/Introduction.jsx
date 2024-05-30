import React, { useState } from "react";
import { Button } from "../components/Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";

export function Introduction({ next }) {



  const game = useGame(); 
  const player = usePlayer();
  const treatment = game.get("treatment");
  const {instructionPage} = treatment;
  const instructionsHtml = {__html: instructionPage}



  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h1 style={{fontWeight:"bold",fontSize:"larger",marginBottom:"20px"}}>Instructions</h1>
      <div dangerouslySetInnerHTML={instructionsHtml} />
      <br/><br/>
      <Button handleClick={next} autoFocus >
        <p>Next</p>
      </Button>
    </div>
  );
}
