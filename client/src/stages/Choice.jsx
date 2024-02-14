import { usePlayer, useRound  } from "@empirica/core/player/classic/react";
import { usePlayers } from "@empirica/core/player/classic/react";
import React from "react";
import { Button } from "../components/Button";
import './TableStyles.css';
import { useState, useEffect} from 'react';
import { rolesData, optionMappings } from '../../../AAA';




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
   
    const anySubmitted = round.get("anySubmitted");

    const submittedData_informal = round.get("submittedData_informal");

    const nextClicked = round.get("nextClicked");

   
    useEffect(() => {
      if (nextClicked) {
        // 重置轮次相关的状态
        round.set("votingCompleted", false);
        round.set("anySubmitted", false);
        round.set("submittedData_informal", null);

    
        // 重置每个玩家的投票状态
        players.forEach(player => {
          player.set("vote", null);
        });
    
        // 重置Next点击状态，以便下次可以再次触发
        round.set("anySubmitted", false);
        round.set("nextClicked", false);
      
      }
    }, [nextClicked, players, round]); // 当nextClicked, players或round变化时触发
    

    useEffect(() => {
      // 当轮次开始或页面加载时重置状态
      const handleReset = () => {
        // 重置轮次相关的状态
        round.set("votingCompleted", false);
        round.set("anySubmitted", false);
        round.set("submittedData_informal", null);
    
        // 重置每个玩家的投票状态
        players.forEach(player => {
          player.set("vote", null);
        });
      };
    
      // 调用重置函数
      handleReset();
    
      // 你可以在这里加入其他依赖项，比如round._id，以确保每次轮次改变时重置状态
    }, [ nextClicked, round]); // 当players或round变化时触发

    
  
    
  
    useEffect(() => {
      const role = player.get("role");
      if (role in rolesData) {
        setRoleData(rolesData[role]);
      }
    }, [player]);

    useEffect(() => {
      setTotalPoints(calculateTotal()); // 新增 useEffect 用于更新总分
    }, [points, roleData]);


        // 在 useEffect 中，添加逻辑来检查所有玩家是否都已投票
    useEffect(() => {
        const allVoted = players.every(player => player.get("vote"));

        // 打印以监控每个玩家的投票状态和allVoted的结果
        console.log("vote stage:", players.map(player => ({ id: player.id, vote: player.get("vote") })));
        console.log("all voted？", allVoted);

        if (allVoted) {
            round.set("votingCompleted", true);
            console.log("all voted，set votingCompleted为true");
        }
    }, [players, round]); // 当players或round变化时触发



    


    const votingCompleted = round.get("votingCompleted");



   

    

    const handleNext = () => {
      // 重置轮次相关的状态
      round.set("nextClicked", true);
      round.set("votingCompleted", false);
      round.set("anySubmitted", false);
      round.set("submittedData_informal", null);
      round.set("allVoted", false)

      // 重置每个玩家的投票状态
      players.forEach(player => {
          player.set("vote", null);
          player.set("currentVote", null); // 如果你有这个状态的话
          player.set("allVoted", false)
          console.log(`Reset vote for player ${player.id}`);
      });
  
      // 可以在这里添加任何其他需要在点击Next时执行的逻辑
  
      // 可选：如果你需要在状态重置后强制刷新页面
      // window.location.reload();
  };
  




    
  
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
      if (!submittedData_informal) return "None";
    
      const submitter = players.find(p => p._id === submittedData_informal.playerID);
      return submitter ? submitter.get("role") : "None";
    };




    


    // 动态决定“Submit for Informal Vote”按钮的类名
    const submitButtonClassName = anySubmitted ? "submit-button-disabled" : "submit-button";

         // 动态决定“Next”按钮的类名
    const nextButtonClassName = votingCompleted ? "next-button" : "next-button-disabled";
     

    





    const handleSubmit = (event) => {

      event.preventDefault();
  
  
      if (anySubmitted) {
        alert("A submission has already been made.");
        return;
      }
    
      if (!areAllIssuesSelected()) {
        alert("Please make a selection for each issue.");
        return;
      }
    
      const choices = Object.keys(points).reduce((acc, key) => {
        acc[key] = optionMappings[key][points[key]] || points[key];
        return acc;
      }, {});
    
      const submitterRoleName = player.get("role");
    
      round.set("submittedData_informal", {
        playerID: player._id,
        decisions: choices,
        submitterRole: submitterRoleName
      });

      round.set("anySubmitted", true);  // 设置轮次状态

    };

    const handleVoteSubmit = (vote) => {

      player.set("vote", vote); // 存储当前玩家的投票
      round.append("votes", { id: player._id, vote: vote }); // 将投票结果存储到轮次状态中
    };



  // 检查是否所有玩家都已投票
  const allVoted = players.every(p => p.get("vote"));

  // 获取投了 'For' 和 'Against' 的玩家名单
  const forVoters = players.filter(p => p.get("vote") === "For").map(p => p.get("role")).join(", ");
  const againstVoters = players.filter(p => p.get("vote") === "Against").map(p => p.get("role")).join(", ");

  // 当前玩家的投票结果
  const currentVote = player.get("vote");



    








    
    
  
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
                      <th>{submittedData_informal ? submittedData_informal.submitterRole : "None"}</th> {/* 使用存储的角色名 */}
            
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
                      <td>{submittedData_informal ? submittedData_informal.decisions["mix"] : "None"}</td>
              

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
                 
                    <td>{submittedData_informal ? submittedData_informal.decisions["li"] : "None"}</td>

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
                    <td>{submittedData_informal ? submittedData_informal.decisions["green"] : "None"}</td>
         
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
               
                    <td>{submittedData_informal ? submittedData_informal.decisions["height"] : "None"}</td>

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
                    <td>{submittedData_informal ? submittedData_informal.decisions["venues"] : "None"}</td>
           

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
          <Button
            type="submit" 
            className={submitButtonClassName}
            handleClick={handleSubmit} 
            disabled={anySubmitted}>
            Submit for Informal Vote
          </Button>
        </div>

          </div>
        </div>
     
   
  </form>

  <div className="voting-section">
      {round.get("anySubmitted") && !currentVote && !allVoted && (
        <div className="voting-buttons-container">
          <Button className="vote-button" handleClick={() => handleVoteSubmit("For")}>For</Button>
          <Button className="vote-button" handleClick={() => handleVoteSubmit("Against")}>Against</Button>
        </div>
      )}

      {currentVote && !allVoted && (
        <div>
          {currentVote === "For" && <div>You voted IN FAVOR of this informal proposal. Waiting for other votes.</div>}
          {currentVote === "Against" && <div>You voted AGAINST this informal proposal. Waiting for other votes.</div>}
        </div>
      )}

      {votingCompleted && (
        <div className="voting-results-container">
          <div><strong>For Voters:</strong> {forVoters}</div>
          <div><strong>Against Voters:</strong> {againstVoters}</div>
          <Button 
            className="next-button" 
            handleClick={handleNext} 
            disabled={!votingCompleted}>
            Next Informal Submit
          </Button>
        </div>
      )}
    </div>
  </div>
);

}

export default Choice;