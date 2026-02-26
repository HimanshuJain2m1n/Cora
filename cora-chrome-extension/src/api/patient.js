import { createApiInterceptor } from './interceptor';

const RISK_API_BASE_URL = 'http://3.16.246.83:8090/api/v1'; // Replace with your actual API base URL
const apiClient = createApiInterceptor(RISK_API_BASE_URL);

export const fetchPatients = async (page, pageSize, searchQuery, firstName, LastName, DoB) => {
    try {
      console.log("Fetching patients with search query:", searchQuery);
      console.log("API base URL:", RISK_API_BASE_URL);
      
      // Build request body with only required parameters
      const requestBody = {};
      
      // Add pagination parameters only if they are provided
      if (pageSize) {
        requestBody.limit = pageSize;
      }
      
      if (page) {
        requestBody.skip = page - 1;
      }
      
      // Add search parameter only if searchQuery is provided
      if (searchQuery) {
        requestBody.search = searchQuery;
      }
      
      // Add exact_search parameter only if at least firstName or LastName is provided
      if (firstName || LastName) {
        requestBody.exact_search = [
          firstName || "",
          LastName || "",
          DoB || ""
        ];
      }
      
      // The apiClient will automatically handle token management
      const response = await apiClient('/patients/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("Patient list response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Patient data received:", data ? "Data exists" : "No data");
      return data;
    } catch (error) {
      console.error("Error in fetchPatients:", error);
      throw new Error(`Failed to fetch patients: ${error.message}`);
    }
  };

  export const getPatientById = async (id) => {
    try {
      console.log(`Fetching patient details for ID: ${id}`);
      
      // The apiClient will automatically handle token management
      const response = await apiClient(`/patients/retrieve/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log("Patient details response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Patient details received:", data ? "Data exists" : "No data");
      return data;
    } catch (error) {
      console.error("Error in getPatientById:", error);
      throw new Error(`Failed to fetch patient details: ${error.message}`);
    }
  };