
import React from "react";
import { useState, useEffect} from 'react';
import { Button } from "../components/Button";
function StrawPoll(props) {


    const { WaitingMessage = 'Waiting for other players.',
    playerRole = "role1",
    ...restProps } = props;

    //const [features, setFeatures] = useState([]);
    const features = props.featureData.features;

    //const featureUrl = props.featureUrl;


    const currentVote = props.CurrentVote
    //console.log("current vite: "+currentVote)

    var submittedData_informal  = props.submissionData;
    /*var submittedData_informal  = {
        playerID: "Demo Player",
        decisions: {"Fast Charging":999},
        submitterRole: "Demo Player"
    };*/


    const handleVoteSubmit = (vote) => {
        
        props.handleVoteSubmission(vote);
    };
     
    /*
    useEffect(() => {
        fetch(featureUrl)
            .then(response => response.json()) 
            .then(data => {
                setFeatures(data.features); 
            })
            .catch(error => console.error("Failed to load features:", error));
            
    }, []); 
    */



    const getSubmittedFeaturesAndBonuses = () => {
    
        if (!submittedData_informal) {
            return null;
        }

        const currentPlayerRole = playerRole;

        const { decisions } = submittedData_informal;


        const featuresAndBonuses = features.reduce((acc, feature) => {
            if (decisions[feature.name]) {
                    acc.push({
                        featureName: feature.name,
                        bonus: feature.bonus[currentPlayerRole] || 0
                    });
                }
            return acc;
        }, []);

        const totalBonus = featuresAndBonuses.reduce((total, { bonus }) => total + bonus, 0);

        return {
            submitterRole: submittedData_informal.submitterRole,
            featuresAndBonuses,
            totalBonus
        };
    };

    const submissionInfo = getSubmittedFeaturesAndBonuses();

    

    const proposalForVote = submittedData_informal ?
        <>
            
            <div className="second-styled-table thead th">
                <table className="styled-table"  >
                <thead>
                <tr  >
                    <td colSpan="2" style={{borderTop:'0px',borderRight:'0px',borderLeft:'0px',fontWeight:'bold'}}>
                    Informal Proposal by {submittedData_informal['submitterRole']}
                    </td>
                </tr>
                <tr  >
                    <th>Product Features</th>
                    <th>Bonus</th>
                </tr>
                </thead>
                <tbody>
                {submissionInfo && submissionInfo.featuresAndBonuses.map(({ featureName, bonus }, index) => (
                    <tr key={index}>
                    <td>{featureName}</td>
                    <td>{bonus}</td>
                    </tr>
                ))}
                <tr>
                </tr>
                </tbody>
                </table>
                {(currentVote===undefined) && (<div className="total-points-display"> Total bonus: ${submissionInfo && Math.round(submissionInfo.totalBonus*100)/100}</div>)}
            {(currentVote===undefined) && (
                <div className="voting-buttons-container">
                <Button className="vote-button" handleClick={() => handleVoteSubmit(1)}>Accept</Button>
                
                <Button className="vote-button" handleClick={() => handleVoteSubmit(0)}>Reject</Button> 
                </div>
            )}
                
        
                 
                <div className="total-points-display" style={{ color: 'red' }}>{props.message}</div>
                 
            </div>

                
        
        </>
        :
        <>
            <div className="second-styled-table thead th">
                <table className="styled-table"  >
                <thead>
                <tr>
                    <td colSpan="2" style={{borderTop:'0px',borderRight:'0px',borderLeft:'0px',fontWeight:'bold'}}>
                    &lt;No Proposal Has Been Made Yet&gt;
                    </td>
                </tr>
                <tr>
                    <th>Product Features</th>
                    <th>Bonus</th>
                </tr>
                </thead>
                <tbody>
                
                    <tr>
                    <td>-</td>
                    <td>-</td>
                    </tr>
                
                <tr>
                </tr>
                </tbody>
                </table>
            </div>
        </>
            

    return (
        <div className="table-container">
            { proposalForVote } 
        </div>
    );
}


export default StrawPoll;