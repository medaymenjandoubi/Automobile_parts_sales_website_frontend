import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../context";
import axios from "axios";
import { notification } from "antd";
import { ArrowRightOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Cart from "./Cart";
import './SideBar.css';

const SideBar = ({ cart ,isCollapsed,setIsCollapsed}) => {
  const [redirect, setRedirect] = useState(false);
  const { dispatch } = useContext(Context);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = async () => {
    if (user) {
      // Logout logic
      dispatch({ type: "LOGOUT" });
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("token");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "_csrf=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}logout`, {
          withCredentials: true,
        });
        notification.success({
          message: "Log out successful!",
          placement: "topRight",
          duration: 5,
        });
      } catch (error) {
        console.error("Logout failed:", error);
        notification.error({
          message: "Log out failed!",
          description: "Please try again later.",
          placement: "topRight",
          duration: 5,
        });
      }
      setRedirect(true);
    } else {
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle the sidebar state
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <aside
      className={`bg-gray-800 text-white h-screen flex flex-col custom-scrollbar transition-all duration-300`} 
    >
      {/* Toggle button */}
      <div className="p-2">
        <button
          className="text-white focus:outline-none"
          onClick={toggleSidebar}
          style={{width:"100%", display:"flex",justifyContent:"flex-start"}}
        >
          {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1">
          <div>
            <Cart />
          </div>
          <div className="mt-auto">
            <button
              className="w-full bg-custom-blue text-white p-2 rounded-md hover:bg-custom-purple hover:text-green-200"
              onClick={user ? handleLogout : () => navigate("/login")}
            >
              {user ? (
                "Déconnexion"
              ) : (
                <>
                  Se connecter <ArrowRightOutlined />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideBar;
