// //FormalSubmit.jsx


import React from "react";
import { usePlayer, usePlayers, useRound } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import './TableStyles.css';
import { useState, useEffect} from 'react';
import { useGame } from "@empirica/core/player/classic/react";



const features = [
  { name: "Touchscreen", bonus: { CEO: 1, Department_Head_A: -0.5, Department_Head_B: 1 } },
  { name: "Fingerprint Reader", bonus: { CEO: -0.5, Department_Head_A: 1, Department_Head_B: 1 } },
  { name: "4K Display", bonus: { CEO: 1, Department_Head_A: 1, Department_Head_B: 1 } },
  { name: "Thunderbolt 4 Ports", bonus: { CEO: -0.5, Department_Head_A: 1, Department_Head_B: -0.5 } },
  { name: "AI-Enhanced Performance", bonus: { CEO: 1, Department_Head_A: 1, Department_Head_B: 1 } },
  { name: "Ultra-Light Design", bonus: { CEO: 1, Department_Head_A: -0.5, Department_Head_B: 1 } },
  { name: "High-speed WiFi 6E", bonus: { CEO: -0.5, Department_Head_A: -0.5, Department_Head_B: -0.5 } },
  { name: "Long Battery Life", bonus: { CEO: 1, Department_Head_A: -0.5, Department_Head_B: -0.5 } },
];

export function FormalSubmit() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();

  const [hasSubmittedProposal, setHasSubmittedProposal] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [roleData, setRoleData] = useState({});
  const submitterRoleName = player.get("role");



  const submittedData_formal = round.get("submittedData_formal");
 

  useEffect(() => {
    const role = player.get("role");
    if (role in roleData) {
      setRoleData(roleData[role]);
    }
  }, [player]);

  useEffect(() => {
    setTotalPoints(calculateTotal());
  }, [selectedFeatures, player]);


 
  const handleOptionChange = featureName => {
    setSelectedFeatures(prev => ({
      ...prev,
      [featureName]: !prev[featureName]
    }));
  };

  const calculateTotal = () => {
    const role = player.get("role");
    return features.reduce((total, feature) => {
      const isSelected = selectedFeatures[feature.name];
      const roleBonus = feature.bonus[role] || 0;
      return total + (isSelected ? roleBonus : 0);
    }, 0);
  };

  const getSubmittedFeaturesAndBonuses = () => {
      // 确保 submittedData_formal 不为空
      if (!submittedData_formal) {
        return null; // 或者返回一个表示无数据的默认状态
      }
  };
  const submissionInfo = getSubmittedFeaturesAndBonuses();


  const handleSubmitProposal = (event) => {
    event.preventDefault();

    // 假设的保存选择逻辑
    const choices = Object.entries(selectedFeatures).reduce((acc, [feature, isSelected]) => {
      if (isSelected) acc[feature] = features.find(f => f.name === feature).bonus[player.get("role")];
      return acc;
    }, {});

    round.set("submittedData_formal", {
      playerID: player._id,
      decisions: choices,
      submitterRole: player.get("role")
    });
    setIsSubmitted(true); 
    round.set("isSubmitted", true);
    setHasSubmittedProposal(true);
    round.set("isVoting", true);  
    round.set("totalPoints", totalPoints); // 存储totalPoints到round


  // 检查是否是 Stellar_Cove 角色并更新提交计数和存储提交内容
  if (submitterRoleName === "CEO") {
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
//Stella stage after submmit 在提交后的状态
  // 
  if (player.get("role") === "CEO") {
    if (isSubmitted || round.get("isSubmitted")) {
    return (
      <div>
        (FormalSubmit)Other parties are still voting. Once votes are in and tallied, the results will be shown.
      </div>
    );
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


///////////////////////----------------------------
  if (player.get("role") === "CEO") {
    return (
      <div className="container">
        <div className="text-brief-wrapper">
       <div className="text-brief">
        <h6>TIME IS UP. As the CEO, you have 1 minute to offer an official proposal. You may continue chatting while waiting.</h6>
       </div>
       </div>
       <br />
      {/* 第一个表格始终显示 */}
      <div className="table-container">
      <div className="table-wrapper">
      <br />
                        <table className="styled-table-orange">
                          <thead>
                          <tr >
                              <th>Feature</th>
                              <th>Include</th>
                              <th>Bonus</th>
                            </tr>
                          </thead>
                          <tbody>
                            {features.map((feature, index) => (
                              <tr key={index}>
                                <td>{feature.name}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={!!selectedFeatures[feature.name]}
                                    onChange={() => handleOptionChange(feature.name)}
                                  />
                                </td>
                                <td>
                                  {selectedFeatures[feature.name] ? feature.bonus[player.get("role")] : 0}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                <div>Total bonus: ${totalPoints}</div>
                {!hasSubmittedProposal && (
                        <div className="button-container">
                            <button onClick={handleSubmitProposal} className={ "submit-button-orange"}>
                              Submit for Formal Vote
                            </button>
                            </div>
                                )}
                                </div>
                                  </div>
                                  );
                                  </div> 
                                  )

  } else {
    return (
      <div className="waiting-section">
        <p>Please wait while the CEO enters a proposal for you to vote on.</p>
      </div>
    );
  }
}






// export function FormalSubmit() {
//   const player = usePlayer();
//   const players = usePlayers();
//   const round = useRound();
//   const game = useGame();


//   const [hasSubmittedProposal, setHasSubmittedProposal] = useState(false);
//   const [currentVote, setCurrentVote] = useState(player.get("vote"));
//   const [selectedFeatures, setSelectedFeatures] = useState({});
//   const [totalPoints, setTotalPoints] = useState(0); 



  
//   const handleSubmitProposal = () => {
//     setHasSubmittedProposal(true);

//     round.set("submittedData_formal", {
//       playerID: player._id,
//       decisions: choices,
//       submitterRole: submitterRoleName
//     });
//   };



//   const handleOptionChange = featureName => {
//     setSelectedFeatures(prev => {
//       const newState = { ...prev, [featureName]: !prev[featureName] };
//       return newState;
//     });
//   };
  
//     const calculateTotal = () => {
//       const role = player.get("role");
//       return features.reduce((total, feature) => {
//         const isSelected = selectedFeatures[feature.name];
//         const roleBonus = feature.bonus[role] || 0;
//         return total + (isSelected ? roleBonus : 0);
//       }, 0);
//     };
  
//     const Savechoice2 = () => {
//       const role = player.get("role");
//       return features.reduce((choices, feature) => {
//         if (selectedFeatures[feature.name]) {
//           choices[feature.name] = feature.bonus[role];
//         }
//         return choices;
//       }, {});
//     };



  
//       // 处理 submittedData_formal 中的信息
//       const { decisions } = submittedData_formal;
//       const featuresAndBonuses = Object.entries(decisions).map(([featureName, bonus]) => {
//         return { featureName, bonus };
//       });
  
//       const totalBonus = featuresAndBonuses.reduce((total, { bonus }) => total + bonus, 0);
  
//       return {
//         submitterRole: submittedData_formal.submitterRole,
//         featuresAndBonuses,
//         totalBonus
//       };
//     };
//     // 使用计算得到的信息在UI中渲染
//     const submissionInfo = getSubmittedFeaturesAndBonuses();


//   // 检查是否所有玩家都已投票
//   const allVoted = players.every(p => p.get("vote"));

//   const handleVoteSubmit = (vote) => {
//     player.set("vote", vote);
//     setCurrentVote(vote);
//     // 可能还需要将投票结果保存到round或game状态中，这取决于您的具体需求
//   };

//   if (player.get("role") === "CEO") {
//     // CEO 视图
//     return (
//       <div className="proposal-section">
//       {!hasSubmittedProposal ? (
//         <div>
//           <h2>Submit Your Proposal</h2>
//           {/* 这里可以放置您的表格和提交逻辑 */}

//           <table className="styled-table">
           
//                 <thead>
//                   <tr style={{ backgroundColor: 'lightblue' }}>
//                     <th>Product Features</th>
//                     <th>Include</th>
//                     <th>Bonus</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {features.map((feature, index) => {
//                     const isSelectedForVote = round.get("selectedFeaturesForInformalVote")?.includes(feature.name);
//                     return (
//                       <tr key={index}>
//                         <td className={isSelectedForVote ? "selected-feature" : ""}>{feature.name}</td>
//                         <td>
//                           <input
//                             type="checkbox"
//                             checked={selectedFeatures[feature.name] || false}
//                             onChange={() => handleOptionChange(feature.name)}
//                           />
//                         </td>
//                         <td>{selectedFeatures[feature.name] ? feature.bonus[player.get("role")] : 0}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>

//                 {/* "Total" 部分显示在表格下方 */}
//                 <div className="total-points-display">
//                                 Total Bonus: ${totalPoints}
//                               </div>

//               <div className="button-container">
//                   <button onClick={handleSubmitProposal} className={ "submit-button"}>
//                     Submit for Formal Vote
//                   </button>
//                   </div>
//         </div>

//           {submittedData_formal && (
//             <div className="second-styled-table thead th">
//             <br />
//             <table className="styled-table"  >
//           <thead>
//           <tr  >
//           <th colSpan="2">Informal Submission Details: Submitted by {getSubmitterRoleName()}</th>
//           </tr>

//           <tr  >
//           <th>Product Features</th>
//           <th>Bonus</th>
//           </tr>
//           </thead>
//           <tbody>
//           {submissionInfo && submissionInfo.featuresAndBonuses.map(({ featureName, bonus }, index) => (
//           <tr key={index}>
//           <td>{featureName}</td>
//           <td>{bonus}</td>
//           </tr>
//           ))}
//           <tr>
//           <td style={{ fontWeight: 'bold' }}>Total Bonus</td>
//           <td>{submissionInfo && submissionInfo.totalBonus}</td>
//           </tr>
//           </tbody>
//           </table>
//           </div>
//           )}




//       ) : (
//         <p>Proposal submitted. Waiting for votes...</p>
//       )}
//     </div>
//     );
//   } else {
//     // 非 CEO 视图
//     return (
//       <div className="container">
//         <h2>Waiting Area</h2>
//         <p>Please wait while the CEO enters a proposal for you to vote on.</p>
//       </div>
//     );
//   }
// }
































// //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// export function FormalSubmit() {

//   const player = usePlayer();
//   const players = usePlayers();
//   const round = useRound();
//   const game = useGame();
//   const [roleData, setRoleData] = useState({});
//   const [points, setPoints] = useState({
//     mix: '',
//     li: '',
//     green: '',
//     height: '',
//     venues: ''
//   });
//   const [totalPoints, setTotalPoints] = useState(0); 
 
  

//   useEffect(() => {
//     const role = player.get("role");
//     if (role in rolesData) {
//       setRoleData(rolesData[role]);
//     }
//   }, [player]);

//   useEffect(() => {
//     setTotalPoints(calculateTotal()); 
//   }, [points, roleData]);

//   const handleOptionChange = (event) => {
//     const { name, value } = event.target;
//     setPoints((prevPoints) => ({
//       ...prevPoints,
//       [name]: value
//     }));
//   };

//   const calculateTotal = () => {
//     return Object.keys(points).reduce((total, key) => {
//       const pointKey = key + "_" + points[key];
//       return total + (roleData[pointKey] || 0);
//     }, 0);
//   };

//   const areAllIssuesSelected = () => {
//     return Object.values(points).every(value => value !== '');
//   };
// //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //Submit button for Stella 

//   const [isSubmitted, setIsSubmitted] = useState(false);

//     const handleSubmit2 = (event) => {
//       event.preventDefault();

//       if (!areAllIssuesSelected()) {
//         alert("Please make a selection for each issue.");
//         return;
//       }

//       const choices = Object.keys(points).reduce((acc, key) => {
//         acc[key] = optionMappings[key][points[key]] || points[key];
//         return acc;
//       }, {});
    
//       const submitterRoleName = player.get("role");
    
//       round.set("submittedData", {
//         playerID: player._id,
//         decisions: choices,
//         submitterRole: submitterRoleName
//       });
 
  
//     setIsSubmitted(true); 
//     round.set("isSubmitted", true);
  

//   // 检查是否是 Stellar_Cove 角色并更新提交计数和存储提交内容
//     if (submitterRoleName === "Stellar_Cove") {
//       const currentCount = game.get("submitCount") || 0;
//       game.set("submitCount", currentCount + 1);
//       const submissions = game.get("submissions") || [];
//       submissions.push({
//         submitter: submitterRoleName,
//         choices,
//         count: currentCount + 1
//       });
//       game.set("submissions", submissions);
//       console.log(`Submission #${currentCount + 1}:`, choices);
//     }
 
//     };
// //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //Stella stage after submmit 在提交后的状态

//   // 
//   if (player.get("role") === "Stellar_Cove") {
//       if (isSubmitted || round.get("isSubmitted")) {
//       return (
//         <div>
//           (FormalSubmit)Other parties are still voting. Once votes are in and tallied, the results will be shown.
//         </div>
//       );
//     }
// //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //Stella 选择的页面 Stella choose page
//     return (
//       <div>
//         <h6>As the representative of <strong>Stellar Cove</strong>, you need to submit a proposal for consideration. Select an option for each of the five issues using the table below.</h6>
//         <br /><br />
//         <h6>Note that you will not be able to change the options after submitting. Please select carefully!</h6>
//         <br /><br />
//         Remember that your reservation price is <strong>32</strong>.
//         <br /><br />
//         <div className="total-points">
//         </div>
//         <form onSubmit={handleSubmit2}>
//           <div className="row">
//             <div className="columnone">           
//               <div id="calculator" style={{ width: '100%' }}>
//               <table className="styled-table">
//               <thead>
//                     <tr style={{ backgroundColor: 'lightblue' }}>
//                       <th>Issues</th>
//                       <th colSpan={5}>Options</th>
//                       <th style={{ paddingRight: '60px' }}>Points</th>
//                     </tr>
//               </thead>
//                   <tbody>
//                     {/* Property Mix */}
//                     <tr>
//                       <td rowspan="2">Property mix (r:c)</td>
//                       <td>30:70</td>
//                       <td>50:50</td>
//                       <td>70:30</td>
//                       <td></td> {/* 新增加的空单元格 */}
//                       <td></td> {/* 新增加的空单元格 */}
//                       <td style={{ paddingRight: '60px' }}><output>{roleData[`mix_${points.mix}`]}</output></td>
//                     </tr>
//                     <tr>
//                       <td><input type="radio" name="mix" value="1" onChange={handleOptionChange} /></td>
//                       <td><input type="radio" name="mix" value="2" onChange={handleOptionChange} /></td>
//                       <td><input type="radio" name="mix" value="3" onChange={handleOptionChange} /></td>
//                     </tr>
//                   {/* Low-income Residential */}
//                   <tr>
//                     <td rowspan="2">Low-income residential</td>
//                     <td>6%</td>
//                     <td>9%</td>
//                     <td>12%</td>
//                     <td>15%</td>
//                     <td></td> 
//                     <td style={{ paddingRight: '60px' }}><output>{roleData[`li_${points.li}`]}</output></td>
//                   </tr>
//                   <tr>
//                     <td><input type="radio" name="li" value="1" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="li" value="2" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="li" value="3" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="li" value="4" onChange={handleOptionChange} /></td>
//                   </tr>
//                   {/* Green Space */}
//                   <tr>
//                     <td rowspan="2">Green Space</td>
//                     <td>14 acres</td>
//                     <td>16 acres</td>
//                     <td>18 acres</td>
//                     <td>20 acres</td>
//                     <td></td> 
//                     <td style={{ paddingRight: '60px' }}><output>{roleData[`green_${points.green}`]}</output></td>
//                   </tr>
//                   <tr>
//                     <td><input type="radio" name="green" value="1" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="green" value="2" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="green" value="3" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="green" value="4" onChange={handleOptionChange} /></td>
//                   </tr>
//                   {/* Max Building Height */}
//                   <tr>
//                     <td rowspan="2">Max Building Height</td>
//                     <td>400ft</td>
//                     <td>500ft</td>
//                     <td>600ft</td>
//                     <td>700ft</td>
//                     <td>800ft</td>
//                     <td style={{ paddingRight: '60px' }}><output>{roleData[`height_${points.height}`]}</output></td>
//                   </tr>
//                   <tr>
//                     <td><input type="radio" name="height" value="1" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="height" value="2" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="height" value="3" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="height" value="4" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="height" value="5" onChange={handleOptionChange} /></td>
//                   </tr>
//                   {/* Entertainment Complex */}
//                   <tr>
//                     <td rowspan="2">Entertainment Complex</td>
//                     <td>0 venues</td>
//                     <td>1 venues</td>
//                     <td>2 venues</td>
//                     <td>3 venues</td>
//                     <td>4 venues</td>
//                     <td style={{ paddingRight: '60px' }}><output>{roleData[`venues_${points.venues}`]}</output></td>
//                   </tr>
//                   <tr>
//                     <td><input type="radio" name="venues" value="1" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="venues" value="2" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="venues" value="3" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="venues" value="4" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="venues" value="5" onChange={handleOptionChange} /></td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//    {/* “Total Points”  */}
//    <div className="total-points-and-submit">
//           <div className="total-points">
//             <strong>Total Points: {totalPoints}</strong>
//           </div>
//           <Button 
//             type="submit" 
//             onClick={handleSubmit2}>
//             Submit for Vote
//           </Button> 
//         </div>
//         </div>
//         </div>
//   </form>
//   </div>
//   )
// } 
// //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //如果不是Stella的页面 the page which is not stella
//   else {
     
//     return (
//       <div>
//         (formalsubmitpage)Please wait while Stellar Cove enters a proposal for you to vote on.
//       </div>
//     );
//   }
// }
// //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// export default FormalSubmit;