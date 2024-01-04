import { usePlayer, useRound  } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";
import React from "react";
import { Button } from "../components/Button";
import './TableStyles.css';
import { useState, useEffect} from 'react';

const rolesData = {
    "Stellar_Cove": {
      mix_1: 23, mix_2: 9, mix_3: 0, li_1: 11, li_2: 8, li_3: 4, li_4: 0,
      green_1: 17, green_2: 11, green_3: 8, green_4: 0,
      height_1: 0, height_2: 0, height_3: 10, height_4: 20, height_5: 30,
      venues_1: 0, venues_2: 5, venues_3: 11, venues_4: 14, venues_5: 19
    },
    "Green_Living": {
      mix_1: 0, mix_2: 10, mix_3: 20, li_1: 0, li_2: 5, li_3: 20, li_4: 25,
      green_1: 0, green_2: 10, green_3: 15, green_4: 35,
      height_1: 15, height_2: 10, height_3: 5, height_4: 0, height_5: 0,
      venues_1: 5, venues_2: 5, venues_3: 5, venues_4: 0, venues_5: 0
    },
    "Illium": {
      mix_1: 0, mix_2: 5, mix_3: 10, li_1: 0, li_2: 5, li_3: 10, li_4: 15,
      green_1: 0, green_2: 4, green_3: 10, green_4: 15,
      height_1: 25, height_2: 15, height_3: 10, height_4: 5, height_5: 0,
      venues_1: 35, venues_2: 20, venues_3: 20, venues_4: 0, venues_5: 0
    },
    "Mayor_Gabriel": {
        mix_1: 21, mix_2: 10, mix_3: 0, li_1: 0, li_2: 2, li_3: 4, li_4: 10,
        green_1: 30, green_2: 20, green_3: 9, green_4: 0,
        height_1: 0, height_2: 5, height_3: 10, height_4: 15, height_5: 25,
        venues_1: 0, venues_2: 5, venues_3: 6, venues_4: 9, venues_5: 14
    },
    "Our_Backyards": {
        mix_1: 0, mix_2: 13, mix_3: 6, li_1: 9, li_2: 6, li_3: 3, li_4: 0,
        green_1: 0, green_2: 8, green_3: 16, green_4: 24,
        height_1: 38, height_2: 20, height_3: 10, height_4: 0, height_5: 0,
        venues_1: 4, venues_2: 12, venues_3: 16, venues_4: 8, venues_5: 0
    },
    "Planning_Commission": {
        mix_1: 0, mix_2: 20, mix_3: 10, li_1: 0, li_2: 15, li_3: 15, li_4: 0,
        green_1: 0, green_2: 20, green_3: 30, green_4: 0,
        height_1: 0, height_2: 20, height_3: 15, height_4: 5, height_5: 5,
        venues_1: 0, venues_2: 15, venues_3: 15, venues_4: 15, venues_5: 0
    },
  };
  
const optionMappings = {
  mix: { "1": "30:70", "2": "50:50", "3": "70:30" },
  li: { "1": "6%", "2": "9%", "3": "12%", "4": "15%" },
  green: { "1": "14 acres", "2": "16 acres", "3": "18 acres", "4": "20 acres" },
  height: { "1": "400ft", "2": "500ft", "3": "600ft", "4": "700ft", "5": "800ft" },
  venues: { "1": "0 venues", "2": "1 venues", "3": "2 venues", "4": "3 venues", "5": "4 venues" },
  };



  export function FormalVote() {
    const player = usePlayer();
    const players = usePlayers();
    const round = useRound();
    const [submittedData, setSubmittedData] = useState(null);
  
    useEffect(() => {
      const dataFormal = round.get("submittedData");
      console.log("Submitted Data:", dataFormal);
      if (dataFormal) {
        setSubmittedData(dataFormal);
      }
    }, [round]);
  
    const handleVote = (vote) => {
      player.set("vote", vote);
      const allVoted = players.every(p => p.get("vote"));
      console.log("All Voted:", allVoted);
      if (allVoted) {
        round.set("allVoted", true);
      }
    };

      // 如果 submittedData 不存在，则显示等待信息
  if (!submittedData) {
    return (
      <div>Votepage, Please wait while Stellar Cove enters a proposal for you to vote on.</div>
    );
  }



  if (!submittedData || player.get("vote") || player.get("role") === "Stellar_Cove") {
    // 如果当前玩家已经投票或者所有玩家都已投票
    return (
      <div>
        Other parties are still voting. Once votes are in and tallied, the results will be shown.
      </div>
    );
  }



    return (
            <div>
              <h5>Stellar Cove has asked you to vote on the following <em>formal and binding</em> proposal:</h5>
              <br /><br />
              <p>The <strong>Property Mix</strong> of the project would be <strong>{submittedData.decisions.mix}</strong>.</p>
              <p>The project would have <strong>{submittedData.decisions.li}</strong> low income housing.</p>
              <p>The <strong>Green Space</strong> would be <strong>{submittedData.decisions.green}</strong> acres.</p>
              <p>The <strong>Maximum Building Height</strong> would be <strong>{submittedData.decisions.height}</strong> ft.</p>
              <p>The project could have <strong>{submittedData.decisions.venues}</strong> for entertainment.</p>
        
              {/* 投票按钮 */}
              <div>
                <button className="button-spacing" onClick={() => handleVote("For")}>Vote For</button>
                <button onClick={() => handleVote("Against")}>Vote Against</button>
              </div>
            </div>
          );
        }
        
        export default FormalVote;