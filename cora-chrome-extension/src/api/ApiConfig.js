import { VITE_AUTH_API_BASE_URL, VITE_ADMIN_API_BASE_URL, VITE_CONFIGURATOR_BASE_URL, VITE_RISK_API_BASE_URL, VITE_API_BASE_URL } from "./apiUrls";
/**
 * API Configuration File
 * Centralizes API endpoints and configuration
 */

// Export API base URLs from environment variables
export const AUTH_API_BASE_URL = VITE_AUTH_API_BASE_URL;
export const ADMIN_API_BASE_URL = VITE_ADMIN_API_BASE_URL;
export const CONFIGURATOR_BASE_URL = VITE_CONFIGURATOR_BASE_URL;
export const RISK_API_BASE_URL = VITE_RISK_API_BASE_URL
export const API_BASE_URL = VITE_API_BASE_URL;

// API endpoints - Auth Service
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  LOGOUT_ALL: "/auth/logout/all",
  REFRESH_TOKEN: "/auth/refresh-token",
  REGISTER: "/auth/register",
};

// API endpoints - Admin Service
export const ADMIN_ENDPOINTS = {
  ORGANIZATIONS: {
    LIST: "/organizations/list",
    GET: (id) => `/organizations/${id}`,
    CREATE: "/organizations/create",
    UPDATE: (id) => `/organizations/update/${id}`,
    DELETE: (id) => `/organizations/delete/${id}`,
    DEACTIVATE: (id) => `/organizations/deactivate/${id}`,
    ALLOWED_USERS: {
      LIST: "/organizations/allowed-users/list",
      ADD: "/organizations/allowed-users/add",
      REMOVE: "/organizations/allowed-users/remove",
    },
    CONFIGURATIONS: {
      LIST: (id) => `/organizations/configurations/${id}`,
      CREATE: "/organizations/configurations/create",
      UPDATE: "/organizations/configurations/update",
      DELETE: (id, attrName) =>
        `/organizations/configurations/delete/${id}/${attrName}`,
    },
    LOCATIONS: {
      LIST: (organizationId) => `/organizations/locations/${organizationId}`,
      CREATE: "/organizations/locations/create",
      GET: (locationId) => `/organizations/locations/${locationId}`,
      UPDATE: (locationId) => `/organizations/locations/update/${locationId}`,
      DELETE: (locationId) => `/organizations/locations/delete/${locationId}`,
    },
    BASIC_DATA: {
      COUNTRIES: "/organizations/basic-data/countries",
      STATES: "/organizations/basic-data/states",
    },
  },
  ACCOUNTS: {
    LIST: "/accounts/list",
    GET: (id) => `/accounts/${id}`,
    CREATE: "/accounts/create",
    UPDATE: (id) => `/accounts/update/${id}`,
    DELETE: (id) => `/accounts/delete/${id}`,
    DEACTIVATE: (id) => `/accounts/deactivate/${id}`,
    ACTIVATE: (id) => `/accounts/activate/${id}`,
    REMOVE_USER: (accountId, userId) => `/accounts/${accountId}/users/${userId}/remove`,
    SETTINGS: {
      LIST: (id) => `/accounts/${id}/settings`,
      CREATE: (id) => `/accounts/${id}/settings`,
      UPDATE: (id, name) => `/accounts/${id}/settings/${name}`,
      DELETE: (id, name) => `/accounts/${id}/settings/${name}`
    }
  },
  USERS: {
    LIST: "/users/list",
    GET: (id) => `/users/${id}`,
    CREATE: "/users/create",
    UPDATE: (id) => `/users/update/${id}`,
    DELETE: (id) => `/users/delete/${id}`,
    ACTIVATE: (id) => `/users/activate/${id}`,
    DEACTIVATE: (id) => `/users/deactivate/${id}`,
    RESET_PASSWORD: (id) => `/users/reset-password/${id}`,
    UPDATE_PASSWORD: (id) => `/users/update-password/${id}`,
    RESET_PASSWORD_WITH_TOKEN: "/users/reset-password",
    COMPLETE_RESET_PASSWORD: (id) => `/users/complete-reset/${id}`,
    RESET_TOKEN: (token) => `/users/reset-token/${token}`,
    FORGOT_PASSWORD: "/users/forgot-password",
    VALIDATE_RESET_TOKEN: (token) => `/users/validate-reset-token/${token}`,
    REGISTER_WITH_INVITE: "/users/register-with-invite",
  },
  INVITES: {
    CREATE: "/invites/create",
    BATCH_CREATE: "/invites/batch",
    VALIDATE_TOKEN: (token) => `/invites/validate-token/${token}`,
    RESEND: (id) => `/invites/resend/${id}`,
  },
  SUSPECT_EVIDENCES: {
    LIST: "/suspect-evidences/list",
    GET: (id) => `/suspect-evidences/${id}`,
    CREATE: "/suspect-evidences/create",
    UPDATE: (id) => `/suspect-evidences/update/${id}`,
    DELETE: (id) => `/suspect-evidences/delete/${id}`,
    REJECT: (id) => `/suspect-evidences/reject/${id}`,
    PUBLISH: (id) => `/suspect-evidences/publish/${id}`,
    DUPLICATE: (id) => `/suspect-evidences/duplicate/${id}`
  },
  PAYORS: {
    LIST: "/payors/list",
    GET: (id) => `/payors/${id}`,
    CREATE: "/payors/create",
    UPDATE: (id) => `/payors/update/${id}`,
    DELETE: (id) => `/payors/delete/${id}`,
  },
  PROVIDERS: {
    LIST: "/providers/list",
    GET: (id) => `/providers/${id}`,
    CREATE: "/providers/create",
    UPDATE: (id) => `/providers/update/${id}`,
    DELETE: (id) => `/providers/delete/${id}`,
  },
  EMR_INTEGRATION_MAPPINGS: {
    LIST: "/emr-integration-mappings/list",
    GET: (id) => `/emr-integration-mappings/${id}`,
    CREATE: "/emr-integration-mappings/create",
    UPDATE: (id) => `/emr-integration-mappings/update/${id}`,
    DELETE: (id) => `/emr-integration-mappings/delete/${id}`,
  },
  FILES: {
    PRESIGNED_URL: "/files/presigned-url",
    CONFIRM_UPLOAD: "/files/confirm-upload",
  },
  SYSTEM: {
    CONFIG: "/system/configs",
    UPDATE_CONFIG: "/system/configs/update",
  },
};

// API endpoints - Patient/Risk Service
export const PATIENT_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
  },
  PATIENTS: {
    LIST: "/patients/list",
    GET: (id) => `/patients/retrieve/${id}`,
    SEND_EMAIL: "/patients/send-email",
    SET_MANAGED_CARE: "/patients/set-managed-care",
    ASSIGN_PCP: "/patients/assign-primary-care-provider",
    ENCOUNTERS: {
      LIST: (patientId) => `/patients/encounters/${patientId}/encounters/list`,
    },
    ALLERGIES: {
      LIST: (patientId) => `/patients/allergies/${patientId}/allergies/list`,
      GET: (patientId, allergyId) => `/patients/allergies/${patientId}/allergies/retrieve/${allergyId}`,
    },
    CAREPLANS: {
      LIST: (patientId) => `/patients/careplans/${patientId}/careplans/list`,
      GET: (patientId, careplanId) => `/patients/careplans/${patientId}/careplans/retrieve/${careplanId}`,
    },
    COVERAGE: {
      LIST: (patientId) => `/patients/coverages/${patientId}/coverages/list`,
      GET: (patientId, coverageId) => `/patients/coverages/${patientId}/coverages/retrieve/${coverageId}`,
    },
    DIAGNOSIS: {
      LIST: (patientId) => `/patients/diagnoses/${patientId}/diagnoses/list`,
      GET: (patientId, diagnosisId) => `/patients/diagnoses/${patientId}/diagnoses/retrieve/${diagnosisId}`,
    },
    MEDICATIONS: {
      LIST: (patientId) => `/patients/medications/${patientId}/medications/list`,
      GET: (patientId, medicationId) => `/patients/medications/${patientId}/medications/retrieve/${medicationId}`,
    },
    VITALS: {
      LIST: (patientId) => `/patients/vitals/${patientId}/vitals/list`,
      GET: (patientId, vitalId) => `/patients/vitals/${patientId}/vitals/retrieve/${vitalId}`,
      BY_TYPE: (patientId) => `/patients/vitals/${patientId}/vitals/by-type`,
    },
    REFERRALS: {
      LIST: (patientId) => `/patients/referrals/${patientId}/referrals/list`,
      GET: (patientId, referralId) => `/patients/referrals/${patientId}/referrals/retrieve/${referralId}`,
      BY_SPECIALTY: (patientId) => `/patients/referrals/${patientId}/referrals/by-specialty`,
    },
    CLAIMS: {
      LIST: (patientId) => `/patients/claims/${patientId}/claims/list`,
      GET: (patientId, claimId) => `/patients/claims/${patientId}/claims/retrieve/${claimId}`,
      BY_SPECIALTY: (patientId) => `/patients/claims/${patientId}/claims/by-specialty`,
    },
    DOCUMENTS: {
      LIST: (patientId) => `/patients/documents/${patientId}/documents/list`,
      GET: (patientId, documentId) => `/patients/documents/${patientId}/documents/retrieve/${documentId}`,
      VIEW: (patientId, documentId) => `/patients/documents/${patientId}/documents/view/${documentId}`,
      DOWNLOAD: (patientId, documentId) => `/patients/documents/${patientId}/documents/download/${documentId}`,
    },
    LAB_RESULTS: {
      LIST: (patientId) => `/patients/lab-results/${patientId}/lab-results/list`,
      GET: (patientId, labId) => `/patients/lab-results/${patientId}/lab-results/retrieve/${labId}`,
      BY_CATEGORY: (patientId) => `/patients/lab-results/${patientId}/lab-results/by-category`,
    },
  },
  // HCC Evidences endpoints
  HCC_EVIDENCES: {
    GROUPED_BY_PATIENT: "/hcc-evidences/grouped-by-patient",
    BY_PATIENT: "/hcc-evidences/by-patient",
    BY_EXECUTION: "/hcc-evidences/by-execution",
    CREATE: "/hcc-evidences/create",
    CREATE_MULTIPLE: "/hcc-evidences/create-multiple",
    GET: (id) => `/hcc-evidences/${id}`,
    DELETE_BY_EXECUTION: (executionId) => `/hcc-evidences/delete-by-execution/${executionId}`,
    EVIDENCE_DETAILS: "/hcc-evidences/evidence-details",
  },
  // HCC Risk endpoints
  HCC_RISK: {
    BY_PATIENT_BATCH: "/hcc-risk/by-patient-batch",
    UPDATE_STATUS: "/hcc-risk/update-status",
    BULK_UPDATE_STATUS: "/hcc-risk/bulk-update-status",
    PATIENT_BATCHES: "/hcc-risk/patient-batches",
    LATEST_BATCH: (patientId) => `/hcc-risk/latest-batch/${patientId}`,
    GET: (hccRiskId) => `/hcc-risk/${hccRiskId}`,
  },
  SCHEDULE: {
    AVAILABLE_SLOTS: (patientId) => `/schedule/available-slots/list/${patientId}`,
    CREATE_APPOINTMENT: (patientId) => `/schedule/appointment/create/${patientId}`,
  },
  INSURANCE: {
    GET_BY_PATIENT: "/api/patient-coverage/",
  },

};

export const CONFIGURATOR_ENDPOINTS = {
  CONFIGURATOR: {
    GET_HCCS: "/configurators/suspected-hcc-code/{patient_id}",
  },
};

// Response handling utilities
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    try {
      const errorData = JSON.parse(text);
      throw new Error(
        errorData.detail || errorData.message || "API request failed"
      );
    } catch (e) {
      throw new Error(`API request failed: ${text || response.statusText}`);
    }
  }

  return response.json();
};
