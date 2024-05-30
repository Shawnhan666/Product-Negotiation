
import React from "react";
import { useState, useEffect} from 'react';
import { Button } from "../components/Button";
export function StrawPoll(props) {

    const [features, setFeatures] = useState([]);

    const featureUrl = props.featureUrl;

    const playerRole = "role1";//player.get("role");

    const [currentVote, setCurrentVote] = useState(null);

    var submittedData_informal  = props.submissionData;
    /*var submittedData_informal  = {
        playerID: "Demo Player",
        decisions: {"Fast Charging":999},
        submitterRole: "Demo Player"
    };*/


    const handleVoteSubmit = (vote) => {
        setCurrentVote(vote);
        props.handleVoteSubmission(vote);
    };
     
    useEffect(() => {
        fetch(featureUrl)
            .then(response => response.json()) 
            .then(data => {
                setFeatures(data.features); 
            })
            .catch(error => console.error("Failed to load features:", error));
            
    }, []); 



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
            <div className="table-container">
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
            <div className="total-points-display"> 
                Your bonus: ${submissionInfo && Math.round(submissionInfo.totalBonus*100)/100}</div>
            </div>
            <div className="voting-section">
                {currentVote && (
                    <div>
                        {currentVote === "For" && <div style={{ color: 'red' }}>You voted Accept of this informal proposal. Waiting for other votes.</div>}
                        {currentVote === "Against" && <div style={{ color: 'red' }}>You voted Reject of this informal proposal. Waiting for other votes.</div>}
                    </div>
                )}
            </div>
            {!currentVote && (
                <div className="voting-buttons-container">
                <Button className="vote-button" handleClick={() => handleVoteSubmit("For")}>Accept</Button>
                
                <Button className="vote-button" handleClick={() => handleVoteSubmit("Against")}>Reject</Button> 
                </div>
            )}
            </div>
            </>
        :
            ""
            

    return (
        <div className="container">
            { proposalForVote }  
        </div>
    );
}
