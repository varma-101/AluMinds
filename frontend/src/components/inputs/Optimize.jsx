import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import Parameters from "./Parameters";
import PredictOptimize from "../outputs/PredictOptimize";
import Visualization from "../outputs/Visualization";
import LineGraphs from "../charts/LineGraphs.jsx";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import "./Optimize.css";

Modal.setAppElement("#root");

export default function Optimize() {
  const [optimizeModalIsOpen, setOptimizeModalIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [optimizationError, setOptimizationError] = useState("");
  const [lastOptimizedData, setLastOptimizedData] = useState(null);
  const [fluctuations, setFluctuations] = useState([]);

  const [optimizeValidationErrors, setOptimizeValidationErrors] = useState({});
  const [inputData, setInputData] = useState({
    emulsion_temp: "",
    emulsion_pr: "",
    rod_quench_cw_exit: "",
    casting_wheel_rpm: "",
    cast_bar_entry_temp: "",
    rod_quench_cw_entry: "",
    metal_temp: "",
    cool_water_flow: "",
    rm_motor_cooling_water_pressure: "",
    cooling_water_pressure: "",
    cooling_water_temp: "",
    rolling_mill_rpm: "",
    rolling_mill_amp: "",
    si: "",
    fe: "",
  });

  const [output, setOutput] = useState({
    uts: null,
    elongation: null,
    conductivity: null,
  });

  const [optimizeData, setOptimizeData] = useState({
    uts: "",
    elongation: "",
    conductivity: "",
  });

  const optimizeRanges = {
    uts: [5, 25],
    elongation: [5, 25],
    conductivity: [50, 100],
  };

  const openOptimizeModal = () => setOptimizeModalIsOpen(true);
  const closeOptimizeModal = () => setOptimizeModalIsOpen(false);

  // Debounce function to limit API calls
  let debounceTimer;
  const debounce = (callback, delay) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, delay);
  };

  const handleOptimizeInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);

    // Validate input range
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

    setOptimizeData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Trigger the appropriate API call based on the changed field
    if (!error) {
      debounce(() => {
        if (name === "uts") {
          axios
            .post("http://127.0.0.1:5000/elongation_predict", {
              uts: numericValue,
            })
            .then((response) => {
              setOptimizeData((prevData) => ({
                ...prevData,
                elongation: response.data.elongation_prediction,
              }));
            })
            .catch((error) => {
              console.error("Error during UTS prediction:", error);
            });
        } else if (name === "elongation") {
          axios
            .post("http://127.0.0.1:5000/uts_predict", {
              elongation: numericValue,
            })
            .then((response) => {
              setOptimizeData((prevData) => ({
                ...prevData,
                uts: response.data.uts_prediction,
              }));
            })
            .catch((error) => {
              console.error("Error during elongation prediction:", error);
            });
        }
      }, 500); // Delay for debounce (in milliseconds)
    }
  };
  const calculateFluctuations = (newData, oldData) => {
    const fluctuatedParameters = [];
    Object.keys(newData).forEach((key) => {
      if (oldData[key]) {
        const oldValue = parseFloat(oldData[key]);
        const newValue = parseFloat(newData[key]);
        const fluctuation = ((newValue - oldValue) / oldValue) * 100;
        if (Math.abs(fluctuation) > 5) {
          fluctuatedParameters.push({
            parameter: key,
            oldValue: oldValue.toFixed(2),
            newValue: newValue.toFixed(2),
            fluctuation: fluctuation.toFixed(2),
          });
        }
      }
    });
    return fluctuatedParameters;
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

    axios
      .post("http://127.0.0.1:5000/reverse_predict", numericOptimizeData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;

        // Compare with last optimized data and calculate fluctuations
        if (lastOptimizedData) {
          const fluctuationResults = calculateFluctuations(
            data,
            lastOptimizedData
          );
          setFluctuations(fluctuationResults);
        }

        // Update inputData state with optimization results
        setInputData({
          ...Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key,
              parseFloat(value).toFixed(2),
            ])
          ),
        });

        setOutput({
          uts: data.uts || "N/A",
          elongation: data.elongation || "N/A",
          conductivity: data.conductivity || "N/A",
        });

        // Save the current optimized data for future comparison
        setLastOptimizedData(data);

        axios
          .post("http://localhost:5001/save", {
            type: "optimization",
            input: numericOptimizeData,
            output: data,
          })
          .catch((error) => {
            console.error("Error saving optimization:", error);
          });

        closeOptimizeModal();
      })
      .catch((error) => {
        console.error("Error during optimization:", error);
      });
  };
  return (
    <>
      <div className="main">
        <Topbar title="OPTIMIZE"/>
        <div className="main-layout">
          <Sidebar />
          <div className="other-content">
            <Parameters inputData={inputData} />
            <div className="low">
              <div className="dashboard-row">
                <button onClick={openOptimizeModal}>OPTIMIZE</button>
                <Visualization
                  conductivity={
                    optimizeData.conductivity
                      ? optimizeData.conductivity.toString().substring(0, 5)
                      : "N/A"
                  }
                  elongation={
                    optimizeData.elongation
                      ? optimizeData.elongation.toString().substring(0, 5)
                      : "N/A"
                  }
                  uts={
                    optimizeData.uts
                      ? optimizeData.uts.toString().substring(0, 5)
                      : "N/A"
                  }
                />
              </div>
              {fluctuations.length > 0 && (
                <div className="fluctuations">
                  <h3>Fluctuated Parameters</h3>
                  <ul>
                    {fluctuations
                      .filter(
                        ({ parameter }) => parameter !== "rolling_mill_amp"
                      ) // Filter out 'rolling_mill_amp'
                      .map(({ parameter, oldValue, newValue, fluctuation }) => (
                        <li key={parameter}>
                          <strong>{parameter}</strong>: Old Value = {oldValue},
                          New Value = {newValue}, Fluctuation ={" "}
                          {newValue - oldValue}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={optimizeModalIsOpen}
        onRequestClose={closeOptimizeModal}
        contentLabel="Optimize Form"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Input Data for Optimization</h2>
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
        <button onClick={handleOptimize}>OPTIMIZE</button>
      </Modal>
    </>
  );
}
