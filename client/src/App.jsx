import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import {useState, useEffect } from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { Summary } from "./intro-exit/Summary";
import { Sorry } from "./intro-exit/Sorry";
import { IntroductionScreener } from "./intro-exit/IntroductionScreener";
import { Introduction1 } from "./intro-exit/Introduction1";
import { Introduction2 } from "./intro-exit/Introduction2";
import { WaitingPage } from "./intro-exit/WaitingPage";
import { Walkthrough } from "./intro-exit/Walkthrough";
import { ChatProvider } from "./ChatContext";  
import { AutoPlayerIdForm } from "./autoPlayerIdForm";
import { MyConsent } from "./intro-exit/MyConsent.jsx"; 
import { isDevelopment } from "@empirica/core/player"



export default function App() {

  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";
  const skipIntro = urlParams.get("skipIntro");
  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;


  function introSteps({ game, player }) {
    if(skipIntro) return [];

    if(isDevelopment) return [WaitingPage];
    
    //return [Walkthrough, WaitingPage];
    return [MyConsent, Introduction1, Introduction2, Walkthrough, WaitingPage];
    
  }

  function exitSteps({ game, player }) {
    if(player.get("ended")==="game failed" || player.get("ended")==="game terminated" || player.get("ended")==="no more games") {
      return [Sorry, ExitSurvey];  
    }
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
