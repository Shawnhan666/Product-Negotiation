
import React from "react";
import { useState, useEffect} from 'react';
import { Button } from "../components/Button";
function Calculator(props) {

    //const totalPoints = 100

    const { propSelectedFeatures = {}, 
    displaySubmit=true, 
    handleOptionChange = () => {},
    ...restProps } = props;

    const [totalPoints, setTotalPoints] = useState(0);

    const [features, setFeatures] = useState([]);
    const [productName, setProductName] = useState([]);


    const [selectedFeatures, setSelectedFeatures] = useState(propSelectedFeatures);

    const featureUrl = props.featureUrl;
    const playerRole = props.roleName;


    const desiredFeaturesForRole = features
    .filter(feature => feature.bonus[playerRole] > 0)
    .map(feature => feature.name)
    .join(", ");

    const localHandleOptionChange = featureName => {
        setSelectedFeatures(prev => {
            const newState = { ...prev, [featureName]: !prev[featureName] };
            handleOptionChange(newState)
            return newState;
        });
    };


    const calculateTotal = () => {
        const role = playerRole;
        const pointsReturn = features.reduce((total, feature) => {
          const isSelected = selectedFeatures[feature.name];
          const roleBonus = feature.bonus[role] || 0;
          return (total + (isSelected ? roleBonus : 0));
        }, 0);
        return(pointsReturn);
    };


     const handleSubmitProposal = (event) => {
        event.preventDefault();
        
        const choices = features.reduce((choices, feature) => {
            if (selectedFeatures[feature.name]) {
              choices[feature.name] = feature.bonus[playerRole];
            }
            return choices;
          }, {});

        
        // if nothign selected, alert and do nothing
        if (!Object.values(selectedFeatures).some(value => value === true)) {
            alert("You must propose at least one feature to include in your product.");
            return;
        }
        
        const selectedFeatureNames = Object.keys(selectedFeatures).filter(feature => selectedFeatures[feature]);
        
        
        const submission_data = {
            decisions: choices,
            submitterRole: playerRole
        };

        props.handleProposalSubmission(submission_data);
    };


    useEffect(() => {
        setTotalPoints(calculateTotal());
    }, [selectedFeatures]);  

    useEffect(() => {
        fetch(featureUrl)
            .then(response => response.json()) 
            .then(data => {
                setFeatures(data.features); 
                setProductName(data.product_name); 
            })
            .catch(error => console.error("Failed to load features:", error));
            
    }, []); 


  

    const calculatorBody = <>
        {features.map((feature, index) => {
            const isDesiredFeature = desiredFeaturesForRole.includes(feature.name);
            return (
            <tr key={index}>
                <td className={isDesiredFeature ? "selected-feature" : ""}>{feature.name}</td>
                <td>
                <input
                    type="checkbox"
                    checked={selectedFeatures[feature.name] || false}
                    onChange={() => localHandleOptionChange(feature.name)}
                />
                </td>
                <td>
                  {selectedFeatures[feature.name] ? 
                    <strong>{feature.bonus[playerRole]}</strong> 
                  : 
                    <div style={{color:"#888888"}}>{feature.bonus[playerRole]}</div>
                  }                  
                </td>
            </tr>
            );
        })}
    </>


    const renderCalculator = 
        
                <>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <td colSpan="3" style={{borderTop:'0px',borderRight:'0px',borderLeft:'0px',fontWeight:'bold'}}>
                                    Calculator (Your Bonus)
                                </td>
                            </tr>
                            <tr style={{ backgroundColor: 'lightblue' }}>
                                <th>Product Features</th>
                                <th>Include</th>
                                <th>Bonus</th>
                            </tr>
                        </thead>    
                        <tbody>
                            {calculatorBody}
                        </tbody>
                    </table>
            
                    <div className="total-points-display">
                        Total Bonus: ${Math.round(totalPoints*100)/100}
                    </div>
                    {props.displaySubmit&&(
                        <div className="button-container">
                            <button onClick={handleSubmitProposal} 
                                className="submit-button"
                            >
                                Submit for Informal Vote
                            </button>
                        </div>
                    )}
                    
                </>
            

    return (
        <div className="table-wrapper">     
            { renderCalculator }
        
            
        </div> 
    );
}

export default Calculator;