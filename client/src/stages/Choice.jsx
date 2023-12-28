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
      venue_1: 0, venue_2: 5, venue_3: 11, venue_4: 14, venue_5: 19
    },
    "Green_Living": {
      mix_1: 0, mix_2: 10, mix_3: 20, li_1: 0, li_2: 5, li_3: 20, li_4: 25,
      green_1: 0, green_2: 10, green_3: 15, green_4: 35,
      height_1: 15, height_2: 10, height_3: 5, height_4: 0, height_5: 0,
      venue_1: 5, venue_2: 5, venue_3: 5, venue_4: 0, venue_5: 0
    },
    "Illium": {
      mix_1: 0, mix_2: 5, mix_3: 10, li_1: 0, li_2: 5, li_3: 10, li_4: 15,
      green_1: 0, green_2: 4, green_3: 10, green_4: 15,
      height_1: 25, height_2: 15, height_3: 10, height_4: 5, height_5: 0,
      venue_1: 35, venue_2: 20, venue_3: 20, venue_4: 0, venue_5: 0
    },
    "Mayor_Gabriel": {
        mix_1: 21, mix_2: 10, mix_3: 0, li_1: 0, li_2: 2, li_3: 4, li_4: 10,
        green_1: 30, green_2: 20, green_3: 9, green_4: 0,
        height_1: 0, height_2: 5, height_3: 10, height_4: 15, height_5: 25,
        venue_1: 0, venue_2: 5, venue_3: 6, venue_4: 9, venue_5: 14
    },
    "Our_Backyards": {
        mix_1: 0, mix_2: 13, mix_3: 6, li_1: 9, li_2: 6, li_3: 3, li_4: 0,
        green_1: 0, green_2: 8, green_3: 16, green_4: 24,
        height_1: 38, height_2: 20, height_3: 10, height_4: 0, height_5: 0,
        venue_1: 4, venue_2: 12, venue_3: 16, venue_4: 8, venue_5: 0
    },
    "Planning_Commission": {
        mix_1: 0, mix_2: 20, mix_3: 10, li_1: 0, li_2: 15, li_3: 15, li_4: 0,
        green_1: 0, green_2: 20, green_3: 30, green_4: 0,
        height_1: 0, height_2: 20, height_3: 15, height_4: 5, height_5: 5,
        venue_1: 0, venue_2: 15, venue_3: 15, venue_4: 15, venue_5: 0
    },
};

const optionMappings = {
  mix: { "1": "30:70", "2": "50:50", "3": "70:30" },
  li: { "1": "6%", "2": "9%", "3": "12%", "4": "15%" },
  green: { "1": "14 acres", "2": "16 acres", "3": "18 acres", "4": "20 acres" },
  height: { "1": "400ft", "2": "500ft", "3": "600ft", "4": "700ft", "5": "800ft" },
  venues: { "1": "0 venues", "2": "1 venue", "3": "2 venues", "4": "3 venues", "5": "4 venues" },
};


export function Choice() {
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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const submittedData = round.get("submittedData");

    
  
    useEffect(() => {
      const role = player.get("role");
      if (role in rolesData) {
        setRoleData(rolesData[role]);
      }
    }, [player]);

    useEffect(() => {
      setTotalPoints(calculateTotal()); // 新增 useEffect 用于更新总分
    }, [points, roleData]);

  
    const handleOptionChange = (event) => {
      const { name, value } = event.target;
      setPoints((prevPoints) => ({
        ...prevPoints,
        [name]: value
      }));
    };
  
    const calculateTotal = () => {
      // 假设每个选项的分数都已经在 roleData 中定义
      return Object.keys(points).reduce((total, key) => {
        const pointKey = key + "_" + points[key];
        return total + (roleData[pointKey] || 0);
      }, 0);
    };
  

    const areAllIssuesSelected = () => {
      // 检查每个字段是否有非空值
      return Object.values(points).every(value => value !== '');
    };


    const getSubmitterRoleName = () => {
      if (!submittedData) return "None";
    
      const submitter = players.find(p => p._id === submittedData.playerID);
      return submitter ? submitter.get("role") : "None";
    };


    const handleSubmit = (event) => {
      event.preventDefault();
      // 检查是否所有 Issues 都被选中
      if (!areAllIssuesSelected()) {
        alert("Please make a selection for each issue.");
        return;}
      if (isSubmitted) {
        return;}
      // 转换 points 中的每个值为对应的文本描述
      const choices = Object.keys(points).reduce((acc, key) => {
        acc[key] = optionMappings[key][points[key]] || points[key];
        return acc;
      }, {});

      const submitterRoleName = player.get("role"); // 获取提交者的角色名

        // 存储提交的数据到游戏或轮次状态
      round.set("submittedData", {
        playerID: player._id,
        decisions: choices,
        submitterRole: submitterRoleName // 存储提交者的角色名
      });
      
      setIsSubmitted(true);
    };


    
    
  
    return (
      <div>
        <h6>Once the countdown is complete, Stellar Cove will have 3 minutes to submit a formal proposal.</h6>
        <strong>Use this calculator to understand your interests in this negotiation.</strong>
        <br /><br />
        As the representative for <strong>{player.get("role")}</strong>, your reservation price is <strong>{roleData.my_rp}</strong>.
        <br /><br />
        <div className="total-points">
           
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="columnone">
              
              <div id="calculator" style={{ width: '100%' }}>
              <table className="styled-table">

                    <thead>
                    <tr>
                      <th colSpan={7}></th> {/* 空白单元格，跨越到 "Informal Proposals" 列的位置 */}
                      <th style={{ textAlign: 'center', fontSize: 'inherit' }}>Informal Proposals:</th>
                    </tr>

                    <tr style={{ backgroundColor: 'lightblue' }}>
                      <th>Issues</th>
                      <th colSpan={5}>Options</th>
                      <th style={{ paddingRight: '60px' }}>Points</th> 
                      <th>{submittedData ? submittedData.submitterRole : "None"}</th> {/* 使用存储的角色名 */}
                      {/* <th>{getSubmitterRoleName()}</th> 显示提交者的角色名 */}
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
                      <td>{submittedData ? submittedData.decisions["mix"] : "None"}</td>
              

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
                 
                    <td>{submittedData ? submittedData.decisions["li"] : "None"}</td>

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
                    <td>{submittedData ? submittedData.decisions["green"] : "None"}</td>
         
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
               
                    <td>{submittedData ? submittedData.decisions["height"] : "None"}</td>

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
                    <td>1 venue</td>
                    <td>2 venues</td>
                    <td>3 venues</td>
                    <td>4 venues</td>
                    <td style={{ paddingRight: '60px' }}><output>{roleData[`venue_${points.venues}`]}</output></td>
                    <td>{submittedData ? submittedData.decisions["venues"] : "None"}</td>
           

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

            <div className="bottom-section" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div className="total-points" style={{ marginRight: '10px' }}>
                  <strong>Total Points: {totalPoints}</strong>
                </div>
                <button type="submit" className="submit-button" onClick={handleSubmit} style={{ /* 添加按钮的样式 */ }}>Submit for Informal Vote</button>
              </div>

          </div>
        </div>
      </form>
    </div>
  );

}

export default Choice;