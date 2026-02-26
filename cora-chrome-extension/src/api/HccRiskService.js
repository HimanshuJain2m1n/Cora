import { RISK_API_BASE_URL, handleApiResponse, PATIENT_ENDPOINTS } from './ApiConfig';

/**
 * HCC Risk Service for managing patient HCC risks
 * Handles approve/reject functionality and batch operations
 */
class HccRiskService {
  
  /**
   * Get HCC risks by patient ID and batch ID for display on UI cards
   * @param {string} patientId - Patient ID
   * @param {string} batchId - Batch ID
   * @param {number} limit - Maximum records to return (default: 100)
   * @param {number} offset - Records to skip (default: 0)
   * @returns {Promise} API response with HCC risks data
   */
  async getHccRisksByPatientAndBatch(patientId, batchId, limit = 100, offset = 0) {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(`${RISK_API_BASE_URL}${PATIENT_ENDPOINTS.HCC_RISK.BY_PATIENT_BATCH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_id: patientId,
          batch_id: batchId,
          limit,
          offset
        })
      });
      
      if (!response.ok) throw new Error("Failed to fetch HCC risks");
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching HCC risks by patient and batch:', error);
      throw error;
    }
  }

  /**
   * Update HCC risk status (approve/reject)
   * @param {string} hccRiskId - HCC Risk ID
   * @param {string} status - New status ("approved", "rejected", etc.)
   * @param {string} rejectionReason - Reason for rejection (optional)
   * @param {string} rejectionNotes - Additional rejection notes (optional)
   * @returns {Promise} API response with updated HCC risk
   */
  async updateHccRiskStatus(hccRiskId, status, rejectionReason = null, rejectionNotes = null) {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(`${RISK_API_BASE_URL}/hcc-risk/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          hcc_risk_id: hccRiskId,
          status,
          rejection_reason: rejectionReason,
          rejection_notes: rejectionNotes
        })
      });
      
      if (!response.ok) throw new Error("Failed to update HCC risk status");
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error updating HCC risk status:', error);
      throw error;
    }
  }

  /**
   * Bulk update HCC risk status for multiple records
   * @param {Array<string>} hccRiskIds - List of HCC Risk IDs
   * @param {string} status - New status ("approved", "rejected", etc.)
   * @param {string} rejectionReason - Reason for rejection (optional)
   * @param {string} rejectionNotes - Additional rejection notes (optional)
   * @returns {Promise} API response with updated HCC risks
   */
  async bulkUpdateHccRiskStatus(hccRiskIds, status, rejectionReason = null, rejectionNotes = null) {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(`${RISK_API_BASE_URL}/hcc-risk/bulk-update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          hcc_risk_ids: hccRiskIds,
          status,
          rejection_reason: rejectionReason,
          rejection_notes: rejectionNotes
        })
      });
      
      if (!response.ok) throw new Error("Failed to bulk update HCC risk status");
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error bulk updating HCC risk status:', error);
      throw error;
    }
  }

  /**
   * Get distinct batch IDs and run dates for a patient
   * @param {string} patientId - Patient ID
   * @param {number} limit - Maximum records to return (default: 100)
   * @param {number} offset - Records to skip (default: 0)
   * @returns {Promise} API response with patient batches
   */
  async getPatientBatches(patientId, limit = 100, offset = 0) {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(`${RISK_API_BASE_URL}/hcc-risk/patient-batches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_id: patientId,
          limit,
          offset
        })
      });
      
      if (!response.ok) throw new Error("Failed to fetch patient batches");
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching patient batches:', error);
      throw error;
    }
  }

  /**
   * Get the latest batch ID for a patient
   * @param {string} patientId - Patient ID
   * @returns {Promise} API response with latest batch ID
   */
  async getLatestBatchForPatient(patientId) {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(`${RISK_API_BASE_URL}/hcc-risk/latest-batch/${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch latest batch");
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching latest batch for patient:', error);
      throw error;
    }
  }

  /**
   * Get HCC risk by ID
   * @param {string} hccRiskId - HCC Risk ID
   * @returns {Promise} API response with HCC risk details
   */
  async getHccRiskById(hccRiskId) {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(`${RISK_API_BASE_URL}/hcc-risk/${hccRiskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch HCC risk");
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching HCC risk by ID:', error);
      throw error;
    }
  }

  /**
   * Approve an HCC risk
   * @param {string} hccRiskId - HCC Risk ID
   * @returns {Promise} API response with updated HCC risk
   */
  async approveHccRisk(hccRiskId) {
    return this.updateHccRiskStatus(hccRiskId, 'approved');
  }

  /**
   * Reject an HCC risk with reason and notes
   * @param {string} hccRiskId - HCC Risk ID
   * @param {string} reason - Rejection reason
   * @param {string} notes - Additional rejection notes
   * @returns {Promise} API response with updated HCC risk
   */
  async rejectHccRisk(hccRiskId, reason, notes = '') {
    return this.updateHccRiskStatus(hccRiskId, 'rejected', reason, notes);
  }

  /**
   * Bulk approve multiple HCC risks
   * @param {Array<string>} hccRiskIds - List of HCC Risk IDs
   * @returns {Promise} API response with updated HCC risks
   */
  async bulkApproveHccRisks(hccRiskIds) {
    return this.bulkUpdateHccRiskStatus(hccRiskIds, 'approved');
  }

  /**
   * Bulk reject multiple HCC risks
   * @param {Array<string>} hccRiskIds - List of HCC Risk IDs
   * @param {string} reason - Rejection reason
   * @param {string} notes - Additional rejection notes
   * @returns {Promise} API response with updated HCC risks
   */
  async bulkRejectHccRisks(hccRiskIds, reason, notes = '') {
    return this.bulkUpdateHccRiskStatus(hccRiskIds, 'rejected', reason, notes);
  }


}

export default new HccRiskService(); 