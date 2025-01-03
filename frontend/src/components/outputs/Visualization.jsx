import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Visualization.css";

const Visualization = ({ conductivity, elongation, uts }) => {
  const percente_uts = ((uts - 9) / (10.8 - 9)) * 100;
  const percent_elgo=((elongation - 10.5) / (15.7 - 10.5)) * 100;
  return (
    
    <div className="visualization-container">
      <div className="card">
        <div className="circle">
          <CircularProgressbar
            value={conductivity}
            text={`${conductivity} IACS`}
            styles={buildStyles({
              textSize: "16px",
              textColor: "#114b43",
              pathColor: "#0ca678",
              trailColor: "#e6f7f0",
            })}
          />
          <p>CONDUCTIVITY</p>
        </div>
      </div>
      <div className="card">
        <div className="circle">
          <CircularProgressbar
            value={percent_elgo}
            text={`${elongation}%`}
            styles={buildStyles({
              textSize: "16px",
              textColor: "#114b43",
              pathColor: "#0059b3",
              trailColor: "#e7f3fc",
            })}
          />
          <p>ELONGATION</p>
        </div>
      </div>
      <div className="card">
        <div className="circle">
          <CircularProgressbar
            value={percente_uts}
            text={`${uts} MPa`}
            styles={buildStyles({
              textSize: "16px",
              textColor: "#114b43",
              pathColor: "#cc0000",
              trailColor: "#fbe6e6",
            })}
          />
          <p>UTS</p>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
