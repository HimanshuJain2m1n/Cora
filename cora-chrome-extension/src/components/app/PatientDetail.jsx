import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CoraAIContainer } from "./CoraAIContainer";
import { getPatientById } from "../../api/patient";
import { HccCard } from "./HccCard";
import leftArrow from "../../../public/asset/images/arrows/left.svg";
import HccRiskService from "../../api/HccRiskService";
import { toast } from "react-toastify";

export const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentBatchId, setCurrentBatchId] = useState(null);
  const [hccData, setHccData] = useState([]);
  const [hccError, setHccError] = useState("");
  const [hccLoading, setHccLoading] = useState(false);

  const fetchPatientDetails = async (patientId) => {
    try {
      setLoading(true);
      // Replace with your actual API call to fetch patient details
      const response = await getPatientById(patientId);
      setPatient(response);
      // toast.success("Patient details loaded successfully");
    } catch (err) {
      // setError("Failed to load patient details");
      toast.error("Failed to load patient details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHccRisks = async (patientId=id) => {
    try {
      setHccLoading(true);
      // Replace with your actual API call to fetch HCC risks
      const latestBatchResponse = await HccRiskService.getLatestBatchForPatient(
        patientId
      );

      if (!latestBatchResponse || !latestBatchResponse.latest_batch_id) {
        setHccData([]);
        setCurrentBatchId(null);
        return; // Don't show error message, just show empty state
      }

      const batchId = latestBatchResponse.latest_batch_id;
      setCurrentBatchId(batchId);

      // Get HCC risks for the latest batch
      const risksResponse = await HccRiskService.getHccRisksByPatientAndBatch(
        patientId,
        batchId,
        100,
        0
      );

      // const hccRisksData = risksResponse?.hcc_risks || [];
      // setHccData(hccRisksData);

      // console.log("API Response:", risksResponse);
      // console.log("HCC Risks from API:", hccRisksData);

      if (risksResponse && risksResponse.hcc_risks) {
        // Transform backend data to match UI structure
        const transformedData = risksResponse.hcc_risks.map((risk) => ({
          id: risk.id,
          hcc_code: risk.hcc_code,
          hcc_description: risk.hcc_description,
          status: risk.status || "pending",
          hcc_evidence: risk.hcc_evidence,
          evidence_strength: risk.evidence_strength || "low",
          icd_code: risk.icd_code,
          v24_risk_score: risk.v24_risk_score,
          current_mra: risk.current_mra,
          previous_mra: risk.previous_mra,
          run_datetime_utc: risk.run_datetime_utc,
          rejection_reason: risk.rejection_reason,
          rejection_notes: risk.rejection_notes,
          rejected_by: risk.rejected_by,
          rejected_date_utc: risk.rejected_date_utc,
        }));

        // Sort cards: pending/approved first, then rejected at bottom
        // Within each group, sort by evidence strength: strong -> moderate -> low
        const strengthOrder = { strong: 0, moderate: 1, low: 2 };
        const sortedData = transformedData.sort((a, b) => {
          // First sort by status (non-rejected vs rejected)
          const aIsRejected = a.status === "rejected" ? 1 : 0;
          const bIsRejected = b.status === "rejected" ? 1 : 0;

          if (aIsRejected !== bIsRejected) {
            return aIsRejected - bIsRejected;
          }

          // Within same status group, sort by evidence strength
          const orderA = strengthOrder[a.evidence_strength] ?? 3;
          const orderB = strengthOrder[b.evidence_strength] ?? 3;
          return orderA - orderB;
        });

        console.log("sortedData :", sortedData);
        setHccData(sortedData);
        


        // Auto-collapse rejected cards
        // const rejectedIds = new Set(
        //   sortedData
        //     .filter((risk) => risk.status === "rejected")
        //     .map((risk) => risk.id)
        // );
        // setCollapsedCards(rejectedIds);
      } else {
        setHccData([]);
      }

      // Note: hccData state won't be updated yet here
    } catch (err) {
      setHccError(err.message);
    } finally {
      setHccLoading(false);
    }
  };

  // This useEffect will run whenever hccData changes
  useEffect(() => {
    console.log("Updated hccData state:", hccData);
  }, [hccData]);

  useEffect(() => {
    fetchPatientDetails(id);
    fetchHccRisks(id);
  }, [id]);

  return (
    <CoraAIContainer showAvatar={true}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button
          onClick={() => navigate("/")}
          className="cora-text-button"
          style={{ alignSelf: "flex-start" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img
              src={leftArrow}
              alt="left arrow"
              style={{ width: "1rem", height: "1rem" }}
            />{" "}
            Back to Search
          </div>
        </button>

        <div className="heading-text">Patient Details</div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : patient ? (
          <div className="patient-details">
            <div className="small-text">
              <strong>ID:</strong> {patient.id}
            </div>
            <div className="small-text">
              <strong>Name:</strong>{" "}
              {`${patient.first_name} ${patient.last_name}`}
            </div>
            <div className="small-text">
              <strong>Date of Birth:</strong> {patient.date_of_birth}
            </div>
            {/* Add more patient details here */}
          </div>
        ) : (
          <div>Patient not found</div>
        )}

        {hccLoading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="spinner"></div>
          </div>
        ) : hccError ? (
          <div className="error-message">{hccError}</div>
        ) : (
          <>
            {/* <div className="heading-text">Suspected conditions​</div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                style={{ width: "80%", borderRadius: "65rem", padding: "1rem" }}
                type="text"
                placeholder="Search for HCC​"
              />
              <button className="cora-button">Search</button>
            </div> */}
            {hccData?.map((hccRisk) => (
              <HccCard
                key={hccRisk.id || `hcc-${Math.random()}`}
                hccRisk={hccRisk}
                fetchHccRisks={fetchHccRisks}
              />
            ))}
          </>
        )}
      </div>
    </CoraAIContainer>
  );
};
