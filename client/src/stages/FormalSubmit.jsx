//FormalSubmit.jsx
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

export function FormalSubmit() {


  const player = usePlayer();
    const players = usePlayers();
    const round = useRound();
    const [roleData, setRoleData] = useState({});
    const [points, setPoints] = useState({
      mix: '',
      li: '',
      green: '',
      height: '',
      venues: ''
    });
    const [totalPoints, setTotalPoints] = useState(0); // total points
    const hasSubmitted = round.get("hasSubmitted");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const submittedData = round.get("submittedData");


    
  
    useEffect(() => {
      const role = player.get("role");
      if (role in rolesData) {
        setRoleData(rolesData[role]);
      }
    }, [player]);

    useEffect(() => {
      setTotalPoints(calculateTotal()); // update total point
    }, [points, roleData]);

  
    const handleOptionChange = (event) => {
      const { name, value } = event.target;
      setPoints((prevPoints) => ({
        ...prevPoints,
        [name]: value
      }));
    };
  
    const calculateTotal = () => {
     
      return Object.keys(points).reduce((total, key) => {
        const pointKey = key + "_" + points[key];
        return total + (roleData[pointKey] || 0);
      }, 0);
    };
  

    const areAllIssuesSelected = () => {
   
      return Object.values(points).every(value => value !== '');
    };


/// Submit////
    const handleSubmit2 = (event) => {

      event.preventDefault();
 ////   ///
      if (!areAllIssuesSelected()) {
        alert("Please make a selection for each issue.");
        return;
      }
    
      const choices = Object.keys(points).reduce((acc, key) => {
        acc[key] = optionMappings[key][points[key]] || points[key];
        return acc;
      }, {});
    
      const submitterRoleName = player.get("role");
    
      round.set("submittedData", {
        playerID: player._id,
        decisions: choices,
        submitterRole: submitterRoleName
      });
//////////


    // Submit///////
    player.stage.set("submit", true);
    setIsSubmitted(true); // 添加这一行

    round.set("isSubmitted", true);


    
    };


  // check if all players voted
  const allVoted = players.every(p => p.get("vote"));

  // get vote 'For' 和 'Against' players
  const forVoters = players.filter(p => p.get("vote") === "For").map(p => p.get("role")).join(", ");
  const againstVoters = players.filter(p => p.get("vote") === "Against").map(p => p.get("role")).join(", ");

  // current vote result
  const currentVote = player.get("vote");

  // 
  if (player.get("role") === "Stellar_Cove") {
    if (isSubmitted || round.get("isSubmitted")) {
      return (
        <div>
          Other parties are still voting. Once votes are in and tallied, the results will be shown.
        </div>
      );
    }

    return (

      <div>
        <h6>As the representative of <strong>Stellar Cove</strong>, you need to submit a proposal for consideration. Select an option for each of the five issues using the table below.</h6>
        <br /><br />
        <h6>Note that you will not be able to change the options after submitting. Please select carefully!</h6>
        <br /><br />
        Remember that your reservation price is <strong>32</strong>.
        <br /><br />

        <div className="total-points">
           
        </div>

        <form onSubmit={handleSubmit2}>
          <div className="row">
            <div className="columnone">
              
              <div id="calculator" style={{ width: '100%' }}>
              <table className="styled-table">


              <thead>
                    <tr style={{ backgroundColor: 'lightblue' }}>
                      <th>Issues</th>
                      <th colSpan={5}>Options</th>
                      <th style={{ paddingRight: '60px' }}>Points</th>
                    </tr>
              </thead>

       
                  <tbody>
                    {/* Property Mix */}
                    <tr>
                      <td rowspan="2">Property mix (r:c)</td>
                      <td>30:70</td>
                      <td>50:50</td>
                      <td>70:30</td>
                      <td></td> {/* 新增加的空单元格 */}
                      <td></td> {/* 新增加的空单元格 */}
                  
                      <td style={{ paddingRight: '60px' }}><output>{roleData[`mix_${points.mix}`]}</output></td>
  
              

                    </tr>
                    <tr>
                      <td><input type="radio" name="mix" value="1" onChange={handleOptionChange} /></td>
                      <td><input type="radio" name="mix" value="2" onChange={handleOptionChange} /></td>
                      <td><input type="radio" name="mix" value="3" onChange={handleOptionChange} /></td>
                    </tr>

                  {/* Low-income Residential */}
                  <tr>
                    <td rowspan="2">Low-income residential</td>
                    <td>6%</td>
                    <td>9%</td>
                    <td>12%</td>
                    <td>15%</td>
                    <td></td> {/* 新增加的空单元格 */}
                    <td style={{ paddingRight: '60px' }}><output>{roleData[`li_${points.li}`]}</output></td>
                 
       

                  </tr>
                  <tr>
                    <td><input type="radio" name="li" value="1" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="li" value="2" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="li" value="3" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="li" value="4" onChange={handleOptionChange} /></td>
                  </tr>
                  
                  {/* Green Space */}
                  <tr>
                    <td rowspan="2">Green Space</td>
                    <td>14 acres</td>
                    <td>16 acres</td>
                    <td>18 acres</td>
                    <td>20 acres</td>
                  
                    <td></td> {/* 新增加的空单元格 */}
                    <td style={{ paddingRight: '60px' }}><output>{roleData[`green_${points.green}`]}</output></td>
             
         
                  </tr>
                  <tr>
                    <td><input type="radio" name="green" value="1" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="green" value="2" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="green" value="3" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="green" value="4" onChange={handleOptionChange} /></td>
                  </tr>

                  {/* Max Building Height */}
                  <tr>
                    <td rowspan="2">Max Building Height</td>
                    <td>400ft</td>
                    <td>500ft</td>
                    <td>600ft</td>
                    <td>700ft</td>
                    <td>800ft</td>
                    <td style={{ paddingRight: '60px' }}><output>{roleData[`height_${points.height}`]}</output></td>
               

                  </tr>
                  <tr>
                    <td><input type="radio" name="height" value="1" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="height" value="2" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="height" value="3" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="height" value="4" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="height" value="5" onChange={handleOptionChange} /></td>
                  </tr>

                  {/* Entertainment Complex */}
                  <tr>
                    <td rowspan="2">Entertainment Complex</td>
                    <td>0 venues</td>
                    <td>1 venues</td>
                    <td>2 venues</td>
                    <td>3 venues</td>
                    <td>4 venues</td>
                    <td style={{ paddingRight: '60px' }}><output>{roleData[`venues_${points.venues}`]}</output></td>
                
           

                  </tr>
                  <tr>
                    <td><input type="radio" name="venues" value="1" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="venues" value="2" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="venues" value="3" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="venues" value="4" onChange={handleOptionChange} /></td>
                    <td><input type="radio" name="venues" value="5" onChange={handleOptionChange} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

   {/* “Total Points” 和提交按钮的新布局 */}
   
   <div className="total-points-and-submit">
          <div className="total-points">
            <strong>Total Points: {totalPoints}</strong>
          </div>
          <button 
            type="submit" 
            //className={buttonClassName}
            onClick={handleSubmit2}>
            Submit for Vote
          </button>
        </div>

        </div>
        </div>
     
  </form>

  </div>




    )

  } else {
    // 如果是其他角色，显示等待信息
    return (
      <div>
        Please wait while Stellar Cove enters a proposal for you to vote on.
      </div>
    );
  }
}

export default FormalSubmit;