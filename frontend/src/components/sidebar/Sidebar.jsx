import './Sidebar.css';
import { Link } from 'react-router-dom';
import { FaHome, FaChartLine, FaDatabase, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/dashboard" className="sidebar-link">
                        <FaHome className="icon" /> Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/optimize" className="sidebar-link">
                        <span className="icon" style={{ marginLeft: '-2px', marginRight:'-12px' }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 512 512"
                                style={{ enableBackground: 'new 0 0 512 512', display: 'block' }}
                            >
                                <g>
                                    <path
                                        d="M256 111c-79.953 0-145 65.047-145 145s65.047 145 145 145 145-65.047 145-145-65.047-145-145-145zm101.444 152.111h-30v-27.787L256 306.769l-32-32-53.394 53.394-21.213-21.213L224 232.343l32 32 50.231-50.231h-27.787v-30h79z"
                                        fill="#ffffff"
                                    ></path>
                                    <path
                                        d="M512 288v-64h-34.285a222.44 222.44 0 0 0-13.672-51.163l29.66-17.124-32-55.426-29.698 17.146a225.287 225.287 0 0 0-37.438-37.438l17.146-29.698-55.426-32-17.124 29.66A222.44 222.44 0 0 0 288 34.285V0h-64v34.285a222.44 222.44 0 0 0-51.163 13.672l-17.124-29.66-55.426 32 17.146 29.698a225.287 225.287 0 0 0-37.438 37.438l-29.698-17.146-32 55.426 29.66 17.124A222.44 222.44 0 0 0 34.285 224H0v64h34.285a222.44 222.44 00 0 0 13.672 51.163l-29.66 17.124 32 55.426 29.698-17.146a225.287 225.287 0 0 0 37.438 37.438l-17.146 29.698 55.426 32 17.124-29.66A222.44 222.44 0 0 0 224 477.715V512h64v-34.285a222.44 222.44 0 0 0 51.163-13.672l17.124 29.66 55.426-32-17.146-29.698a225.287 225.287 0 0 0-37.438-37.438l29.698 17.146 32-55.426-29.66-17.124A222.44 222.44 0 0 0 477.715 288zM256 431c-96.495 0-175-78.505-175-175S159.505 81 256 81s175 78.505 175 175-78.505 175-175 175z"
                                        fill="#ffffff"
                                    ></path>
                                </g>
                            </svg>
                        </span>
                        Optimize
                    </Link>
                </li>
                <li>
                    <Link to="/realtime-dashboard" className="sidebar-link">
                        <span className="icon" style={{ marginLeft: '-1px', marginRight:'-12px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 38 41" fill="none">
                                <path d="M20.8333 13.5153V0H37.5V13.5153H20.8333ZM0 22.5255V0H16.6667V22.5255H0ZM20.8333 40.5458V18.0204H37.5V40.5458H20.8333ZM0 40.5458V27.0306H16.6667V40.5458H0Z" fill="#E6E6E6"/>
                            </svg>
                        </span>
                        Realtime Monitoring
                    </Link>
                </li>
                <li>
                    <Link to="/display" className="sidebar-link">
                        <FaDatabase  className="icon" /> Display Data
                    </Link>
                </li>
                <li>
                    <Link to="/guide" className="sidebar-link">
                        <span className="icon" style={{ marginLeft: '-1px' , marginRight:'-12px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 44 51" fill="none">
                                <path d="M44 35.8594V2.39062C44 1.06582 42.9491 0 41.6429 0H9.42857C4.22321 0 0 4.2832 0 9.5625V41.4375C0 46.7168 4.22321 51 9.42857 51H41.6429C42.9491 51 44 49.9342 44 48.6094V47.0156C44 46.2686 43.6562 45.5912 43.1259 45.1529C42.7134 43.6189 42.7134 39.2461 43.1259 37.7121C43.6562 37.2838 44 36.6064 44 35.8594ZM12.5714 13.3477C12.5714 13.0189 12.8366 12.75 13.1607 12.75H33.9821C34.3062 12.75 34.5714 13.0189 34.5714 13.3477V15.3398C34.5714 15.6686 34.3062 15.9375 33.9821 15.9375H13.1607C12.8366 15.9375 12.5714 15.6686 12.5714 15.3398V13.3477ZM12.5714 19.7227C12.5714 19.3939 12.8366 19.125 13.1607 19.125H33.9821C34.3062 19.125 34.5714 19.3939 34.5714 19.7227V21.7148C34.5714 22.0436 34.3062 22.3125 33.9821 22.3125H13.1607C12.8366 22.3125 12.5714 22.0436 12.5714 21.7148V19.7227ZM37.4589 44.625H9.42857C7.69018 44.625 6.28571 43.2006 6.28571 41.4375C6.28571 39.6844 7.7 38.25 9.42857 38.25H37.4589C37.2723 39.9533 37.2723 42.9217 37.4589 44.625Z" fill="white"/>
                            </svg>
                        </span>
                        User Guide
                    </Link>
                </li>
                <li className="logout">
                    <Link to="/login" className="sidebar-link">
                        <FaSignOutAlt className="icon" /> Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
}