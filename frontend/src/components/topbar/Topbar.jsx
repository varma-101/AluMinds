import Alerts from './Alerts';
import './Topbar.css';
import { FaBell } from "react-icons/fa";

export default function Topbar({ title }) {
  return (
    <div className="topbar">
      <div className="img-span">
        <img src="nalco-logo.png" alt="NALCO Logo" style={{ height: "50px", width: "250px" }} />
        <span>A Navratna CPSE | A Govt. of India Enterprise</span>
      </div>
      <div className="title">
        <h1>{title}</h1>
      </div>
      <div>
        
      </div>
    </div>
  );
}