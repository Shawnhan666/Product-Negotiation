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
 
       <strong>Task Brief</strong>
      </h3>
      <div className="mt-2 mb-6">
        <p className="text-sm text-black-500">
          {/* You will take part in <strong>five</strong> product design deliberations, each lasting 10 minutes and focusing on a different product from a technology company's portfolio. At the start of each deliberation, you will learn which features are your <strong>"desired features"</strong> for that product.
          <br /><br />
          <ul>
        <li>Including a desired product feature nets you $1.</li>
        <li>Including an undesired product feature costs you $0.50.</li>
        <li>Excluding any feature has no impact on earnings.</li>
        <li>To maximize earnings, you should persuade others to include your desired features and exclude undesired ones. A payoff calculator is provided for your convenience.</li>
        <li>The total earnings you make across all design discussions equal your “bonus.”</li>
        <li>If you finish all five, you earn a fixed $10 plus your accumulated “bonus” earnings.</li>
      </ul>
      <br />
          In each deliberation, there will be two department heads and one CEO. You are randomly assigned one of these roles each time, which means your role can change from one deliberation to another. Anyone can suggest an <strong>unofficial vote</strong> to gauge each other's interest in including or excluding product features. After 10 minutes, an <strong>official vote</strong> will be conducted where the CEO will propose a set of product features and the two department heads will vote “YES” or “NO” to them. Only official vote results will affect earnings.
          <br />
          <br />
          You can see your role and priority features at the bottom of the main negotiations page. */}


          <h2 className="text-lg leading-6 font-bold text-gray-900">Instructions</h2>
          <div className="mt-2 mb-6">

              <div dangerouslySetInnerHTML={instructionsHtml} />

          </div>

        </p>
      </div>
      <Button handleClick={next} >
        <p>Next</p>
      </Button>
    </div>
  );
}
