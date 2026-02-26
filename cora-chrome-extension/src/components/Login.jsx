/* global chrome */
import React, { useState, useEffect } from 'react';
import { AuthLogin } from '../api/auth';
import './Login.css';
import { CoraAIContainer } from './app/CoraAIContainer';
import { showNotification } from '../utils/notificationutil';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log('Data:', email, password);

  useEffect(() => {
    // Check for existing login details on component mount
    chrome.storage.local.get(['userEmail', 'userPassword'], (result) => {
      if (result.userEmail && result.userPassword) {
        setEmail(result.userEmail);
        setIsLoggedIn(true);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await AuthLogin(email, password);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Store login details in Chrome's local storage
      await chrome.storage.local.set({
        userEmail: email,
        userPassword: password
      });
      
      setIsLoggedIn(true);
      showNotification('Login Successful', 'You have been successfully logged in to Cora');
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
      showNotification(err.message , 'There was an error logging in. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleLogout = () => {
    chrome.storage.local.remove(['userEmail', 'userPassword'], () => {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setEmail('');
      setPassword('');
      setIsLoggedIn(false);
      showNotification('Logged Out', 'You have been successfully logged out from Cora');
    });
  };

  // if (isLoggedIn) {
  //   return (
  //     <div className="login-container">
  //       <div className="login-box">
  //         <h2>Welcome back!</h2>
  //         <p>You are logged in as: {email}</p>
  //         <button onClick={handleLogout} className="login-button">
  //           Logout
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <CoraAIContainer>
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Cora</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
    </CoraAIContainer>
  );
};

export default Login; 