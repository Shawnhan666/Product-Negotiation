
import React from "react";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";

export function Result() {

  const player = usePlayer();

  const players = usePlayers();

  return (
    <div>
 
      <br />
      <p>TO te continued</p>

      <Button handleClick={() => player.stage.set("submit", true)}>
        Continue
      </Button>
    </div>
  );
}


