import React, { useState } from "react";
import PredictOptimize from "./PredictOptimize";
import Visualization from "./Visualization";

const PredictOptimizeHandler = (openModal,openOptimizeModal) => {
  const [data, setData] = useState({
    conductivity: 61.38,
    elongation: 5.98,
    uts: 452.5,
  });

  const handlePredict = () => {
    // Simulate a prediction logic
    alert("Predict action triggered!");
    // Example of setting new data (simulate a prediction result)
    setData({
      conductivity: 62.5,
      elongation: 6.2,
      uts: 455.0,
    });
  };

  const handleOptimize = () => {
    // Simulate optimization logic
    alert("Optimize action triggered!");
    // Example of setting optimized data
    setData({
      conductivity: 63.0,
      elongation: 6.5,
      uts: 460.0,
    });
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <PredictOptimize openModal={openModal} onOptimize={handleOptimize} />
      <Visualization
        conductivity={data.conductivity}
        elongation={data.elongation}
        uts={data.uts}
      />
    </div>
  );
};

export default PredictOptimizeHandler;
