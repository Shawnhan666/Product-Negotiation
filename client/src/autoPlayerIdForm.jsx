import React, { useEffect } from "react";
// autoPlayerIdForm.jsx
export function AutoPlayerIdForm({ onPlayerID }) {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsObj = Object.fromEntries(urlParams?.entries());
    //const playerIdFromUrl = paramsObj?.participantKey || "undefined";
    const playerIdFromUrl = paramsObj?.playerId || "undefined";

    useEffect(() => {
      console.log(`Auto-submitting ID ${playerIdFromUrl} from URL parameter "workerId"`);
      onPlayerID(playerIdFromUrl);
    }, [playerIdFromUrl]);

  }
  

