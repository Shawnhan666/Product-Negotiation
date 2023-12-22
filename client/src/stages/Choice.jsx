import { usePlayer, useRound  } from "@empirica/core/player/classic/react";// 访问玩家对象
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
    
    const [submittedPlayer, setSubmittedPlayer] = useState(null);
    
  
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


    const handleSubmit = (event) => {
      event.preventDefault();
      
      // 检查是否所有 Issues 都被选中
      if (!areAllIssuesSelected()) {
        alert("Please make a selection for each issue.");
        return;
      }
    
      if (isSubmitted) {
        return;
      }
    
      const totalPoints = calculateTotal();
      console.log("Submitting: ", { ...points, totalPoints });
    
      
      // 转换 points 中的每个值为对应的文本描述
      const choices = Object.keys(points).reduce((acc, key) => {
        acc[key] = optionMappings[key][points[key]] || points[key];
        return acc;
      }, {});
    
      setIsSubmitted(true);
      setSubmittedPlayer({
        name: player.get("role"),
        choices: choices
      });
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
                      <th colSpan={7}></th> {/* 空白单元格，跨越到 "None" 列的位置 */}
                      <th style={{ textAlign: 'center', fontSize: 'inherit' }}>Informal Proposals:</th>
                    </tr>
                    
                    <tr style={{ backgroundColor: 'lightblue' }}>
                    <th>Issues</th>
                    <th colSpan={5}>Options</th>
                    <th style={{ paddingRight: '60px' }}>Points</th> 
                    <th>{isSubmitted ? submittedPlayer.name : "None"}</th> {/* 显示提交玩家的名字或 "None" */}
                  </tr>
                </thead>

                  <tbody>

                    {/* <tr>
                      <th>Issues</th>
                      <th colSpan={5}>Options</th>
                      <th>Points</th>
                    </tr> */}

                    {/* Property Mix */}
                    <tr>
                      <td rowspan="2">Property mix (r:c)</td>
                      <td>30:70</td>
                      <td>50:50</td>
                      <td>70:30</td>

                      <td></td> {/* 新增加的空单元格 */}
                      <td></td> {/* 新增加的空单元格 */}
                      <td style={{ paddingRight: '60px' }}><output>{roleData[`mix_${points.mix}`]}</output></td>
                      <td>{isSubmitted ? submittedPlayer.choices.mix : ""}</td>

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
                    <td>{isSubmitted ? submittedPlayer.choices.li : ""}</td> {/* 在每一行的末尾添加玩家的选择 */}
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
                    <td>{isSubmitted ? submittedPlayer.choices.green : ""}</td> {/* 在每一行的末尾添加玩家的选择 */}
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
                    <td>{isSubmitted ? submittedPlayer.choices.height : ""}</td> {/* 在每一行的末尾添加玩家的选择 */}
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
                    <td>{isSubmitted ? submittedPlayer.choices.venues : ""}</td> {/* 在每一行的末尾添加玩家的选择 */}

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

  




// export function Choice() {
//     const player = usePlayer();
//     const [roleData, setRoleData] = useState({});
  
//     useEffect(() => {
//       const role = player.get("role");
//       if (role in rolesData) {
//         setRoleData(rolesData[role]);
//         console.log("Role Data:", rolesData[role]);
        
//       }
//     }, [player]);
  
//     const handleSubmit = () => {
//       console.log("Submitting:", roleData);
//       // TODOOOOOOOOOOOOOOOOOOOOOOOOOOOo: 实现提交逻辑，例如，将数据发送到服务器或进行下一步处理
//     };
  
//     // 更新选项的处理函数
//     const handleOptionChange = (event) => {
//       const { name, value } = event.target;
//       setRoleData((prevData) => ({
//         ...prevData,
//         [name]: value
//       }));
//     };






//   return (
//     <div>
//       <h6>Once the countdown is complete, Stellar Cove will have 3 minutes to submit a formal proposal.</h6>
//       <strong>Use this calculator to understand your interests in this negotiation.</strong>
//       <br/><br/>As the representative for <strong>{player.get("role")}</strong>, your reservation price is <strong>{roleData.my_rp}</strong>.
//       <br/><br/>

//       <div className="row">
//         <div className="columnone">
//           <div id="calculator">
//             <form onSubmit={handleSubmit}>
//               <table className="points">
//                 <tbody>
//                   {/* 表格标题行 */}
//                   <tr>
//                     <th>Issues</th>
//                     <th colSpan={5}>Options</th>
//                     <th>Points</th>
//                   </tr>

//                   {/* Property Mix */}
//                   <tr>
//                     <td rowspan="2">Property mix (r:c)</td>
//                     <td>30:70</td>
//                     <td>50:50</td>
//                     <td>70:30</td>
//                     <td rowspan="2"></td>
//                     <td rowspan="2"></td>
//                     <td rowspan="2"><output id="mix_output">{rolesData.mix}</output></td>
//                   </tr>
//                   <tr>
//                     <td><input type="radio" name="mix" value="30:70" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="mix" value="50:50" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="mix" value="70:30" onChange={handleOptionChange} /></td>
//                   </tr>
//                   {/* Low-income Residential */}
//                   <tr>
//                     <td rowspan="2">Low-income residential</td>
//                     <td>6%</td>
//                     <td>9%</td>
//                     <td>12%</td>
//                     <td>15%</td>
//                     <td rowspan="2"></td>
//                     <td rowspan="2"><output id="li_output">{rolesData.li}</output></td>
//                   </tr>
//                   <tr>
//                     <td><input type="radio" name="li" value="6" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="li" value="9" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="li" value="12" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="li" value="15" onChange={handleOptionChange} /></td>
//                   </tr>

//                   {/* Green Space */}
//                   <tr>
//                     <td rowspan="2">Green Space</td>
//                     <td>14 acres</td>
//                     <td>16 acres</td>
//                     <td>18 acres</td>
//                     <td>20 acres</td>
//                     <td rowspan="2"></td>
//                     <td rowspan="2"><output id="green_output">{rolesData.green}</output></td>
//                   </tr>
//                   <tr>
//                     <td><input type="radio" name="green" value="14" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="green" value="16" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="green" value="18" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="green" value="20" onChange={handleOptionChange} /></td>
//                   </tr>

//                   {/* Max Building Height */}
//                   <tr>
//                     <td rowspan="2">Max Building Height</td>
//                     <td>400ft</td>
//                     <td>500ft</td>
//                     <td>600ft</td>
//                     <td>700ft</td>
//                     <td>800ft</td>
//                     <td rowspan="2"><output id="height_output">{rolesData.height}</output></td>
//                   </tr>
//                   <tr>
//                     <td><input type="radio" name="height" value="400" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="height" value="500" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="height" value="600" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="height" value="700" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="height" value="800" onChange={handleOptionChange} /></td>
//                   </tr>

//                   {/* Entertainment Complex */}
//                   <tr>
//                     <td rowspan="2">Entertainment Complex</td>
//                     <td>0 venues</td>
//                     <td>1 venue</td>
//                     <td>2 venues</td>
//                     <td>3 venues</td>
//                     <td>4 venues</td>
//                     <td rowspan="2"><output id="venues_output">{rolesData.venues}</output></td>
//                   </tr>
//                   <tr>
//                     <td><input type="radio" name="venues" value="0" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="venues" value="1" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="venues" value="2" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="venues" value="3" onChange={handleOptionChange} /></td>
//                     <td><input type="radio" name="venues" value="4" onChange={handleOptionChange} /></td>
//                   </tr>
//                 </tbody>
//               </table>
//               <button type="submit">Submit</button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Choice;



// //--------------------————----————————————————————————————————————————————————————————————————————————————


















//   const [myName] = useState("Your Name");
//   const [myRp] = useState("Your RP");

//   const [mix, setMix] = useState('');
//   const [li, setLi] = useState('');
//   const [green, setGreen] = useState('');
//   const [height, setHeight] = useState('');
//   const [venues, setVenues] = useState('');
//   const [funds, setFunds] = useState('');
//   const [totalPoints, setTotalPoints] = useState('-');

//   const calculateTotalPoints = () => {
//     // TODO: 根据实际逻辑计算总分
//     // 示例: setTotalPoints(...);
//   };

//   const handleChange = (setter) => (event) => {
//     setter(event.target.value);
//     calculateTotalPoints();
//   };





//   return (
//     <div>
//       <h6>Once the countdown is complete, Stellar Cove will have 3 minutes to submit a formal proposal.</h6>
//       <strong>Use this calculator to understand your interests in this negotiation.</strong>
//       <br/><br/>As the representative for <strong>{myName}</strong>, your reservation price is <strong>{myRp}</strong>.
//       <br/><br/>

//       <div className="row">
//         <div className="columnone">
//           <div id="calculator">
//             <table className="points">
//               <tbody>
//                 {/* 表格标题行 */}
//               <tr>
//                 <th>Issues</th>
//                 <th colSpan={5}>Options</th>
//                 <th>Points</th>
//               </tr>

                
//                 {/* Property Mix */}
//                 <tr>
//                   <td rowspan="2">Property mix (r:c)</td>
//                   <td>30:70</td>
//                   <td>50:50</td>
//                   <td>70:30</td>
//                   <td rowspan="2"></td>
//                   <td rowspan="2"></td>
//                   <td rowspan="2"><output id="mix_output">{mix}</output></td>
//                 </tr>
//                 <tr>
//                   <td><input type="radio" name="mix" value="30:70" onChange={handleChange(setMix)} /></td>
//                   <td><input type="radio" name="mix" value="50:50" onChange={handleChange(setMix)} /></td>
//                   <td><input type="radio" name="mix" value="70:30" onChange={handleChange(setMix)} /></td>
//                 </tr>

//                 {/* Low-income Residential */}
//                 <tr>
//                   <td rowspan="2">Low-income residential</td>
//                   <td>6%</td>
//                   <td>9%</td>
//                   <td>12%</td>
//                   <td>15%</td>
//                   <td rowspan="2"></td>
//                   <td rowspan="2"><output id="li_output">{li}</output></td>
//                 </tr>
//                 <tr>
//                   <td><input type="radio" name="li" value="6" onChange={handleChange(setLi)} /></td>
//                   <td><input type="radio" name="li" value="9" onChange={handleChange(setLi)} /></td>
//                   <td><input type="radio" name="li" value="12" onChange={handleChange(setLi)} /></td>
//                   <td><input type="radio" name="li" value="15" onChange={handleChange(setLi)} /></td>
//                 </tr>

//                 {/* Green Space */}
//                 <tr>
//                   <td rowspan="2">Green Space</td>
//                   <td>14 acres</td>
//                   <td>16 acres</td>
//                   <td>18 acres</td>
//                   <td>20 acres</td>
//                   <td rowspan="2"></td>
//                   <td rowspan="2"><output id="green_output">{green}</output></td>
//                 </tr>
//                 <tr>
//                   <td><input type="radio" name="green" value="14" onChange={handleChange(setGreen)} /></td>
//                   <td><input type="radio" name="green" value="16" onChange={handleChange(setGreen)} /></td>
//                   <td><input type="radio" name="green" value="18" onChange={handleChange(setGreen)} /></td>
//                   <td><input type="radio" name="green" value="20" onChange={handleChange(setGreen)} /></td>
//                 </tr>

//                 {/* Max Building Height */}
//                 <tr>
//                   <td rowspan="2">Max Building Height</td>
//                   <td>400ft</td>
//                   <td>500ft</td>
//                   <td>600ft</td>
//                   <td>700ft</td>
//                   <td>800ft</td>
//                   <td rowspan="2"><output id="height_output">{height}</output></td>
//                 </tr>
//                 <tr>
//                   <td><input type="radio" name="height" value="400" onChange={handleChange(setHeight)} /></td>
//                   <td><input type="radio" name="height" value="500" onChange={handleChange(setHeight)} /></td>
//                   <td><input type="radio" name="height" value="600" onChange={handleChange(setHeight)} /></td>
//                   <td><input type="radio" name="height" value="700" onChange={handleChange(setHeight)} /></td>
//                   <td><input type="radio" name="height" value="800" onChange={handleChange(setHeight)} /></td>
//                 </tr>

//                 {/* Entertainment Complex */}
//                 <tr>
//                   <td rowspan="2">Entertainment Complex</td>
//                   <td>0 venues</td>
//                   <td>1 venue</td>
//                   <td>2 venues</td>
//                   <td>3 venues</td>
//                   <td>4 venues</td>
//                   <td rowspan="2"><output id="venues_output">{venues}</output></td>
//                 </tr>
//                 <tr>
//                   <td><input type="radio" name="venues" value="0" onChange={handleChange(setVenues)} /></td>
//                   <td><input type="radio" name="venues" value="1" onChange={handleChange(setVenues)} /></td>
//                   <td><input type="radio" name="venues" value="2" onChange={handleChange(setVenues)} /></td>
//                   <td><input type="radio" name="venues" value="3" onChange={handleChange(setVenues)} /></td>
//                   <td><input type="radio" name="venues" value="4" onChange={handleChange(setVenues)} /></td>
//                 </tr>

//                 {/* IIF Funds */}
//                 {/* <tr>
//                   <td rowspan="2">IIF Funds</td>
//                   <td>$250 million</td>
//                   <td>$500 million</td>
//                   <td>$750 million</td>
//                   <td>$1000 million</td>
//                   <td rowspan="2"></td>
//                   <td rowspan="2"><output id="funds_output">{funds}</output></td>
//                 </tr>
//                 <tr>
//                   <td><input type="radio" name="funds" value="250" onChange={handleChange(setFunds)} /></td>
//                   <td><input type="radio" name="funds" value="500" onChange={handleChange(setFunds)} /></td>
//                   <td><input type="radio" name="funds" value="750" onChange={handleChange(setFunds)} /></td>
//                   <td><input type="radio" name="funds" value="1000" onChange={handleChange(setFunds)} /></td>
//                 </tr> */}
//               </tbody>
//             </table>

//             {/* Total Points Table */}
//             <table className="totalpoints">
//               <tbody>
//                 <tr>
//                   <td colSpan="6" style={{ textAlign: 'right' }}>Total Points:</td>
//                   <td style={{ textAlign: 'center' }}>
//                     <span id="total">{totalPoints}</span>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td colSpan="6" style={{ textAlign: 'center' }}>
//                     <button type="button" id="submit_prop" onClick={handleSubmit} style={{ textAlign: 'center' }}>
//                       Submit for Informal vote
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       {/* 提交按钮 */}
//       <Button handleClick={handleSubmit}>Submit</Button>

//         {/* 可以根据需要添加其他列和元素 */}
//       </div>
//     </div>
//   );
// }

// export default Choice;



// export function Choice() {
//     const player = usePlayer(); // 调用hook，访问玩家对象
    
//     function onClick (choice) {
//         player.round.set("decision", choice); //调用empirica的.set函数("key", value) function for this object，可以实现将click的值保存到player.round对象中
//         player.stage.set("submit", true); // *** 重要！！！告诉Empirica player已经准备进入下一个stage，只需要后面跟一个这个.set("submit", true)
//       };

//   // 假设 my_name 和 my_rp 是从某处获取的数据
//   const [myName] = useState("Your Name");
//   const [myRp] = useState("Your RP");

//   // 表单元素的状态
//   const [mixOutput, setMixOutput] = useState('');
//   const [liOutput, setLiOutput] = useState('');
//   const [greenOutput, setGreenOutput] = useState('');
//   const [heightOutput, setHeightOutput] = useState('');
//   const [venuesOutput, setVenuesOutput] = useState('');
//   const [fundsOutput, setFundsOutput] = useState('');

//   // 表单处理函数
//   // 注意：这里仅提供了部分处理函数的实现
//   const handleMixChange = (value) => setMixOutput(value);
//   const handleLiChange = (value) => setLiOutput(value);
//   const handleGreenChange = (value) => setGreenOutput(value);
//   const handleHeightChange = (value) => setHeightOutput(value);
//   const handleVenuesChange = (value) => setVenuesOutput(value);
//   const handleFundsChange = (value) => setFundsOutput(value);

//   // ... 其他处理函数 ...

//   return (
//     <div>
//       <h6>Once the countdown is complete, Stellar Cove will have 3 minutes to submit a formal proposal.</h6>
//       <strong>Use this calculator to understand your interests in this negotiation.</strong>
//       <br/><br/>As the representative for <strong>{myName}</strong>, your reservation price is <strong>{myRp}</strong>.
//       <br/><br/>

//       <div className="row">
//         <div className="columnone">
//           <div id="calculator">
//             <table className="points">
//               <tbody>
//                 <tr>
//                   <td rowspan="2">Property mix (r:c)</td>
//                   <td>30:70</td>
//                   <td>50:50</td>
//                   <td>70:30</td>
//                   <td rowspan="2"></td>
//                   <td rowspan="2"></td>
//                   <td rowspan="2"><output id="mix_output">{mixOutput}</output></td>
//                 </tr>
//                 <tr>
//                   <td><input type="radio" name="mix" value="30:70" onChange={() => handleMixChange('30:70')} /></td>
//                   <td><input type="radio" name="mix" value="50:50" onChange={() => handleMixChange('50:50')} /></td>
//                   <td><input type="radio" name="mix" value="70:30" onChange={() => handleMixChange('70:30')} /></td>
//                 </tr>

//                 {/* Low-income Residential */}
//                 <tr>
//                   <td rowspan="2">Low-income residential</td>
//                   <td>6%</td>
//                   <td>9%</td>
//                   <td>12%</td>
//                   <td>15%</td>
//                   <td rowspan="2"></td>
//                   <td rowspan="2"><output id="li_output">{liOutput}</output></td>
//                 </tr>
//                 <tr>
//                   <td><input type="radio" name="li" value="6" onChange={() => handleLiChange('6%')} /></td>
//                   <td><input type="radio" name="li" value="9" onChange={() => handleLiChange('9%')} /></td>
//                   <td><input type="radio" name="li" value="12" onChange={() => handleLiChange('12%')} /></td>
//                   <td><input type="radio" name="li" value="15" onChange={() => handleLiChange('15%')} /></td>
//                 </tr>

//                 {/* ... 其他行和列 ... */}
//               </tbody>
//             </table>
//             {/* ... 其他内容 ... */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







//   function onClick (choice) {
//     player.round.set("decision", choice); //调用empirica的.set函数("key", value) function for this object，可以实现将click的值保存到player.round对象中
//     player.stage.set("submit", true); // *** 重要！！！告诉Empirica player已经准备进入下一个stage，只需要后面跟一个这个.set("submit", true)
//     };









// // 原始的
// export function Choice() {
//     const player = usePlayer(); // 调用hook，访问玩家对象
    
//     function onClick (choice) {
//         player.round.set("decision", choice); //调用empirica的.set函数("key", value) function for this object，可以实现将click的值保存到player.round对象中
//         player.stage.set("submit", true); // *** 重要！！！告诉Empirica player已经准备进入下一个stage，只需要后面跟一个这个.set("submit", true)
//       };

//     return             <div className="flex justify-center">
//         <Button className="m-5" handleClick={() => onClick("silent")}>🤐 Keep silent</Button>
//         <Button className="m-5" handleClick={() => onClick("testify")}>📣 Testify</Button>
//                </div>;

// //handleClick={() => onClick("silent")}，arrow function定义了当按钮被点击时，后面的函数被调用，（是空的表明没有参数）

// //这里可以看一下button的参数，看一下怎么设置直接下一步（handleclick）
// //这里的保存点击和otree无关，他是要保存点击的选项
// }