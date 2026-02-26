// src/components/app/NavigationListener.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component that listens for custom navigation events and uses React Router to navigate
 * This component doesn't render anything visible
 */
const NavigationListener = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Function to handle navigation events
    const handleNavigation = (event) => {
      const { path } = event.detail;
      console.log('Navigation event received, navigating to:', path);
      navigate(path);
    };
    
    // Add event listener
    document.addEventListener('cora-navigation', handleNavigation);
    
    // Clean up
    return () => {
      document.removeEventListener('cora-navigation', handleNavigation);
    };
  }, [navigate]);
  
  // This component doesn't render anything
  return null;
};

export default NavigationListener;