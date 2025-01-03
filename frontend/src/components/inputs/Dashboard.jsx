import React, { useState } from "react";
import Parameters from "./Parameters";
import PredictOptimize from "../outputs/PredictOptimize";
import Visualization from "../outputs/Visualization";
import LineGraphs from "../charts/LineGraphs.jsx";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import axios from "axios";
import Modal from "react-modal";
Modal.setAppElement("#root");
import "./Dashboard.css";
export default function Dashboard() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [optimizeModalIsOpen, setOptimizeModalIsOpen] = useState(false);
  const [refreshGraph, setRefreshGraph] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [optimizationError, setOptimizationError] = useState("");

  const [optimizeValidationErrors, setOptimizeValidationErrors] = useState({});
const [formError, setFormError] = useState("");


  const [inputData, setInputData] = useState({
     "emulsion_temp": "",
    "emulsion_pr": "",
    "rod_quench_cw_exit": "",
    "casting_wheel_rpm": "",
    "cast_bar_entry_temp": "",
    "rod_quench_cw_entry": "",
    "metal_temp": "",
    "cool_water_flow": "",
    "rm_motor_cooling_water_pressure": "",
    "cooling_water_pressure": "",
    "cooling_water_temp": "",
    "rolling_mill_rpm": "",
    "rolling_mill_amp": "",
    "si": "",
    "fe": ""
  });
  const optimizeRanges = {
    uts: [10, 20],        // Example range for UTS
    elongation: [5, 20],    // Example range for elongation
    conductivity: [50, 100], // Example range for conductivity
  };
  
  const parameterRanges = {
    emulsion_temp: [25, 110],  // Min and Max range
    emulsion_pr: [1, 7],
    rod_quench_cw_exit: [1, 18],
    casting_wheel_rpm: [1, 7],
    cast_bar_entry_temp: [210, 650],
    rod_quench_cw_entry: [1, 450],
    metal_temp: [0, 1500],
    cool_water_flow: [170, 270],
    rm_motor_cooling_water_pressure: [0.5, 10],
    cooling_water_pressure: [1, 13],
    cooling_water_temp: [15, 60],
    rolling_mill_rpm: [0, 1000],
    rolling_mill_amp: [1, 700],
    si: [0, 5],
    fe: [0, 5],
  };
  
  
  const [output, setOutput] = useState({
    uts: null,
    elongation: null,
    conductivity: null,
  });
  const [optimizeData, setOptimizeData] = useState({
    "uts": "",
    "elongation": "",
    "conductivity": ""
  });
  const [mlFeedback, setMlFeedback] = useState("");

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    const openOptimizeModal = () => setOptimizeModalIsOpen(true);
    const closeOptimizeModal = () => setOptimizeModalIsOpen(false);
 
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      const numericValue = parseFloat(value);
    
      let error = "";
      if (parameterRanges[name]) {
        const [min, max] = parameterRanges[name];
        if (numericValue < min || numericValue > max) {
          error = `Value must be between ${min} and ${max}`;
        }
      }
    
      setValidationErrors((prevState) => ({
        ...prevState,
        [name]: error,
      }));
    
      setInputData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
    
    
    const handleOptimizeInputChange = (e) => {
      const { name, value } = e.target;
      const numericValue = parseFloat(value);
    
      let error = "";
      if (optimizeRanges[name]) {
        const [min, max] = optimizeRanges[name];
        if (numericValue < min || numericValue > max) {
          error = `Value must be between ${min} and ${max}`;
        }
      }
    
      setOptimizeValidationErrors((prevState) => ({
        ...prevState,
        [name]: error,
      }));
    
      setOptimizeData((prevState) => {
        const updatedOptimizeData = {
          ...prevState,
          [name]: value,
        };
    
        setOutput((prevOutput) => ({
          ...prevOutput,
          uts: updatedOptimizeData['uts'],
          elongation: updatedOptimizeData['elongation'],
          conductivity: updatedOptimizeData['conductivity'],
        }));
    
        return updatedOptimizeData;
      });
    };
    
   

  const handlePredict = () => {
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );
  
    if (hasErrors) {
      setFormError("Cannot proceed, there are validation errors.");
      return; // Prevent prediction if there are validation errors
    }
  
    // Clear the form error if validation passes
    setFormError("");
    const numericInputData = Object.fromEntries(
      Object.entries(inputData).map(([key, value]) => [key, parseFloat(value)])
    );

    axios
      .post("http://127.0.0.1:5000/predict", numericInputData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        setOutput({
          uts: data["uts"] ,

          elongation: data["elongation"],
          conductivity: data["conductivity"],
        });
        console.log(data["uts"]);
        setMlFeedback(() => {
          let feedback = "";

          // Check elongation
          if (data["elongation"] < 4) {
            feedback += "ELONGATION IS LESS.\n";
          } else if (data["elongation"] > 15) {
            feedback += "ELONGATION IS MORE.\n";
          } else {
            feedback += "ELONGATION IS OK.\n";
          }

          // Check conductivity
          if (data["conductivity"] >= 61.5) {
            feedback += "WE-10.\n";
          } else if(data["conductivity"] > 61 && data["conductivity"] < 61.5) {
            feedback += "CONDUCTIVITY IS LESS.\n";
          }

          // Check UTS if needed
          if (data["uts"] > 25) {
            feedback += "UTS IS HIGH.\n";
          } else if (data["uts"] < 3) {
            feedback += "UTS IS LOW.\n";
          } else {
            feedback += "UTS IS WITHIN RANGE.\n";
          }

          return feedback.trim(); // Trim to remove trailing newline
        });
        setRefreshGraph((prev) => !prev);
        closeModal();
        ``;

        
            axios.post('http://localhost:5001/save', {
                type: 'prediction',
                input: numericInputData,
                output: {
                   uts: data['uts'],
                    elongation: data['elongation'],
                    conductivity: data['conductivity']
                }
                
            })
            .catch(error => {
                console.error('Error saving prediction:', error);
            });
            console.log("saved");
      })
      .catch((error) => {
        console.error("Error during prediction:", error);
      });
  };
  const handleOptimize = () => {
             
    const hasErrors = Object.values(optimizeValidationErrors).some(
      (error) => error !== ""
    );
  
    if (hasErrors) {
      setOptimizationError("Cannot proceed, there are validation errors.");
      return;
    }
  
    setOptimizationError("");


    const numericOptimizeData = Object.fromEntries(
      Object.entries(optimizeData).map(([key, value]) => [
        key,
        parseFloat(value),
      ])
    );

    if (numericOptimizeData.UTS !== undefined) {
      numericOptimizeData.UTS += 200;
    }

    axios
      .post("http://127.0.0.1:5000/reverse_predict", numericOptimizeData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;

        // Update inputData state with optimization results
        setInputData({
          "si": parseFloat(data["si"]).toFixed(2),
          "fe": parseFloat(data["fe"]).toFixed(2),
            "emulsion_temp": parseFloat(data["emulsion_temp"]).toFixed(2),
            "emulsion_pr": parseFloat(data["emulsion_pr"]).toFixed(2),
            "rod_quench_cw_exit": parseFloat(data["rod_quench_cw_exit"]).toFixed(2),
            "casting_wheel_rpm": parseFloat(data["casting_wheel_rpm"]).toFixed(2),
            "cast_bar_entry_temp": parseFloat(data["cast_bar_entry_temp"]).toFixed(2),
            "rod_quench_cw_entry": parseFloat(data["rod_quench_cw_entry"]).toFixed(2),
            "metal_temp": parseFloat(data["metal_temp"]).toFixed(2),
            "cool_water_flow": parseFloat(data["cool_water_flow"]).toFixed(2),
            "rm_motor_cooling_water_pressure": parseFloat(data["rm_motor_cooling_water_pressure"]).toFixed(2),
            "cooling_water_pressure": parseFloat(data["cooling_water_pressure"]).toFixed(2),
            "cooling_water_temp": parseFloat(data["cooling_water_temp"]).toFixed(2),
            "rolling_mill_rpm": parseFloat(data["rolling_mill_rpm"]).toFixed(2),
            "rolling_mill_amp": parseFloat(data["rolling_mill_amp"]).toFixed(2),
       
          
        });

        setMlFeedback('Optimization completed. Inputs updated.');
        setRefreshGraph((prev) => !prev);
        closeOptimizeModal();
        
            axios.post('http://localhost:5001/save', {
                type: 'optimization',
                input: numericOptimizeData,
                output: {
                  
                    "emulsion_temp": data['emulsion_temp'],  // Placeholder for Emulsion Temperature
                    "emulsion_pr": data['emulsion_pr'],    // Placeholder for Emulsion Pressure
                    "rod_quench_cw_exit": data['rod_quench_cw_exit'],  // Placeholder for Rod Quench CW Exit
                    "casting_wheel_rpm": data['casting_wheel_rpm'],    // Placeholder for Casting Wheel RPM
                    "cast_bar_entry_temp": data['cast_bar_entry_temp'],  // Placeholder for Cast Bar Entry Temperature
                    "rod_quench_cw_entry": data['rod_quench_cw_entry'],  // Placeholder for Rod Quench CW Entry
                    "metal_temp": data['metal_temp'],    // Placeholder for Metal Temperature
                    "cool_water_flow": data['cool_water_flow'],   // Placeholder for Cooling Water Flow
                    "rm_motor_cooling_water_pressure": data['rm_motor_cooling_water_pressure'], // Placeholder for RM Motor Cooling Water Pressure
                    "cooling_water_pressure": data['cooling_water_pressure'],  // Placeholder for Cooling Water Pressure
                    "cooling_water_temp": data['cooling_water_temp'],  // Placeholder for Cooling Water Temperature
                    "rolling_mill_rpm": data['rolling_mill_rpm'],     // Placeholder for Rolling Mill RPM
                    "rolling_mill_amp": data['rolling_mill_amp'],     // Placeholder for Rolling Mill Amp
                    "si": data['si'],                   // Placeholder for Si
                    "fe": data['fe'],                   // Placeholder for Fe
                    // Placeholder for Conductivity
                  
                  
                }
            })
            .catch(error => {
                console.error('Error saving optimization:', error);
            });
       
      })
      .catch((error) => {
        console.error("Error during optimization:", error);
      });
  };

  // Calculate "Others" value
  const sumOfChemicals =
    parseFloat(inputData["si"] || 0) +
    parseFloat(inputData["fe"] || 0);
  const others = (100 - sumOfChemicals).toFixed(2);

  return (
    <>
      <div className="main">
        <Topbar title="DASHBOARD"/>
        <div className="main-layout">
          <Sidebar />
          <div className="other-content">
            <Parameters inputData={inputData} />
            <div className="dashboard-row">
              <PredictOptimize
                mlFeedback={mlFeedback}
                openModal={openModal}
                openOptimizeModal={openOptimizeModal}
              />
              <Visualization
                conductivity={
                  output.conductivity
                    ? output.conductivity.toString().substring(0, 5)
                    : "N/A"
                }
                elongation={
                  output.elongation
                    ? output.elongation.toString().substring(0, 5)
                    : "N/A"
                }
                uts={output.uts ? output.uts.toString().substring(0, 5) : "N/A"}
              />
              
            </div>
            
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Predict Form"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Input Data for Prediction</h2>
        <form className="form-grid">
  {Object.keys(inputData).map((key) => (
    <div key={key} className="form-field">
      <label>
        {key}:
        <input
          type="number"
          name={key}
          value={inputData[key]}
          onChange={handleInputChange}
        />
      </label>
      {validationErrors[key] && (
        <p className="error-message">{validationErrors[key]}</p>
      )}
    </div>
  ))}
</form>
{formError && <p className="form-error">{formError}</p>}

        <button onClick={handlePredict}>PREDICT</button>
      </Modal>

      <Modal
  isOpen={optimizeModalIsOpen}
  onRequestClose={closeOptimizeModal}
  contentLabel="Optimize Form"
  className="modal"
  overlayClassName="modal-overlay"
>
  <h2>Input Data for Reverse Prediction</h2>
  <form className="form-grid">
    {Object.keys(optimizeData).map((key) => (
      <div key={key} className="form-field">
        <label>
          {key}:
          <input
            type="number"
            name={key}
            value={optimizeData[key]}
            onChange={handleOptimizeInputChange}
          />
        </label>
        {optimizeValidationErrors[key] && (
          <p className="error-message">{optimizeValidationErrors[key]}</p>
        )}
      </div>
    ))}
  </form>
  {optimizationError && <p className="form-error">{optimizationError}</p>}

  <button onClick={handleOptimize}>Reverse Prediction</button>
</Modal>

    </>
  );
}