import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import "./Guide.css";

export default function Guide() {
  // State to manage visibility of each button
  const [activeSection, setActiveSection] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  // Function to toggle visibility: only one section is visible at a time
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="main">
  <Topbar title = "USERGUIDE"/>
  <div className="main-layout">
    <Sidebar />
    <div className="wrap">
    <div className="other">
        {/* Dashboard */}
        <div className="dashboard">
                <div className="icon">
                  <div className="icon-wrap">
                    <i
                      className="fa-solid fa-house-chimney"
                      style={{ paddingTop: "10px" }}
                    ></i>
                  </div>
                </div>
                <div className="heading">Dashboard</div>
                <div className="btn">
                  <button onClick={() => handleTabClick("dashboard")}>
                    View More
                  </button>
                </div>
              </div>


        {/* Realtime Dashboard */}
        <div className="realtime">
          <div className="icon">
            <div className="icon-wrap">
            <i class="fa-solid fa-chart-line" style={{ paddingTop: "10px" }}></i>
            </div>
          </div>
          <div className="heading">Realtime Dashboard</div>
          <div className="btn">
            <button onClick={() => handleTabClick("realtime")}>
              View More
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="display">
          <div className="icon">
            <div className="icon-wrap">
            <i class="fa-solid fa-database" style={{ paddingTop: "10px" }}></i>
            </div>
          </div>
          <div className="heading">Display</div>
          <div className="btn">
            <button onClick={() => handleTabClick("display")}>
              View More
            </button>
          </div>
        </div>
      </div>
     
      {/* Render details based on activeTab */}
      {activeTab === "dashboard" && (
              <div className="details">
                <div className="dashboard-detail">
                  <div className="main-box">
                    <h3>About Dashboard</h3>
                    The dashboard is a dynamic tool combining real-time input
                    parameters, a chemical composition tracker, and an
                    intelligent ML feedback system for grade prediction and
                    optimization. It showcases output metrics like conductivity,
                    elongation, and UTS, while the analytics section brings the
                    process to life with insightful graphs linking parameters to
                    performance, driving smarter decision-making.
                  </div>
                  <div className="btns">
                    <button onClick={() => handleSectionClick("input")}>
                      Input Parameters
                    </button>
                    <button onClick={() => handleSectionClick("chemical")}>
                      Chemical Composition
                    </button>
                    <button onClick={() => handleSectionClick("mlFeedback")}>
                      ML Feedback Section
                    </button>
                    <button onClick={() => handleSectionClick("output")}>
                      Output
                    </button>
                  </div>
                </div>
                <div className="subs">
                  {activeSection === "input" && (
                    <div className="sub">
                      <h3>About Input parametrs Section</h3>The input parameters
                      bring the process to life, including emulsion and metal
                      temperatures, casting wheel RPM, rolling mill dynamics,
                      cooling water flow, and quenching temperatures. Each plays
                      a critical role in shaping efficiency and delivering
                      top-notch product quality.
                      
                    </div>
                  )}
                  {activeSection === "chemical" && (
                    <div className="sub">
                      <h3>About Chemical Composition Section</h3>The chemical
                      composition section shows Aluminum (99.69%), with trace
                      amounts of Silicon (0.07%) and Iron (0.22%), ensuring the
                      desired strength, conductivity, and processability of the
                      wire rod.
                      
                    </div>
                  )}
                  {activeSection === "mlFeedback" && (
                    <div className="sub">
                      <h3>About ML Feedback Section</h3>The ML Feedback section
                      is the intelligence hub of the dashboard, providing
                      insights into key material properties like Conductivity,
                      Elongation, and UTS based on real-time data. It predicts
                      outcomes, evaluates the current product grade, and offers
                      optimization suggestions to improve quality. With
                      interactive gauges and trend graphs, it helps visualize
                      the relationship between process parameters and material
                      properties, enabling informed decision-making for enhanced
                      productivity and quality control.
                      
                    </div>
                  )}
                  {activeSection === "output" && (
                    <div className="sub">
                      <h3>About Output Scetion</h3>The Output Section uses donut
                      charts to present key parameters for easy interpretation.
                      The chart for Conductivity is highlighted in green,
                      providing a clear visual representation of the wire rod's
                      electrical conductivity. The Elongation chart, in blue,
                      reflects the rod’s ability to stretch before breaking,
                      showcasing its flexibility. Meanwhile, the UTS (Ultimate
                      Tensile Strength) is shown in red, illustrating the rod's
                      strength and ability to withstand stress. These donut
                      charts are designed to offer a quick and intuitive
                      overview of the material’s quality, making it easier for
                      users to assess performance at a glance.
                      
                    </div>
                  )}
                  
                </div>
              </div>
            )}
      {activeTab === "realtime" && (
              <div className="details">
                <div className="realtime-detail">
                  <div className="main-box">
                    <h3>About Realtime Dashboard</h3>
                    The RealTime Dashboard is like the heartbeat monitor of the
                    aluminum wire rod production process. It pulls live data
                    from the SQL server, offering a pulse on key parameters like
                    emulsion temperature, metal temperature, and cooling water
                    flow. As these metrics fluctuate in real-time, it gives
                    operators a bird’s-eye view of the process, enabling them to
                    fine-tune the production flow for maximum precision and
                    quality. It's the perfect tool to stay ahead of the curve,
                    ensuring everything runs smoothly!
                  </div>
                  <div className="btns">
                    <button onClick={() => handleSectionClick("casting")}>
                      Casting Parameters
                    </button>
                    <button onClick={() => handleSectionClick("rolling")}>
                      Rolling Parameters
                    </button>
                    <button onClick={() => handleSectionClick("cooling")}>
                      Cooling Water Parameters
                    </button>
                    <button onClick={() => handleSectionClick("emulsion")}>
                      Emulsion Parameters
                    </button>
                    <button onClick={() => handleSectionClick("quenching")}>
                      Quenching Parameters
                    </button>
                    <button onClick={() => handleSectionClick("feedback")}>
                      Feedback
                    </button>
                  </div>
                </div>
                <div className="subs">
                  {activeSection === "casting" && (
                    <div className="sub">
                      <h3>About Casting Parameters</h3>
                      The Casting parameters are essential in determining the
                      quality and consistency of aluminum wire rods. Key among
                      these is the cast bar entry temperature, which ensures
                      that the aluminum is at the right temperature when it
                      enters the casting process. This is closely linked with
                      metal temperature, which influences the fluidity and
                      solidification of the material. Another critical parameter
                      is the cast wheel RPM, which controls the speed at which
                      the cast wheel rotates, directly impacting the cooling
                      rate and solidification process of the cast bar. The
                      proper RPM ensures that the aluminum is cooled uniformly,
                      preventing defects like cracks or uneven thickness. By
                      carefully managing these parameters, manufacturers can
                      optimize the casting process, resulting in high-quality
                      aluminum wire rods with optimal strength, elongation, and
                      conductivity.
                    
                    </div>
                  )}
                  {activeSection === "rolling" && (
                    <div className="sub">
                      <h3>About Rolling Parameters</h3>
                      The Rolling parameters are vital in controlling the
                      shaping and properties of aluminum wire rods during the
                      rolling process. One of the key factors is the rolling
                      mill RPM, which dictates the speed at which the rod is
                      passed through the mill, affecting its thickness and
                      quality. The rolling mill amperage measures the electrical
                      current used by the rolling mill, indicating the load on
                      the system and helping monitor its efficiency.
                      Additionally, the rm motor cooling water pressure is
                      crucial to prevent overheating of the rolling mill's
                      motor. Proper control of this pressure ensures the motor
                      operates smoothly and efficiently, avoiding potential
                      damage. By fine-tuning these parameters, manufacturers can
                      ensure consistent production of high-quality aluminum wire
                      rods with the desired characteristics.
                      
                    </div>
                  )}
                  {activeSection === "cooling" && (
                    <div className="sub">
                      <h3>About Cooling water Parameters</h3>
                      The Cooling water parameters are essential in controlling
                      the temperature during the aluminum rod production
                      process. The cooling water pressure ensures that the water
                      flows efficiently through the system, helping maintain a
                      consistent heat transfer rate. The cooling water
                      temperature plays a crucial role in controlling the
                      cooling speed of the aluminum, preventing defects like
                      cracks or inconsistent solidification. Meanwhile, the cool
                      water flow rate determines how effectively heat is carried
                      away from the rod, ensuring uniform cooling. Proper
                      monitoring and adjustment of these parameters are key to
                      producing high-quality aluminum wire rods with stable and
                      reliable properties.
                      
                    </div>
                  )}
                  {activeSection === "emulsion" && (
                    <div className="sub">
                      <h3>About Emulsion Parameters</h3>
                      The Emulsion parameters are vital for maintaining the
                      quality and consistency of the aluminum wire rod
                      production process. Emulsion temperature plays a crucial
                      role in controlling the lubrication between the rolling
                      mill and the rod, ensuring smooth operation and preventing
                      damage to the wire surface. The emulsion pressure, on the
                      other hand, helps regulate the flow and distribution of
                      the emulsion, ensuring optimal lubrication and cooling
                      throughout the process. These parameters must be carefully
                      monitored to ensure efficient rolling, reduce friction,
                      and maintain the integrity of the aluminum wire rods.
                      
                    </div>
                  )}
                  {activeSection === "quenching" && (
                    <div className="sub">
                      <h3>About Quenching Parameters</h3>
                      The Quenching parameters are essential for controlling the
                      cooling process of the aluminum wire rod, which directly
                      affects its final properties. The rod quench cooling water
                      entry and rod quench cooling water exit temperatures are
                      crucial in managing the cooling rate of the wire rod. By
                      regulating the temperature of the cooling water at both
                      entry and exit points, the cooling process can be
                      optimized to achieve the desired mechanical properties,
                      such as strength and elongation. Proper quenching ensures
                      that the aluminum wire rod solidifies correctly,
                      preventing defects and ensuring high-quality output.
                      
                    </div>
                  )}
                  {activeSection === "feedback" && (
                    <div className="sub">
                      <h3>About Feedback Section</h3>
                      The feedback section provides valuable insights into the
                      performance of the aluminum wire rod production process by
                      comparing predicted values to the actual real-time data.
                      It highlights any significant fluctuations in key
                      parameters, such as UTS, elongation, and conductivity,
                      which are crucial for maintaining the desired product
                      quality. If any of the real-time data deviates from the
                      predicted values by a notable margin, the system flags
                      these discrepancies, helping operators identify potential
                      issues in the process. This feedback loop serves as an
                      early warning system, allowing for timely interventions to
                      ensure that the production process stays within optimal
                      parameters, leading to better consistency and quality
                      control in the final product.
                      
                    </div>
                  )}
                </div>
              </div>
            )}

                {activeTab === "display" && (
              <div className="details">
                <div className="display-detail">
                  <div className="main-box">
                    <h3>About Display Data </h3>
                    The Display Data page presents a comprehensive view of all
                    input parameters, including temperatures, pressures, RPMs,
                    and flow rates. It serves as a repository for storing and
                    accessing this data, enabling further analysis and
                    optimization of the production process.
                  </div>
                  <div className="btns">
                    <button onClick={() => handleSectionClick("grades")}>
                      Grades
                    </button>
                    <button onClick={() => handleSectionClick("averages")}>
                      Average of Parameters
                    </button>
                    <button onClick={() => handleSectionClick("predictions")}>
                      Predictions History
                    </button>
                  </div>
                </div>
                <div className="subs">
                  {activeSection === "grades" && (
                    <div className="sub">
                      <h3>About Grades Section</h3>
                      The Grades Section in the Display Data module provides an
                      overview of the total number of grades, such as WE-10 and
                      WE-20. It includes buttons for each grade, allowing users
                      to filter the Predictions History Table. Clicking on the
                      WE-10 or WE-20 button displays the prediction history
                      specific to that grade, highlighting trends and
                      performance metrics. This feature helps users analyze
                      historical data for individual grades, improving
                      decision-making and quality control. By focusing on
                      specific grades, users can track production consistency
                      and identify areas for optimization. It ensures a
                      streamlined approach to monitoring and managing grade
                      performance.
                      
                    </div>
                  )}
                  {activeSection === "averages" && (
                    <div className="sub">
                      <h3>About Average of Parmeters Parameters</h3>
                      The Average of Parameter section in the Display Data
                      module displays the average values of UTS, Elongation, and
                      Conductivity based on the top 10 rows of predictions. This
                      feature helps users quickly identify the average
                      performance of these key properties, providing a clear
                      snapshot of the data. By focusing on the top predictions,
                      it offers valuable insights into the overall trends and
                      consistency of the material properties. This section
                      supports better analysis and aids in tracking quality
                      metrics, ensuring informed decision-making for process
                      optimization and performance monitoring.
                      
                    </div>
                  )}
                  {activeSection === "predictions" && (
                    <div className="sub">
                      <h3>About Predictions History</h3>
                      The Predictions History section in the Display Data module
                      displays the complete history of all predictions and
                      optimization data. It allows users to review past
                      performance and track changes over time. This section also
                      includes a filtering feature, enabling users to view
                      either the Predictions History or Optimization Data
                      separately by clicking the respective buttons. This
                      functionality provides a focused view, helping users
                      analyze trends, evaluate optimization efforts, and make
                      informed decisions to enhance process efficiency and
                      quality control.
                      
                    </div>
                  )}
                </div>
              </div>
            )}
          <div className="marquee-container">
            <div className="marquee-content">
              <img src="https://d2ah634u9nypif.cloudfront.net/wp-content/themes/nalco/images/nalco-train.png" alt="NALCO Logo" />
              <div className="marquee">
              <p style={{ marginLeft: '65px' }}>Dashboard</p>
              </div>
              <div className="marquee">
              <p style={{ marginLeft: '340px'}}>Realtime</p>
              </div>
              <img src="https://d2ah634u9nypif.cloudfront.net/wp-content/themes/nalco/images/nalco-train.png" alt="NALCO Logo" />
              <div className="marquee">
              <p style={{ marginLeft: '610px' }}>Display</p>
              </div>
              <img src="https://d2ah634u9nypif.cloudfront.net/wp-content/themes/nalco/images/nalco-train.png" alt="NALCO Logo" />
              <img src="https://d2ah634u9nypif.cloudfront.net/wp-content/themes/nalco/images/nalco-train-engine.png" alt="NALCO Logo" />
               
            </div>
          </div>


    </div>
  </div>
</div>

    </>
  );
}