import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import axios from "axios";
import "./RealtimeDashboard.css";
import { FaBell } from "react-icons/fa";
import LineGraphs from "../charts/LineGraphs";

const RealtimeDashboard = () => {
  const [data, setData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [inputs, setInputs] = useState({
    uts: "",
    elongation: "",
    conductivity: "",
  });
  const [intervalValue, setIntervalValue] = useState(1000);
  const [shouldDisplayData, setShouldDisplayData] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for managing modal visibility
  const [showInputModal, setShowInputModal] = useState(false);

  const optimizeRanges = {
    uts: [5, 25],
    elongation: [5, 25],
    conductivity: [50, 100],
  };

  const metrics = [
    { icon: "emulsion_temperature.png", label: "emulsion_temp" },
    { icon: "rod quench cw exit.png", label: "metal_temp" },
    { icon: "emulsion pressure.png", label: "emulsion_pr" },
    { icon: "cool water flow.png", label: "cool_water_flow" },
    { icon: "rolling mill rpm.png", label: "rolling_mill_rpm" },
    { icon: "rod quench cw exit.png", label: "rod_quench_cw_exit" },
    { icon: "casting wheel rpm.png", label: "casting_wheel_rpm" },
    { icon: "emulsion_temperature.png", label: "cast_bar_entry_temp" },
    {
      icon: "Rm motor cooling water pressure.png",
      label: "rm_motor_cooling_water_pressure",
    },
    { icon: "colling water pressure.png", label: "cooling_water_pressure" },
    { icon: "cooling water temperature.png", label: "cooling_water_temp" },
    { icon: "rod quench cw entry.png", label: "rod_quench_cw_entry" },
  ];

  const getImageIcon = (label) => {
    const metric = metrics.find((metric) => metric.label === label);
    return metric ? metric.icon : null;
  };

  const metricLabel = "casting_wheel_rpm"; // Example label
  const imageIcon = getImageIcon(metricLabel);

  const handleRefresh = () => {
    window.location.reload(); // Refreshes the entire page
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const getPrediction = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/re-predict",
        inputs
      );
      setPrediction(response.data);
      setShouldDisplayData(true);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  useEffect(() => {
    if (!shouldDisplayData) return;

    const eventSource = new EventSource(
      `http://localhost:5001/realtime?interval=${intervalValue}`
    );
    eventSource.onmessage = (event) => {
      const incomingData = JSON.parse(event.data);
      console.log(incomingData);
      setData(incomingData);
      if (prediction) {
        comparePredictionToData(incomingData);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Error occurred:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [intervalValue, shouldDisplayData, prediction]);

  const handleSetInterval = () => {
    console.log(intervalValue); // Set a new interval dynamically
  };

  const comparePredictionToData = (incomingData) => {
    const differences = {};
    if (incomingData) {
      Object.keys(prediction).forEach((key) => {
        if (incomingData[key] !== undefined) {
          const diff = Math.abs(prediction[key] - incomingData[key]);
          const threshold = 0.05 * prediction[key];
          const highFluctuationThreshold = 0.2 * prediction[key]; // 20% threshold

          if (diff > threshold) {
            differences[key] = {
              predicted: prediction[key],
              actual: incomingData[key],
              difference: diff,
            };

            // Check if fluctuation is over 20%
            if (diff > highFluctuationThreshold) {
              playBeepSound();
            }
          }
        }
      });
    }
    setFeedback(differences);
  };

  const playBeepSound = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine'; // Sine wave beep sound
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Frequency in Hz (e.g., 440Hz = A4)
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Volume

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioCtx.close();
    }, 300); // Beep for 300ms
  };

  const handleViewAlertsClick = () => {
    setShowModal(true); // Show the modal when the button is clicked
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal when the close button is clicked
  };

  const handleInputClick = () => {
    setShowInputModal(true); // Show the modal when the button is clicked
  };

  const closeInputModal = () => {
    setShowInputModal(false); // Close the modal when the close button is clicked
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    getPrediction();
    closeInputModal(); // Call prediction function when form is submitted
  };

  return (
    <div className="main">
      <Topbar title="REALTIME DASHBOARD" />
      <div className="main-layout">
        <Sidebar />
        <div className="realtime-content">
          {/* Metrics Section */}

          <div className="metrics-section">
            <div className="metrics-card">
              <div className="metrics-grid">
                {/* Rolling Parameters */}
                <div className="metrics-group">
                  <h2>Rolling Parameters</h2>
                  <hr />
                  {["rolling_mill_rpm", "rm_motor_cooling_water_pressure"].map(
                    (metricLabel, index) => (
                      <div key={index} className="metric-card roll">
                        <img
                          src={`/${
                            metrics.find(
                              (metric) => metric.label === metricLabel
                            )?.icon
                          }`} // Load image from public folder
                          alt={metricLabel}
                          className="metric-icon"
                        />
                        <div className="metric-text">
                          <h3 className="metric-value">
                            {data && data[metricLabel] !== undefined
                              ? isNaN(Number(data[metricLabel]))
                                ? 0
                                : Number(data[metricLabel])
                              : 0}
                          </h3>
                          <p className="metric-label">{metricLabel}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Emulsion Parameters */}
                <div className="metrics-group">
                  <h2>Emulsion Parameters</h2>
                  <hr />
                  {["emulsion_temp", "emulsion_pr"].map(
                    (metricLabel, index) => (
                      <div key={index} className="metric-card">
                        <img
                          src={`/${
                            metrics.find(
                              (metric) => metric.label === metricLabel
                            )?.icon
                          }`} // Load image from public folder
                          alt={metricLabel}
                          className="metric-icon"
                        />
                        <div className="metric-text">
                          <h3 className="metric-value">
                            {data && data[metricLabel] !== undefined
                              ? isNaN(Number(data[metricLabel]))
                                ? 0
                                : Number(data[metricLabel])
                              : 0}
                          </h3>
                          <p className="metric-label">{metricLabel}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Quenching Parameters */}
                <div className="metrics-group">
                  <h2>Quenching Parameters</h2>
                  <hr />
                  {["rod_quench_cw_entry", "rod_quench_cw_exit"].map(
                    (metricLabel, index) => (
                      <div key={index} className="metric-card">
                        <img
                          src={`/${
                            metrics.find(
                              (metric) => metric.label === metricLabel
                            )?.icon
                          }`} // Load image from public folder
                          alt={metricLabel}
                          className="metric-icon"
                        />
                        <div className="metric-text">
                          <h3 className="metric-value">
                            {data && data[metricLabel] !== undefined
                              ? isNaN(Number(data[metricLabel]))
                                ? 0
                                : Number(data[metricLabel])
                              : 0}
                          </h3>
                          <p className="metric-label">{metricLabel}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Casting Parameters */}
                <div className="metrics-group">
                  <h2>Casting Parameters</h2>
                  <hr />
                  {[
                    "metal_temp",
                    "casting_wheel_rpm",
                    "cast_bar_entry_temp",
                  ].map((metricLabel, index) => (
                    <div key={index} className="metric-card">
                      <img
                        src={`/${
                          metrics.find((metric) => metric.label === metricLabel)
                            ?.icon
                        }`} // Load image from public folder
                        alt={metricLabel}
                        className="metric-icon"
                      />
                      <div className="metric-text">
                        <h3 className="metric-value">
                          {data && data[metricLabel] !== undefined
                            ? isNaN(Number(data[metricLabel]))
                              ? 0
                              : Number(data[metricLabel])
                            : 0}
                        </h3>
                        <p className="metric-label">{metricLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cooling Water Parameters */}
                <div className="metrics-group">
                  <h2>Cooling Water Parameters</h2>
                  <hr />
                  {[
                    "cooling_water_temp",
                    "cooling_water_pressure",
                    "cool_water_flow",
                  ].map((metricLabel, index) => (
                    <div key={index} className="metric-card">
                      <img
                        src={`/${
                          metrics.find((metric) => metric.label === metricLabel)
                            ?.icon
                        }`} // Load image from public folder
                        alt={metricLabel}
                        className="metric-icon"
                      />
                      <div className="metric-text">
                        <h3 className="metric-value">
                          {data && data[metricLabel] !== undefined
                            ? isNaN(Number(data[metricLabel]))
                              ? 0
                              : Number(data[metricLabel])
                            : 0}
                        </h3>
                        <p className="metric-label">{metricLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="metrics-group">
                  <div className="controler-card">
                    <div className="radio-wrapper">
                      <div className="radio-input">
                        <div className="glass">
                          <div className="glass-inner" />
                        </div>
                        <div className="selector">
                          <div className="choice">
                            <div>
                              <input
                                className="choice-circle"
                                defaultValue="one"
                                name="number-selector"
                                id="one"
                                type="radio"
                                onClick={handleInputClick}
                              />
                              <div className="ball" />
                            </div>
                            <label htmlFor="one" className="choice-name">
                              Start
                            </label>
                          </div>
                          <div className="choice">
                            <div>
                              <input
                                className="choice-circle"
                                defaultValue="two"
                                defaultChecked="true"
                                name="number-selector"
                                id="two"
                                type="radio"
                                onClick={handleRefresh}
                              />
                              <div className="ball" />
                            </div>
                            <label htmlFor="two" className="choice-name">
                              End
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="feedbackoutput-container">
            
            <div className="feedback-section">
              <h3>Feedback</h3>
              {feedback && Object.keys(feedback).length > 0 ? (
                <ul>
                  {Object.keys(feedback)
                   .filter((key) =>
                    [
                      "emulsion_temp",
                      "emulsion_pr",
                      "cooling_water_flow",
                      "rolling_mill_rpm",
                      "rod_quench_cw_exit_temp",
                      "rm_motor_cooling_water_pressure",
                      "cooling_water_temp"
                    ].includes(key)
                  )

                    .sort(
                      (a, b) => feedback[b].difference - feedback[a].difference
                    ) // Sort by descending fluctuation
                    .map((key) => (
                      <li key={key} className="error-style">
                        <strong>{key}</strong>: Fluctuated by:
                        <span className="error-value">
                          {" "}
                          {feedback[key].difference.toFixed(3)}
                        </span>{" "}
                        {/* Fluctuation value */}
                      </li>
                    ))}
                </ul>
              ) : (
                <ul>
                  <li className="error-style">
                    No significant fluctuations detected.
                  </li>
                </ul>
              )}
              <button
                className="view-alerts-btn"
                onClick={handleViewAlertsClick}
                style={{backgroundColor:"white",color:"#901b1b"}}
              >
                <FaBell />
              </button>
            </div>
            <div className="Interval">
              <h1>Set Interval Value</h1>

              {/* Input to allow user to set the interval */}
              <input
                type="number"
                value={intervalValue}
                onChange={(e) => setIntervalValue(Number(e.target.value))}
                placeholder="Set interval in ms"
              />

              {/* Button to update the interval value */}
              <button onClick={handleSetInterval}>Set Interval</button>
            </div>
          </div>
          <LineGraphs/>
        </div>
      </div>

      {/* Modal for Alerts */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Alerts</h2>
            {feedback && Object.keys(feedback).length > 0 ? (
              <ul>
                {Object.keys(feedback).map((key) => (
                  <li key={key} className="error-style">
                    <strong>{key}</strong>: Fluctuated by:
                    <span className="error-value">
                      {feedback[key].difference.toFixed(2)}{" "}
                      {/* Display fluctuation value with 2 decimal places */}
                    </span>
                    (Predicted: {feedback[key].predicted}, Actual:{" "}
                    {feedback[key].actual})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No significant fluctuations detected.</p>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {showInputModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Production Inputs</h2>
            <form className="form-grid" onSubmit={handleSubmit}>
              <input
                type="number"
                name="uts"
                placeholder="UTS"
                value={inputs.uts}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="elongation"
                placeholder="Elongation"
                value={inputs.elongation}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="conductivity"
                placeholder="Conductivity"
                value={inputs.conductivity}
                onChange={handleInputChange}
              />
              <button type="submit">Predict</button>
            </form>
            <button onClick={closeInputModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeDashboard;
