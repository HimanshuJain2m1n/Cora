// src/api/interceptor.js
import { getStoredTokens, refreshAccessToken } from './auth';

/**
 * Creates a fetch interceptor that handles token refresh
 * @param {string} baseUrl - The base URL for API requests
 * @returns {Function} - The fetch wrapper function
 */
export const createApiInterceptor = (baseUrl) => {
  // Wrapper around fetch that handles token refresh
  return async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;
    
    try {
      // Get the current tokens
      const { accessToken } = getStoredTokens();
      console.log('Using access token:', accessToken ? 'Token exists' : 'No token');
      
      // Set up headers with authorization if token exists
      if (!options.headers) {
        options.headers = {};
      }
      
      // Don't override if Authorization is already set in options
      if (accessToken && !options.headers.Authorization) {
        options.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      console.log('Making request to:', url);
      console.log('Request options:', JSON.stringify({
        method: options.method,
        headers: options.headers,
        // Don't log body for privacy
        hasBody: !!options.body
      }));
      
      // Make the initial request
      const response = await fetch(url, options);
      console.log('Response status:', response.status);
      
      // If unauthorized (401), try to refresh the token and retry the request
      if (response.status === 401) {
        console.log('Token expired, attempting to refresh...');
        
        try {
          // Try to refresh the token
          const newTokens = await refreshAccessToken();
          console.log('Token refreshed successfully');
          
          // Update authorization header with new token
          options.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          
          // Retry the request with the new token
          console.log('Retrying request with new token');
          return fetch(url, options);
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // If refresh fails, propagate the original 401 response
          return response;
        }
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      // Create a Response object to return instead of throwing
      return new Response(JSON.stringify({ 
        error: error.message || 'Network request failed',
        details: error.toString()
      }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
  };
};
