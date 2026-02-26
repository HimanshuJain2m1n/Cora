import "./App.css";
import { CoraAIContainer } from "./components/app/CoraAIContainer";
import Login from "./components/Login";
import { useState, useEffect } from "react";
import { MemoryRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./components/app/Home";
import { PatientSearch } from "./components/app/PatientSearch";
import { PatientDetail } from "./components/app/PatientDetail"; 
import '../public/asset/styles/text.css';
import NavigationListener from "./components/app/NavigationListener";
import { ToastContainer } from "react-toastify";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 

  useEffect(() => {
    // Prevent the popup from closing when clicking outside
    const handleClick = (e) => {
      e.stopPropagation();
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    // Check for existing login details on component mount
    console.log("Checking for login details",localStorage.getItem('accessToken'), localStorage.getItem('refreshToken'));
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="app-container" onClick={(e) => e.stopPropagation()}>
      <Router initialEntries={['/']}>
        <NavigationListener />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} style={{width:"80vw", top:"1rem"}} />
        
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/home" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
          />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          {/* <Route path="/diagnosis" element={isLoggedIn ? <Diagnosis /> : <Navigate to="/login" />} /> */}
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          {/* <Route path="/home" element={isLoggedIn ? <Navigate to="/patient/pat-bMJBq0m8pKb4y0Kxh2HUe4WC" /> : <Navigate to="/login" />} /> */}

          <Route path="/patient/:id" element={isLoggedIn ? <PatientDetail /> : <Navigate to="/login" />} />
          <Route path="/patient-manaual-search" element={<PatientSearch/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
