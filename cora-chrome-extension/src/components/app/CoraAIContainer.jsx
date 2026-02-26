import React, { useState, useEffect } from "react";
import avatar from "../../../public/asset/images/user.svg";
import logo from "../../../public/asset/images/CoraAILogo.svg";
import searchIcon from "../../../public/asset/images/searchicon.svg";
import { useNavigate } from "react-router-dom";
import leftArrow from "../../../public/asset/images/arrows/left.svg";
export const CoraAIContainer = ({ children, showAvatar = false, showSearch = true }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setShowDropdown(false);
    if (showDropdown) {
      window.addEventListener('click', handleClick);
    }
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [showDropdown]);
  return (
    <div style={{  height: "100vh"}}>
      <div className="cora-ai-header" style={{ position: 'fixed' }}>
        {showAvatar && (
          <div style={{width:"2.5rem"}}>
            <img
              className="user-search"
              src={showSearch ? searchIcon : leftArrow}
              alt="user avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => showSearch ? navigate("/patient-manaual-search") : navigate("/")}
            />
          </div>
        )}
        <div style={{width:"100%"}}><img src={logo} alt="Cora AI Logo" /></div>
        {showAvatar && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              className="user-avatar"
              src={avatar}
              alt="user avatar"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
              }}
            />
            {showDropdown && (
              <div className="user-dropdown">
                <button className="user-dropdown-button"
                
                  onClick={() => {
                    setShowDropdown(false);
                    if (typeof window !== 'undefined') {
                      // Remove login info and reload (optional, depends on your logout logic)
                      localStorage.removeItem('user');
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('refreshToken');
                      if (window.chrome && window.chrome.storage && window.chrome.storage.local) {
                        window.chrome.storage.local.remove(['userEmail', 'userPassword'], () => {
                          window.location.reload();
                        });
                      } else {
                        window.location.reload();
                      }
                    }
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ padding: "1rem 1rem",}}>
        <div style={{marginTop:"3rem"}}></div>
        {children}</div>
    </div>
  );
};
