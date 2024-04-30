import { Consent } from "@empirica/core/player/react";
import React from "react";
import { Button } from "../components/Button";
import "./Introduction.css";

export function MyConsent({ next }) {

  return (
    <div className="introduction-wrapper"> 
    <div className="introduction-container">
      <h2 className="introduction-title">Consent Form</h2>
      <br />
      <p>Thank you for considering participating in our study of numerical decisions.</p>
      {/* <div className="consent-section">
        <br />
        <h3 className="section-header">Survey</h3>
        <p>In this survey, you will be asked to complete a series of estimation tasks, such as estimating the number of candies in a reference photo. You will then be asked to choose the item with the highest value, such as the photograph with the greatest number of candies.</p>
      </div>
      <div className="consent-section">
        <h3 className="section-header">Benefits</h3>
        <p>Please complete this short survey to receive the full payment associated with this study. You will be paid £3 for participating in addition to a bonus up to £3 depending on accuracy. The maximum payment is £6.00 and the minimum payment is £3.00.</p>
      </div>
      <div className="consent-section">
        <h3 className="section-header">Anonymity</h3>
        <p>Your responses are anonymous and will be used solely for research purposes. No identifying information will be collected or presented as part of this research.
        </p>
      </div>
      <div className="consent-section">
        <h3 className="section-header">Scope of Study:</h3>
        <p>The purpose of our study is to explore how people make numerical decisions.</p>
      </div>
      <div className="consent-section">
        <h3 className="section-header">Withdrawal from Study</h3>
        <p>Your participation in this study is voluntary, and you are free to withdraw at any time without any penalty. However, payment is provided only to participants who complete the study in full. If you choose to withdraw before completing the study, you will NOT be eligible for payment.</p>
      </div>
      <div className="consent-section">
        <h3 className="section-header">Possible Risks</h3>
        <p>There are no risks anticipated in this study beyond those present in routine daily life.</p>
      </div>
      <div className="consent-section">
        <h3 className="section-header">Consent</h3>
        <p>By clicking on the "Proceed" button located below, you are providing your informed consent to participate in the current research. You may withdraw at any time by closing your browser window.</p>
      </div>
      <div className="consent-section">
        <h3 className="section-header">Contact</h3>
        <p>For questions, contact the principal investigator Joshua Becker at joshua.becker@ucl.ac.uk.</p>
      </div>*/}
      <div className="centered-button-container"> 
     


        <Button handleClick={next}  >
        <p>Proceed </p>
      </Button>

      </div>
      </div>
    </div>
  );
}