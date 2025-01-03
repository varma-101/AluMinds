import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import "./DisplayData.css";

import Topbar from "../topbar/Topbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";

const DisplayData = () => {
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averages, setAverages] = useState({
    UTS: 0,
    Elongation: 0,
    Conductivity: 0,
  });

  const [filterCounts, setFilterCounts] = useState({
    WE10: 0,
    WE20: 0,
    prediction: 0,
    optimization: 0,
  });

  const fetchPredictions = async () => {
    try {
      const response = await axios.get("http://localhost:5001/display");
      const data = response.data;
      setPredictions(data);
      setFilteredPredictions(data); // Show all data initially
      updateFilterCounts(data); // Update counts after data is fetched
      calculateAverages(data.slice(0, 10)); // Calculate averages for the top 10 rows
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
      setLoading(false);
    }
  };

  const updateFilterCounts = (data) => {
    const we10Count = data.filter((p) => {
      const property = p.type === "prediction" ? p.output : p.input;
      return property?.conductivity >= 61.5;
    }).length;

    const we20Count = data.filter((p) => {
      const property = p.type === "prediction" ? p.output : p.input;
      return property?.conductivity >= 61 && property?.conductivity < 61.5;
    }).length;

    const utsCount = data.filter((p) => {
      const property = p.type === "prediction" ? p.output : p.input;
      return property?.uts !== undefined; // Check if uts exists
    }).length;

    const elongationCount = data.filter((p) => {
      const property = p.type === "prediction" ? p.output : p.input;
      return property?.elongation !== undefined; // Check if elongation exists
    }).length;

    const predictionCount = data.filter((p) => p.type === "prediction").length;
    const optimizationCount = data.filter(
      (p) => p.type === "optimization"
    ).length;

    setFilterCounts({
      WE10: we10Count,
      WE20: we20Count,
      UTS: utsCount,
      elongation: elongationCount,
      prediction: predictionCount,
      optimization: optimizationCount,
    });
  };

  const calculateAverages = (data) => {
    const top10Rows = data.slice(0, 10);
    let totalUTS = 0;
    let totalElongation = 0;
    let totalConductivity = 0;
    let rowCount = 0;

    top10Rows.forEach((row) => {
      if (row.type === "optimization") {
        totalUTS += parseFloat(row.input?.uts) || 0;
        totalElongation += parseFloat(row.input?.elongation) || 0;
        totalConductivity += parseFloat(row.input?.conductivity) || 0;
      } else if (row.type === "prediction") {
        totalUTS += row.output?.uts || 0;
        totalElongation += row.output?.elongation || 0;
        totalConductivity += row.output?.conductivity || 0;
      } else {
        totalUTS += row.output?.uts || 0;
        totalElongation += row.output?.elongation || 0;
        totalConductivity += row.output?.conductivity || 0;
      }
      rowCount++;
    });

    const avgUTS = rowCount > 0 ? totalUTS / rowCount : 0;
    const avgElongation = rowCount > 0 ? totalElongation / rowCount : 0;
    const avgConductivity = rowCount > 0 ? totalConductivity / rowCount : 0;

    setAverages({
      UTS: avgUTS.toFixed(2),
      Elongation: avgElongation.toFixed(2),
      Conductivity: avgConductivity.toFixed(2),
    });
  };

  const handleFilter = (filterType) => {
    console.log("Filter Type:", filterType);
    console.log("Predictions:", predictions);

    let filteredData = [];
    if (filterType === "all") {
      filteredData = predictions;
    } else if (filterType === "optimize") {
      filteredData = predictions.filter((p) => p.type === "optimization");
    } else if (filterType === "predict") {
      filteredData = predictions.filter((p) => p.type === "prediction");
    } else if (filterType === "WE-10") {
      filteredData = predictions.filter((p) => {
        const property = p.type === "prediction" ? p.output : p.input;
        return property?.conductivity >= 61.5;
      });
    } else if (filterType === "WE-20") {
      filteredData = predictions.filter((p) => {
        const property = p.type === "prediction" ? p.output : p.input;
        return property?.conductivity >= 61 && property?.conductivity < 61.5;
      });
    }

    console.log("Filtered Data:", filteredData);

    setFilteredPredictions(filteredData);
    calculateAverages(filteredData);
    updateFilterCounts(filteredData);
  };

  useEffect(() => {
    fetchPredictions();
  }, []);
  return (
    <div className="main">
      <Topbar title="DISPLAY DATA" />
      <div className="main-layout">
        <Sidebar />
        <div className="other-content">
          <div className="content">
            <div className="main-content">
              <div className="top-section">
                <div className="left-right">
                  <div className="left">
                    <div className="grades">
                      <div className="we-10 grade-container">
                        <div className="icon">
                          <img src="we10.png" alt="WE-10 Icon" />
                        </div>
                        <div className="count">
                          <p>{filterCounts.WE10}</p>
                        </div>
                        <button
                          className="grade-btn"
                          onClick={() => handleFilter("WE-10")}
                        >
                          WE-10
                        </button>
                      </div>
                      <div className="we-20 grade-container">
                        <div className="icon">
                          <img src="we10.png" alt="WE-20 Icon" />
                        </div>
                        <div className="count">
                          <p>{filterCounts.WE20}</p>
                        </div>
                        <button
                          className="grade-btn"
                          onClick={() => handleFilter("WE-20")}
                        >
                          WE-20
                        </button>
                      </div>
                    </div>

                    <div className="buttons">
                      <button
                        className="predict-btn"
                        onClick={() => handleFilter("predict")}
                      >
                        <span>Predict</span>
                        <i class="fa-solid fa-angles-down"></i>
                      </button>
                      <button
                        className="optimize-btn"
                        onClick={() => handleFilter("optimize")}
                      >
                        Optimize
                        <i class="fa-solid fa-angles-down"></i>
                      </button>
                    </div>
                  </div>
                  <div className="right">
                    {/* UTS Gauge */}
                    <div className="gauge-container one">
                      <GaugeChart
                        id="uts-gauge"
                        nrOfLevels={20}
                        percent={averages.UTS / 100}
                        textColor="#000"
                        arcWidth={0.2}
                        colors={["#FFC371", "#FF5F6D"]}
                        style={{ width: 150, height: 110 }}
                      />
                      <div
                        className="gauge-label"
                        style={{ paddingRight: "50px" }}
                      >
                        UTS
                      </div>
                    </div>

                    {/* Conductivity Gauge */}
                    <div className="gauge-container two">
                      <GaugeChart
                        id="conductivity-gauge"
                        nrOfLevels={20}
                        percent={averages.Conductivity / 100}
                        textColor="#000"
                        arcWidth={0.2}
                        colors={["#2575fc", "#6a11cb"]}
                        style={{ width: 150, height: 110 }}
                      />
                      <div className="gauge-label">Conductivity</div>
                    </div>

                    {/* Elongation Gauge */}
                    <div className="gauge-container three">
                      <GaugeChart
                        id="elongation-gauge"
                        nrOfLevels={20}
                        percent={averages.Elongation / 100}
                        textColor="#000"
                        arcWidth={0.2}
                        colors={["#38ef7d", "#11998e"]}
                        style={{ width: 150, height: 110 }}
                      />
                      <div className="gauge-label">Elongation</div>
                    </div>
                  </div>
                </div>
                <div className="bottom-section">
                  <h3>PREDICTIONS HISTORY</h3>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Time Stamp</th>
                            <th>Emulsion Temp</th>
                            <th>Emulsion Pressure</th>
                            <th>Rod Quench CW Exit</th>
                            <th>Casting Wheel RPM</th>
                            <th>Cast Bar Entry Temp</th>
                            <th>Rod Quench CW Entry</th>
                            <th>Metal Temp</th>
                            <th>Cool Water Flow</th>
                            <th>RM Motor Cooling Water Pressure</th>
                            <th>Cooling Water Pressure</th>
                            <th>Cooling Water Temp</th>
                            <th>Rolling Mill RPM</th>
                            <th>Rolling Mill Amp</th>
                            <th>Si</th>
                            <th>Fe</th>
                            <th>UTS</th>
                            <th>Elongation</th>
                            <th>Conductivity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPredictions.length > 0 ? (
                            filteredPredictions.map((record, index) => (
                              <tr key={index}>
                                {record.type === "optimization" ? (
                                  <>
                                    <td>
                                      {new Date(
                                        record.timestamp
                                      ).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false, // Set to true if you want AM/PM format
                                      })}
                                    </td>
                                    <td>
                                      {record.output?.emulsion_temp?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.emulsion_pr?.toFixed(2) ||
                                        "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.rod_quench_cw_exit?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.casting_wheel_rpm?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.cast_bar_entry_temp?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.rod_quench_cw_entry?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.metal_temp?.toFixed(2) ||
                                        "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.cool_water_flow?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.rm_motor_cooling_water_pressure?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.cooling_water_pressure?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.cooling_water_temp?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.rolling_mill_rpm?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.rolling_mill_amp?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.si?.toFixed(2) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.fe?.toFixed(2) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input.uts}
                                    </td>
                                    <td>
                                      {record.input.elongation}
                                    </td>
                                    <td>
                                      {record.input.conductivity}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>
                                      {new Date(
                                        record.timestamp
                                      ).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false, // Set to true if you want AM/PM format
                                      })}
                                    </td>
                                    <td>
                                      {record.input?.emulsion_temp?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.emulsion_pr?.toFixed(2) ||
                                        "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.rod_quench_cw_exit?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.casting_wheel_rpm?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.cast_bar_entry_temp?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.rod_quench_cw_entry?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.metal_temp?.toFixed(2) ||
                                        "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.cool_water_flow?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.rm_motor_cooling_water_pressure?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.cooling_water_pressure?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.cooling_water_temp?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.rolling_mill_rpm?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.rolling_mill_amp?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.si?.toFixed(2) || "N/A"}
                                    </td>
                                    <td>
                                      {record.input?.fe?.toFixed(2) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.uts?.toFixed(2) || "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.elongation?.toFixed(2) ||
                                        "N/A"}
                                    </td>
                                    <td>
                                      {record.output?.conductivity?.toFixed(
                                        2
                                      ) || "N/A"}
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="18">No data available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayData;