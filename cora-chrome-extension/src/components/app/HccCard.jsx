import React, { useState } from "react";
import upArrow from "../../../public/asset/images/arrows/up.svg";
import downArrow from "../../../public/asset/images/arrows/down.svg";
import CustomModal from "./common/CustomModal";
import closeIcon from "../../../public/asset/images/close.svg";
import CustomSelect from "./common/CustomSelect";
import HccRiskService from "../../api/HccRiskService";
import { toast } from "react-toastify";

export const HccCard = ({ hccRisk, fetchHccRisks }) => {
  const [detailsVisible, setDetailsVisible] = useState(
    // hccRisk?.status !== "rejected"
    false
  );
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleArrowClick = () => {
    setDetailsVisible((prev) => !prev);
  };

  // Parse the hcc_evidence JSON string to an array of evidence objects
  const parseEvidences = () => {
    try {
      if (!hccRisk?.hcc_evidence) return [];
      return JSON.parse(hccRisk.hcc_evidence);
    } catch (error) {
      console.error("Error parsing HCC evidence:", error);
      return [];
    }
  };

  const evidences = parseEvidences();

  /**
   * Get status color for risk cards
   * @param {string} status - Risk status
   * @returns {string} - Color value
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#52c41a";
      case "rejected":
        return "#ff4d4f";
      case "pending":
      default:
        return "#faad14";
    }
  };

  /**
   * Get status display text
   * @param {string} status - Risk status
   * @returns {string} - Display text
   */
  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "active":
        return "Pending";
      case "pending":
      default:
        return "Pending";
    }
  };

  /**
   * Get evidence strength color and text
   * @param {string} strength - Evidence strength or confidence level
   * @returns {Object} - Color and display text
   */
  const getEvidenceStrengthStyle = (strength) => {
    switch (strength?.toLowerCase()) {
      case "strong":
      case "high":
        return {
          backgroundColor: "#52c41a",
          color: "white",
          text: "Strong",
        };
      case "moderate":
      case "medium":
      case "mid":
        return {
          backgroundColor: "#faad14",
          color: "white",
          text: "Moderate",
        };
      case "low":
      case "weak":
      default:
        return {
          backgroundColor: "#ff4d4f",
          color: "white",
          text: "Low",
        };
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      const response = await HccRiskService.rejectHccRisk(
        hccRisk?.id,
        rejectionReason,
        rejectionNotes
      );
      fetchHccRisks();
      console.log("HCC rejected:", response);
      toast.success("HCC rejected successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject HCC");
    } finally {
      setLoading(false);
      setShowRejectModal(false);
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      const response = await HccRiskService.approveHccRisk(hccRisk?.id);
      fetchHccRisks();
      console.log("HCC accepted:", response);
      toast.success("HCC accepted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept HCC");
    } finally {
      setLoading(false);
      setShowAcceptModal(false);
    }
  };

  return (
    <div
      className="diagnosis-hcc-card-container"
      // style={{margin:"1rem 0rem ",height:"10rem",  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" ,padding:"1rem"   }}
    >
      <div className="heading-text" style={{ color: "#145DA0" }}>
        {hccRisk?.hcc_code}: {hccRisk?.hcc_description}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          margin: "0.5rem 0rem",
        }}
      >
        <span
          style={{
            backgroundColor: getStatusColor(hccRisk?.status),
            color: "white",
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: "500",
          }}
        >
          {getStatusText(hccRisk?.status)}
        </span>
        <span
          style={{
            backgroundColor: getEvidenceStrengthStyle(
              hccRisk?.evidence_strength
            ).backgroundColor,
            color: getEvidenceStrengthStyle(hccRisk?.evidence_strength).color,
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: "500",
          }}
        >
          {getEvidenceStrengthStyle(hccRisk?.evidence_strength).text} Evidence
        </span>
      </div>
      <div className="diagnosis-hcc-card-header">
        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
          {hccRisk?.icd_code}
        </div>
        <img
          className="diagnosis-hcc-card-header-arrow"
          src={detailsVisible ? upArrow : downArrow}
          alt={detailsVisible ? "up arrow" : "down arrow"}
          style={{ cursor: "pointer" }}
          onClick={handleArrowClick}
        />
      </div>
      {detailsVisible && (
        <div
          style={{
            padding: "1rem 0rem",
          }}
          className="small-text"
        >
          <div>
            <div>
              <span style={{ fontWeight: "bold" }}>Evidence:</span>
            </div>
          </div>
          {evidences.length > 0 ? (
            evidences.map((evidence, index) => (
              <div key={`evidence-${index}`} style={{ marginBottom: "1rem" }}>
                <div>
                  <span style={{ fontWeight: "bold" }}>{index + 1})</span>{" "}
                  <span>{evidence.notes}</span>
                </div>
                <div
                  style={{
                    backgroundColor: getEvidenceStrengthStyle(
                      evidence.confidence_level
                    ).backgroundColor,
                    color: getEvidenceStrengthStyle(evidence.confidence_level)
                      .color,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                    fontSize: "0.8rem",
                    marginTop: "4px",
                  }}
                >
                  {getEvidenceStrengthStyle(evidence.confidence_level).text}
                </div>
              </div>
            ))
          ) : (
            <div>No evidence available</div>
          )}
        </div>
      )}
      {(hccRisk?.status === "pending" ||
        hccRisk?.status === "active" ||
        !hccRisk?.status) && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="cora-button"
            // loading={cardLoadingStates.get(item.id) === "accepting"}
            // onClick={() => handleAccept(item.id)}
            onClick={() => setShowAcceptModal(true)}
          >
            Accept
          </button>
          <button
            className="cora-normal-button"
            onClick={() => setShowRejectModal(true)}
          >
            Reject
          </button>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <CustomModal>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "1rem" }}>
                <h3 style={{ marginTop: 0, color: "#145DA0" }}>
                  Please provide rationale if you would like to edit or reject
                  this suggestion:
                </h3>
                <img
                  src={closeIcon}
                  alt="close"
                  style={{ cursor: "pointer", width: "1rem", height: "1rem" }}
                  onClick={() => setShowRejectModal(false)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexDirection: "column",
                }}
              >
                <h4>Rejection reason:</h4>
                <CustomSelect
                  placeholder="Select a reason"
                  options={[
                    {
                      value: "insufficient_evidence",
                      label: "Insufficient evidence",
                    },
                    {
                      value: "irrelevant_evidence",
                      label: "Irrelevant evidence",
                    },
                    {
                      value: "duplicate_suggestion",
                      label: "Duplicate/overlapping suggestion",
                    },
                    {
                      value: "historical_condition",
                      label: "Historical/resolved condition",
                    },
                    {
                      value: "coding_error",
                      label: "Coding error",
                    },
                    {
                      value: "other",
                      label: "Other",
                    },
                  ]}
                  value={rejectionReason}
                  onChange={(value) => setRejectionReason(value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <h4>Rejection notes:</h4>
                <textarea
                  placeholder="Enter rejection notes"
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    resize: "vertical",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  className="cora-text-button"
                  onClick={() => setShowRejectModal(false)}
                  style={{ padding: "8px 16px" }}
                >
                  Cancel
                </button>
                <button
                  className="cora-normal-button"
                  disabled={!rejectionReason}
                  onClick={() => {
                    // Add your rejection logic here
                    handleReject();
                  }}
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                  }}
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </CustomModal>
      )}
      {showAcceptModal && (
        <CustomModal>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "1rem",justifyContent:"space-between" }}>
                <h3 style={{ marginTop: 0, color: "#145DA0" }}>
                  Are you sure you want to accept this HCC risk?
                </h3>
                <img
                  src={closeIcon}
                  alt="close"
                  style={{ cursor: "pointer", width: "1rem", height: "1rem" }}
                  onClick={() => setShowAcceptModal(false)}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  className="cora-text-button"
                  onClick={() => setShowAcceptModal(false)}
                  style={{ padding: "8px 16px" }}
                >
                  Cancel
                </button>
                <button
                  className="cora-normal-button"
                  onClick={() => {
                    // Add your rejection logic here
                    handleAccept();
                  }}
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                  }}
                >
                  Accept
                </button>
              </div>
            </>
          )}
        </CustomModal>
      )}
    </div>
  );
};
