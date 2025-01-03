import React from "react";
import "./Parameters.css";

// Function to break long words
function breakLongWord(word) {
  // Replace each space with a line break
  return word.replace(/ /g, " <br />");
}

export default function Parameters({ inputData }) {
  const parameters = [
    { icon: "emulsion_temperature.png", label: "emulsion_temp", value: "25.52" },
    { icon: "metal_temperature-removebg-preview.png", label: "metal_temp", value: "650.75" },
    { icon: "emulsion pressure.png", label: "emulsion_pr", value: "0.73" },
    { icon: "cool water flow.png", label: "cool_water_flow", value: "18.45" },
    { icon: "rolling mill rpm.png", label: "rolling_mill_rpm", value: "105.42" },
    { icon: "rod quench cw exit.png", label: "rod_quench_cw_exit", value: "33.52" },
    { icon: "casting wheel rpm.png", label: "casting_wheel_rpm", value: "152.67" },
    { icon: "emulsion_temperature.png", label: "cast_bar_entry_temp", value: "421.95" },
    //{ icon: faGaugeHigh, label: "rolling_mill_amp", value: "85.22" },
    { icon: "Rm motor cooling water pressure.png", label: "rm_motor_cooling_water_pressure", value: "2.15" },
    { icon: "colling water pressure.png", label: "cooling_water_pressure", value: "1.20" },
    { icon: "cooling water temperature.png", label: "cooling_water_temp", value: "29.68" },
    { icon: "rod quench cw entry.png", label: "rod_quench_cw_entry", value: "32.41" },
  ];

  const parametersout = [
    { label: "Emulsion Temperature" },
    { label: "Metal Temperature" },
    { label: "Emulsion Pressure" },
    { label: "Cooling Water_Flow" },
    { label: "Rolling_Mill RPM" },
    { label: "Rod_Quench_Cooling Water Exit Temperature" },
    { label: "Casting Wheel RPM" },
    { label: "Cast_Bar Entry Temperature" },
   // { label: "Rolling_Mill_Current (Amperes)" },
    { label: "Rolling_Mill_Motor Cooling_Water Pressure" },
    { label: "Cooling_Water Pressure" },
    { label: "Cooling_Water Temperature" },
    { label: "Rod_Quench Cooling Water_Entry Temperature" }
  ];

  const compositions = [
    { label: "Al", color: "#2196f3", value: "1.33" },
    { label: "Si", color: "#ff5722", value: "1.33" },
    { label: "Fe", color: "#2196f3", value: "1.33" },
  ];

  // Splitting rows for layout
  const parameterRows = [
    parameters.slice(0, 4),
    parameters.slice(4, 8),
    parameters.slice(8, 12),
  ];

  const compositionRows = [
    compositions.slice(0, 1),
    compositions.slice(1, 2),
    compositions.slice(2, 3),
  ];
  let paramIndex =0;
  return (
    <div className="parameters-container">
      {/* Parameters Section */}
      <div className="parameters-card">
        {parameterRows.map((row, rowIndex) => {
           // Start from the correct index for each row
          return (
            <div className="parameters-section" key={rowIndex}>
              {row.map((param, index) => {
                // Use the incrementing paramIndex to access parametersout
                const paramLabel = parametersout[paramIndex].label;
                paramIndex++; // Increment the index for the next item in parametersout

                return (
                  <div className="parameter-card" key={index}>
                    <img src={param.icon} alt=""/>
                    <div className="val-label">
                      <div className="parameter-value">
                        {inputData[param.label] || 0}
                      </div>
                      {/* Use dangerouslySetInnerHTML to insert the <br /> */}
                      <div
                        className="parameter-label"
                        dangerouslySetInnerHTML={{
                          __html: breakLongWord(paramLabel), // Use the corresponding label from parametersout
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Compositions Section */}
      <div className="compositions-card">
        {compositionRows.map((row, rowIndex) => (
          <div className="compositions-section" key={rowIndex}>
            {row.map((comp, index) => (
              <div
                className="composition-card"
                key={index}
                style={{ borderColor: comp.color }}
              >
                <div
                  className="composition-circle"
                  style={{ backgroundColor: comp.color }}
                >
                  {comp.label}
                </div>
                <div className="composition-value">
                  {comp.label == "Al" ? "> 99%" : inputData[comp.label.toLowerCase()] || "N/A"}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}