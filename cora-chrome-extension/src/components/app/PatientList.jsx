import React from "react";
import leftArrow from "../../../public/asset/images/arrows/left.svg";
import rightArrow from "../../../public/asset/images/arrows/right.svg";
export const PatientList = ({
  patients,
  hasSearched,
  totalPatients,
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  handlePatientClick,
}) => {
  return (
    <div>
      {patients && patients.length > 0 ? (
        patients.map((patient, index) => (
          <div
            key={index}
            className="patient-card"
            style={{
              padding: "0.5rem",
              margin: "0.5rem 0",
              border: "1px solid #eee",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
            onClick={() => handlePatientClick(patient.id)}
          >
            <div className="small-text">
              <strong>Name:</strong>{" "}
              {`${patient.first_name} ${patient.last_name}` || "N/A"}
            </div>
            <div className="small-text">
              <strong>Coded RAF:</strong> {patient.coded_risk_factor || "-"}
            </div>
            <div className="small-text">
              <strong>Last RAF:</strong> {patient.last_risk_factor || "-"}
            </div>
            <div className="small-text">
              <strong>Next Appointment:</strong>{" "}
              {patient.next_appointment || "-"}
            </div>
          </div>
        ))
      ) : hasSearched ? (
        <div>No patients found</div>
      ) : null}

      {totalPatients > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="cora-text-button"
              style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <img
                  src={leftArrow}
                  alt="left arrow"
                  style={{ width: "1rem", height: "1rem" }}
                />
              
              </div>
            </button>
            <div style={{ display: "block", whiteSpace: "nowrap" }}>
              {currentPage} of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="cora-text-button"
              style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <img
                  src={rightArrow}
                  alt="left arrow"
                  style={{ width: "1rem", height: "1rem" }}
                />
              
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
