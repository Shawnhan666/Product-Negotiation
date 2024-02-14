//FormalSubmit.jsx
import { usePlayer, useRound  } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";
import React from "react";
import { Button } from "../components/Button";
import './TableStyles.css';
import { useState, useEffect} from 'react';
import { useGame } from "@empirica/core/player/classic/react";


import { rolesData, optionMappings } from '../../../AAA';


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


export function FormalSubmit() {

  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const game = useGame();
  const [roleData, setRoleData] = useState({});
  const [points, setPoints] = useState({
    mix: '',
    li: '',
    green: '',
    height: '',
    venues: ''
  });
  const [totalPoints, setTotalPoints] = useState(0); 
 
  

  useEffect(() => {
    const role = player.get("role");
    if (role in rolesData) {
      setRoleData(rolesData[role]);
    }
  }, [player]);

  useEffect(() => {
    setTotalPoints(calculateTotal()); 
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
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Submit button for Stella 

  const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit2 = (event) => {
      event.preventDefault();

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
 
  
    setIsSubmitted(true); 
    round.set("isSubmitted", true);
  

  // 检查是否是 Stellar_Cove 角色并更新提交计数和存储提交内容
    if (submitterRoleName === "Stellar_Cove") {
      const currentCount = game.get("submitCount") || 0;
      game.set("submitCount", currentCount + 1);
      const submissions = game.get("submissions") || [];
      submissions.push({
        submitter: submitterRoleName,
        choices,
        count: currentCount + 1
      });
      game.set("submissions", submissions);
      console.log(`Submission #${currentCount + 1}:`, choices);
    }
 
    };
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Stella stage after submmit 在提交后的状态

  // 
  if (player.get("role") === "Stellar_Cove") {
      if (isSubmitted || round.get("isSubmitted")) {
      return (
        <div>
          (FormalSubmit)Other parties are still voting. Once votes are in and tallied, the results will be shown.
        </div>
      );
    }
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Stella 选择的页面 Stella choose page
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
                    <td></td> 
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
                    <td></td> 
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
   {/* “Total Points”  */}
   <div className="total-points-and-submit">
          <div className="total-points">
            <strong>Total Points: {totalPoints}</strong>
          </div>
          <Button 
            type="submit" 
            onClick={handleSubmit2}>
            Submit for Vote
          </Button> 
        </div>
        </div>
        </div>
  </form>
  </div>
  )
} 
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//如果不是Stella的页面 the page which is not stella
  else {
     
    return (
      <div>
        (formalsubmitpage)Please wait while Stellar Cove enters a proposal for you to vote on.
      </div>
    );
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default FormalSubmit;