import { Outlet } from "react-router-dom";
import SideBar from "../utils/side-bar/SideBar";

const Layout = () => {
  return (
    <div style={{ maxWidth: "400px" }}>
      <SideBar />
      <Outlet />
    </div>
  );
};

export default Layout;
