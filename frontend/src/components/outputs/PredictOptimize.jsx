import React from "react";
import "./PredictOptimize.css";

const PredictOptimize = ({ openModal, openOptimizeModal,mlFeedback }) => {
  return (
    <div className="predict-optimize-container">
      
      <div className="feedback-box">
        <h3 className="feedback-title">ML FEEDBACK</h3>
        <div className="feedback-text">
          
        {mlFeedback.split(".").map((feedback, index) => (
                <p key={index}>{feedback.trim()}.</p> // Render each feedback message on a new line
            ))}
        </div>
        <button className="predict-button" onClick={openModal}>
        PREDICT
      </button>
        <button className="optimize-button" onClick={openOptimizeModal}>
          REVERSE PREDICTION
        </button>
      </div>
    </div>
  );
};

export default PredictOptimize;
