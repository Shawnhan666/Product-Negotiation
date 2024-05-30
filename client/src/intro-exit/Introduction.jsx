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
      <h3 className="text-lg leading-6 font-medium text-gray-900">
 
       
      </h3>
      <div className="mt-2 mb-6">
        <p className="text-sm text-black-500">
          

          <h2 className="text-lg leading-6 font-bold text-gray-900">Instructions</h2>
          <div className="mt-2 mb-6">

              <div dangerouslySetInnerHTML={instructionsHtml} />

          </div>

        </p>
      </div>
      <Button handleClick={next} autoFocus >
        <p>Next</p>
      </Button>
    </div>
  );
}
