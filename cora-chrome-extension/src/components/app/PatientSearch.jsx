import React from "react";
import { CoraAIContainer } from "./CoraAIContainer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExtractPatientData } from "./ExtractPatientData";
import { fetchPatients } from "../../api/patient";
import { PatientList } from "./PatientList";

export const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (page = currentPage) => {
    try {
      setLoading(true);
      setHasSearched(true);
      const response = await fetchPatients(page, pageSize, searchQuery);
      setPatients(response.patients || []);
      setTotalPatients(response.total || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalPatients / pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handleSearch(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handleSearch(currentPage - 1);
    }
  };

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <CoraAIContainer showAvatar={true} showSearch={false}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="heading-text">Patient Search</div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            style={{ width: "80%", borderRadius: "65rem", padding: "1rem" }}
            type="text"
            placeholder="Search based on name, email, number, ID, or appointment date​"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(1);
              }
            }}
          />
          <button onClick={() => handleSearch(1)} className="cora-button">
            Search
          </button>
        </div>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <PatientList
            patients={patients}
            hasSearched={hasSearched}
            totalPatients={totalPatients}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            handlePatientClick={handlePatientClick}
          />
        )}
      </div>
    </CoraAIContainer>
  );
};
