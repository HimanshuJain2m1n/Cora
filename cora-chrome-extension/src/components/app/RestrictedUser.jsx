import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const RestrictedUser = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
      // Clear any existing user data
  
      
      // Show the error message for 3 seconds before navigating
      const timer = setTimeout(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Navigate to login page after 3 seconds
        window.location.reload();
      }, 3000);
      
      // Clean up the timer if component unmounts
      return () => clearTimeout(timer);
    }, [navigate]);
    
    // Rest of your component remains the same
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="heading-text" style={{ color: "red" }}>
            Error : Sorry User is Restricted
          </div>
        </div>
      </>
    );
  };
