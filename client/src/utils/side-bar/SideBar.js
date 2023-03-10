import { FiDatabase } from "react-icons/fi";
import { BsClipboardData } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineClose, AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import "./SideBar.css";
import GardenIcon from "./garden.png";

const SideBar = () => {
  const [hidden, setHidden] = useState(true);
  const openSidebar = () => setHidden(false);
  const closeSidebar = () => setHidden(true);

  const logOut = () => {
    localStorage.removeItem("garden_id");
  }

  return (
    <div className="side-bar-container">
      <div className="side-bar-button side-bar-open"  onClick={openSidebar}>
        <AiOutlineMenu />
      </div>
      <div id="side-bar" className={hidden?"hidden":""} >
        <div className="side-bar-button side-bar-close">
          <div className="side-bar-close-button" onClick={closeSidebar}>
            <AiOutlineClose />
          </div>
        </div>

        <div className="side-bar-header">
          <img src={GardenIcon} alt="img"/>
          <div className="side-bar-header-title">Vườn thông minh</div>
        </div>
        <div className="side-bar-body">
          <NavLink to="/dashboard/" className="side-bar-item" >
            <AiFillHome className="side-bar-item-icon"/>
            <p>Trang chủ</p>
          </NavLink>
          <NavLink to="/dashboard/data" className="side-bar-item" >
            <FiDatabase className="side-bar-item-icon"/>
            <p>Dữ liệu</p>
          </NavLink>
          <NavLink to="/dashboard/history" className="side-bar-item" >
            <FaRegCalendarAlt className="side-bar-item-icon" />
            <p>Lịch sử</p>
          </NavLink>
          <NavLink to="/dashboard/statistic" className="side-bar-item" >
            <BsClipboardData className="side-bar-item-icon"/>
            <p>Thống kê</p>
          </NavLink>
        </div>
        <div id="side-bar-footer">
          <NavLink to="/" className="side-bar-footer-content" onClick={logOut}>
            <AiOutlineLogout/>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
