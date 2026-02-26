const AUTH_API_BASE_URL = 'http://3.16.246.83:8088/api/v1'; // Replace with your actual API base URL
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login/',
  REFRESH_TOKEN: '/auth/refresh-token'
};

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Token utility functions
export const getStoredTokens = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  };
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  chrome.storage.local.remove(['accessToken', 'refreshToken', 'user']);
};

// Custom event for navigation in Chrome extension
export const triggerNavigation = (path) => {
  // Dispatch a custom event that React components can listen for
  const event = new CustomEvent('cora-navigation', { 
    detail: { path } 
  });
  document.dispatchEvent(event);
  console.log('Navigation event triggered for path:', path);
};

export async function AuthLogin(email, password) {
  try {
    console.log("Logging in user:", email);
    
    const response = await fetch(`${AUTH_API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({username: email, password }),
    });
    
    const data = await handleApiResponse(response);
    
    console.log("Login response:", data.access);
    
    // Check for token fields - handle both snake_case and camelCase
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    
    if (accessToken && refreshToken) {
      storeTokens(accessToken, refreshToken);
      return data;
    } else {
      throw new Error("Login failed: No tokens received");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

export async function refreshAccessToken() {
  try {
    const { refreshToken } = getStoredTokens();
    console.log('Attempting to refresh token, refresh token exists:', !!refreshToken);
    
    if (!refreshToken) {
      console.error('No refresh token available');
      throw new Error("No refresh token available");
    }
    
    console.log('Calling refresh token endpoint:', `${AUTH_API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`);
    
    const response = await fetch(`${AUTH_API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    console.log('Refresh token response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Refresh token error response:', errorText);
      throw new Error(`Token refresh failed with status: ${response.status}`);
    }
    
    const data = await handleApiResponse(response);
    console.log('Refresh token response data received:', !!data);
    
    // Check for token fields - handle both snake_case and camelCase
    const accessToken = data.accessToken || data.access_token;
    const newRefreshToken = data.refreshToken || data.refresh_token || refreshToken;
    
    if (accessToken) {
      console.log('New access token received, storing tokens');
      storeTokens(accessToken, newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    } else {
      console.error('No access token in refresh response');
      throw new Error("Token refresh failed: No access token received");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Only clear tokens and redirect if it's not a network error
    // This prevents logout on temporary network issues
    if (!error.message.includes('NetworkError') && !error.message.includes('Failed to fetch')) {
      console.log('Clearing tokens and redirecting to login');
      clearTokens();
      triggerNavigation('/login');
      window.location.reload();
      // Use the custom navigation event for Chrome extension
    
    }
    throw error;
  }
}