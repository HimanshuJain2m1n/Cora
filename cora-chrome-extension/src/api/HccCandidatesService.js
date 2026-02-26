import { handleApiResponse } from "./ApiConfig";
import { VITE_RISK_API_BASE_URL } from "./apiUrls";

/**
 * HCC Candidates Service for managing patient HCC candidates
 * Handles hierarchical tree structure, status updates, and history tracking
 */
class HccCandidatesService {
  /**
   * Get HCC candidates for a patient in hierarchical structure
   * @param {string} patientId - Patient ID
   * @param {string} period - Year period (YYYY format, optional)
   * @param {number} limit - Maximum records to return (default: 100)
   * @param {number} offset - Records to skip (default: 0)
   * @param {Array<string>} includeStatus - Filter by status values (optional)
   * @returns {Promise} API response with hierarchical HCC candidates data
   */
  async getHccCandidatesByPatient(
    patientId,
    period = null,
    limit = 100,
    offset = 0,
    includeStatus = null
  ) {
    try {
      const token = localStorage.getItem("accessToken");

      const requestBody = {
        patient_id: patientId,
        limit,
        offset,
      };

      if (period) {
        requestBody.period = period;
      }

      if (includeStatus && includeStatus.length > 0) {
        requestBody.include_status = includeStatus;
      }

      const response = await fetch(
        `${VITE_RISK_API_BASE_URL}/hcc-risk-adjustments/by-patient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || "Failed to fetch HCC candidates";
        throw new Error(errorMessage);
      }
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching HCC candidates by patient:", error);
      throw error;
    }
  }

  /**
   * Get HCC candidates for a patient (simple GET endpoint for backward compatibility)
   * @param {string} patientId - Patient ID
   * @param {string} period - Year period (YYYY format, optional)
   * @param {number} limit - Maximum records to return (default: 100)
   * @param {number} offset - Records to skip (default: 0)
   * @param {Array<string>} includeStatus - Filter by status values (optional)
   * @returns {Promise} API response with hierarchical HCC candidates data
   */
  async getHccCandidatesByPatientSimple(
    patientId,
    period = null,  
    limit = 100,
    offset = 0,
    includeStatus = null
  ) {
    try {
      const token = localStorage.getItem("accessToken");

      let url = `${VITE_RISK_API_BASE_URL}/hcc-risk-adjustments/by-patient-simple/${patientId}?limit=${limit}&offset=${offset}`;

      if (period) {
        url += `&period=${period}`;
      }

      if (includeStatus && includeStatus.length > 0) {
        includeStatus.forEach((status) => {
          url += `&include_status=${status}`;
        });
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || "Failed to fetch HCC candidates";
        throw new Error(errorMessage);
      }
      return await handleApiResponse(response);
    } catch (error) {
      console.error(
        "Error fetching HCC candidates by patient (simple):",
        error
      );
      throw error;
    }
  }

  /**
   * Update status of a single HCC candidate
   * @param {string} candidateId - Candidate ID
   * @param {string} status - New status (pending, approved, rejected, confirmed, submitted)
   * @param {string} changeReason - Reason for the change (optional)
   * @param {string} notes - Additional notes (optional)
   * @returns {Promise} API response
   */
  async updateCandidateStatus(
    candidateId,
    status,
    changeReason = null,
    notes = null
  ) {
    try {
      const token = localStorage.getItem("accessToken");

      const requestBody = {
        candidate_id: candidateId,
        status: status,
      };

      if (changeReason) {
        requestBody.change_reason = changeReason;
      }

      if (notes) {
        requestBody.notes = notes;
      }

      const response = await fetch(
        `${VITE_RISK_API_BASE_URL}/hcc-risk-adjustments/update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to update candidate status");
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error updating candidate status:", error);
      throw error;
    }
  }

  /**
   * Bulk update status of multiple HCC candidates
   * @param {Array<string>} candidateIds - List of candidate IDs
   * @param {string} status - New status (pending, approved, rejected, confirmed, submitted)
   * @param {string} changeReason - Reason for the change (optional)
   * @param {string} notes - Additional notes (optional)
   * @returns {Promise} API response with bulk update results
   */
  async bulkUpdateCandidatesStatus(
    candidateIds,
    status,
    changeReason = null,
    notes = null
  ) {
    try {
      const token = localStorage.getItem("accessToken");

      const requestBody = {
        candidate_ids: candidateIds,
        status: status,
      };

      if (changeReason) {
        requestBody.change_reason = changeReason;
      }

      if (notes) {
        requestBody.notes = notes;
      }

      const response = await fetch(
        `${VITE_RISK_API_BASE_URL}/hcc-risk-adjustments/bulk-update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok)
        throw new Error("Failed to bulk update candidate status");
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error bulk updating candidate status:", error);
      throw error;
    }
  }

  /**
   * Get status change history for a candidate
   * @param {string} candidateId - Candidate ID
   * @returns {Promise} API response with status history
   */
  async getCandidateStatusHistory(candidateId) {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${VITE_RISK_API_BASE_URL}/hcc-risk-adjustments/status-history/${candidateId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Failed to fetch candidate status history");
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching candidate status history:", error);
      throw error;
    }
  }

  /**
   * Get summary statistics for patient HCC candidates
   * @param {string} patientId - Patient ID
   * @param {string} period - Year period (YYYY format, optional)
   * @returns {Promise} API response with summary statistics
   */
  async getPatientCandidatesSummary(patientId, period = null) {
    try {
      const token = localStorage.getItem("accessToken");

      let url = `${VITE_RISK_API_BASE_URL}/hcc-risk-adjustments/summary/${patientId}`;

      if (period) {
        url += `?period=${period}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Failed to fetch patient candidates summary");
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error fetching patient candidates summary:", error);
      throw error;
    }
  }

  /**
   * Helper method to approve a candidate (maps to approved status)
   * @param {string} candidateId - Candidate ID
   * @param {string} notes - Optional notes
   * @returns {Promise} API response
   */
  async approveCandidate(candidateId, notes = null) {
    return this.updateCandidateStatus(
      candidateId,
      "approved",
      "Approved by clinician",
      notes
    );
  }

  /**
   * Helper method to reject a candidate
   * @param {string} candidateId - Candidate ID
   * @param {string} reason - Rejection reason
   * @param {string} notes - Optional additional notes
   * @returns {Promise} API response
   */
  async rejectCandidate(candidateId, reason, notes = null) {
    return this.updateCandidateStatus(candidateId, "rejected", reason, notes);
  }

  /**
   * Helper method to bulk approve multiple candidates
   * @param {Array<string>} candidateIds - List of candidate IDs
   * @param {string} notes - Optional notes
   * @returns {Promise} API response
   */
  async bulkApprove(candidateIds, notes = null) {
    return this.bulkUpdateCandidatesStatus(
      candidateIds,
      "approved",
      "Bulk approved by clinician",
      notes
    );
  }

  /**
   * Helper method to bulk reject multiple candidates
   * @param {Array<string>} candidateIds - List of candidate IDs
   * @param {string} reason - Rejection reason
   * @param {string} notes - Optional additional notes
   * @returns {Promise} API response
   */
  async bulkReject(candidateIds, reason, notes = null) {
    return this.bulkUpdateCandidatesStatus(
      candidateIds,
      "rejected",
      reason,
      notes
    );
  }

  /**
   * Transform hierarchical data to match the expected frontend format
   * This method helps with backward compatibility during migration
   * @param {Object} hierarchicalResponse - Response from the new API
   * @returns {Object} Transformed data matching existing frontend expectations
   */
  transformToLegacyFormat(hierarchicalResponse) {
    if (!hierarchicalResponse || !hierarchicalResponse.hcc_groups) {
      return { combined: [] };
    }

    const combined = [];

    hierarchicalResponse.hcc_groups.forEach((hccGroup) => {
      // Create a legacy format entry for each HCC group
      const legacyEntry = {
        id: `hcc-${hccGroup.hcc_code}`,
        hcc_code: hccGroup.hcc_code,
        hcc_description: hccGroup.hcc_description,
        status: hccGroup.overall_status || "pending",
        type: hccGroup.type || "suspect",
        hcc_evidence: JSON.stringify(hccGroup.evidences || []),
        evidence_strength: this.calculateEvidenceStrength(hccGroup.evidences),
        // Map first evidence for ICD info (simplified)
        icd_code:
          hccGroup.evidences && hccGroup.evidences.length > 0
            ? [
                {
                  code: hccGroup.evidences[0].icd_code,
                  description: hccGroup.evidences[0].icd_description,
                },
              ]
            : [],
        created_at_utc: new Date().toISOString(),
        updated_at_utc: new Date().toISOString(),
      };

      combined.push(legacyEntry);
    });

    return { combined };
  }

  /**
   * Calculate evidence strength based on confidence levels
   * @param {Array} evidences - Evidence items
   * @returns {string} Overall evidence strength
   */
  calculateEvidenceStrength(evidences) {
    if (!evidences || evidences.length === 0) return "low";

    const hasStrong = evidences.some(
      (e) => e.confidence_level === "strong" || e.confidence_level === "high"
    );
    const hasModerate = evidences.some(
      (e) =>
        e.confidence_level === "moderate" || e.confidence_level === "medium"
    );

    if (hasStrong) return "strong";
    if (hasModerate) return "moderate";
    return "low";
  }

  /**
   * Bulk update status of multiple HCC candidates with custom status per candidate
   * @param {Array<{item_id: string, status: string}>} updates - Array of evidence item updates
   * @param {string} changeReason - Optional reason for the changes
   * @param {string} notes - Optional additional notes
   * @returns {Promise} API response
   */
  async bulkUpdateStatus(updates, changeReason = null, notes = null) {
    try {
      const token = localStorage.getItem("accessToken");

      // Transform updates to use item_id for individual evidence updates
      const transformedUpdates = updates.map((update) => ({
        item_id:
          update.item_id || update.risk_adjustment_id || update.candidate_id, // Support multiple formats for backward compatibility
        status: update.status,
      }));

      const requestBody = {
        updates: transformedUpdates,
      };

      if (changeReason) {
        requestBody.change_reason = changeReason;
      }

      if (notes) {
        requestBody.notes = notes;
      }

      const response = await fetch(
        `${VITE_RISK_API_BASE_URL}/hcc-risk-adjustments/bulk-update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok)
        throw new Error("Failed to bulk update candidate status");
      return await handleApiResponse(response);
    } catch (error) {
      console.error("Error in bulkUpdateStatus:", error);
      throw error;
    }
  }

  /**
   * Get ALL HCC risk adjustments for a patient (no status filter)
   * @param {string} patientId - Patient ID
   * @param {string} period - Year period (YYYY format, optional)
   * @param {number} limit - Maximum records to return (default: 1000)
   * @param {number} offset - Records to skip (default: 0)
   * @returns {Promise} API response with hierarchical HCC candidates data (all statuses)
   */
  async getHccCandidatesByPatientAllStatuses(
    patientId,
    period = null,
    limit = 1000,
    offset = 0
  ) {
    try {
      const token = localStorage.getItem("accessToken");

      const requestBody = {
        patient_id: patientId,
        limit,
        offset,
      };

      if (period) {
        requestBody.period = period;
      }

      const response = await fetch(
        `${VITE_RISK_API_BASE_URL}/hcc-risk-adjustments/by-patient-all-statuses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || "Failed to fetch HCC candidates";
        throw new Error(errorMessage);
      }
      return await handleApiResponse(response);
    } catch (error) {
      console.error(
        "Error fetching HCC candidates by patient (all statuses):",
        error
      );
      throw error;
    }
  }
}

export default new HccCandidatesService();
