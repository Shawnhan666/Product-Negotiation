import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { Summary } from "./intro-exit/Summary";
import { Introduction } from "./intro-exit/Introduction";
import { ChatProvider } from "./ChatContext";  
import { AutoPlayerIdForm } from "./autoPlayerIdForm";
import { MyConsent } from "./intro-exit/MyConsent.jsx"; 
 




export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";
  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    return [MyConsent, Introduction];
  }

  function exitSteps({ game, player }) {
    return [Summary, ExitSurvey];
  }

  const paramsObj = Object.fromEntries(urlParams?.entries());
 
  const playerIdFromUrl = paramsObj?.playerId || "undefined";
 
   if(playerIdFromUrl=="undefined") {
     return(
       // this should return an error page
       <div style={{
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         height: '100vh', 
         fontSize: '24px', 
         color: '#333' 
       }}>You have arrived here via an invalid URL. </div>
     )
   }

  return (
    <EmpiricaParticipant url={url} ns={playerIdFromUrl} modeFunc={EmpiricaClassic}>
      <ChatProvider>  
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full ">
   
          <EmpiricaContext playerCreate={AutoPlayerIdForm} introSteps={introSteps} exitSteps={exitSteps} disableConsent={true}>
            <Game />
          </EmpiricaContext>
        </div>
      </div>
      </ChatProvider> {/* 结束 ChatProvider */}
    </EmpiricaParticipant>
  );
}
