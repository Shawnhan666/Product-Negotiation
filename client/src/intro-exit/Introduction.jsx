import React, { useState } from "react";
import { Button } from "../components/Button";
import { Profile } from "../Profile";
//import { usePlayer, useGame } from "@empirica/core/player/classic/react";

export function Introduction({ next }) {



  //const game = useGame(); 
  //const player = usePlayer();
  //const treatment = game.get("treatment");




  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h1 style={{fontWeight:"bold",fontSize:"larger",marginBottom:"20px"}}>Instructions</h1>
      You will be randomly assigned a role in a product design discussion lasting 10 minutes.   
      <br/> <br/>
      You will be given a list of priorities for feature inclusion, and the bonus that you earn (or lose) for each feature. <br/> <br/>

      <b>How you earn a bonus</b>: 
      <br/>• Desired features earn you money. <br/>• Undesired features costs you money.
       <br/>• Excluding features has no impact on earnings. <br/>• A calculator is provided to assess tradeoffs. 
      <br/> <br/>Try to earn as much as you can!   Use the chat to persuade others to include your desired features. 
      
      <br/> <br/><b>How it works</b>: 
      <br/>• Any player may propose an <strong>unofficial vote</strong> at any time.  
      <br/>• One player is randomly assigned project leader.   
      <br/>• After 10 minutes, this project leader will propose a final, <strong>official vote</strong>.  
      <br/>• Only the final vote will determine your earnings.
      <br/><br/>
      <Button handleClick={next} autoFocus >
        <p>Next</p>
      </Button>
    </div>
  );
}
