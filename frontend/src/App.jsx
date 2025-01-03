import "./App.css";
import "./components/inputs/Dashboard.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/inputs/Dashboard";
import RealtimeDashboard from "./components/realtime/RealtimeDashboard";
import DisplayData from "./components/displayData/DisplayData";
import Guide from "./components/userGuide/Guide";
import Optimize from "./components/inputs/Optimize";
import Login from "./components/login/Login"; // Login component is commented out
// import Logout from "./components/logout/Logout"; // Logout component is also commented out

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Route for Login (Commented out) */}
          <Route path="/login" element={<Login />} />

          {/* Direct Access to Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/realtime-dashboard" element={<RealtimeDashboard />} />
          <Route path="/display" element={<DisplayData />} />
          <Route path="/guide" element={<Guide />} />

          {/* Logout Route (Optional, commented out) */}
          {/* <Route path="/logout" element={<Logout />} /> */}

          {/* Redirect to Dashboard by default */}
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
