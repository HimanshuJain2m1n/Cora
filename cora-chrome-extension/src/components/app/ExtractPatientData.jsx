import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../../public/asset/styles/app-style.css";
import { fetchPatients } from "../../api/patient";
import SuspectedCodes from "./clinicalNote/SuspectedCodes";

export const ExtractPatientData = () => {
  const [patientId, setPatientId] = useState(null);
  // const navigate = useNavigate();
  // Function to inject script into the active tab
  const handleLogBody = () => {
    if (!chrome?.tabs || !chrome?.scripting) {
      alert("chrome.tabs or chrome.scripting API not available");
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          // Send the body data to the extension (popup)
          chrome.runtime.sendMessage({
            type: "PAGE_BODY",
            body: document.body.innerHTML,
          });
        },
      });
    });
  };

  useEffect(() => {
    // Listen for messages from the content script
    const handler = (message, sender, sendResponse) => {
      if (message.type === "PAGE_BODY") {
        console.log("Body data from page:", message.body);
        // Optionally, display in the UI
        setBodyData(message.body);
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => {
      chrome.runtime.onMessage.removeListener(handler);
    };
  }, []);

  const [bodyData, setBodyData] = useState("");
  const [patientDetail, setPatientDetail] = useState({
    name: "",
    firstName: "",
    lastName: "",
    dob: "",
    phoneNo: "",
  });

  const findExactMatch = () => {
    try {
      // Convert date from "Aug 8, 1915" format to "yyyy-mm-dd"
      let formattedDate = "";
      if (patientDetail.dob && patientDetail.dob !== "Patient DOB not found.") {
        // Parse the date and handle timezone issues
        const dateStr = patientDetail.dob;
        const dateParts = dateStr.split(" ");

        if (dateParts.length >= 3) {
          const month = dateParts[0]; // e.g., "Aug"
          const day = parseInt(dateParts[1].replace(",", "")); // e.g., "8" from "8,"
          const year = parseInt(dateParts[2]); // e.g., "1915"

          // Map month names to month numbers
          const monthMap = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };

          if (monthMap[month] !== undefined && !isNaN(day) && !isNaN(year)) {
            // Create date with local timezone
            const date = new Date(year, monthMap[month], day);

            // Format as YYYY-MM-DD without timezone conversion
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
            const dd = String(date.getDate()).padStart(2, "0");

            formattedDate = `${yyyy}-${mm}-${dd}`;
            console.log(
              "Original date:",
              dateStr,
              "Formatted date:",
              formattedDate
            );
          }
        }
      }

      console.log("Searching for patient with:", {
        firstName: patientDetail.firstName,
        lastName: patientDetail.lastName,
        dob: formattedDate,
      });

      // Call the API with page 1, pageSize 10, empty search query, and exact match parameters
      fetchPatients(
        null,
        null,
        null,
        patientDetail.firstName,
        patientDetail.lastName,
        formattedDate
      )
        .then((response) => {
          console.log("Exact match search response:", response);
          // Navigate to patient detail page if exactly one match is found
          if (
            response &&
            response.total === 1 &&
            response.patients &&
            response.patients.length === 1
          ) {
            const patientId = response.patients[0].id;
            // navigate(`/patient/${patientId}`);
            setPatientId(patientId)
          } else if (response && response.total > 1) {
            console.log("Multiple matches found:", response.total);
            setInputError(
              "Multiple patient matches found. Please refine your search."
            );
          } else if (response && response.total === 0) {
            setInputError("No matching patients found.");
          }
        })
        .catch((error) => {
          console.error("Error finding exact match:", error);
          setInputError("Failed to find exact match: " + error.message);
        });
    } catch (error) {
      console.error("Error in findExactMatch function:", error);
      setInputError("Error processing request: " + error.message);
    }
  };

  useEffect(() => {
    if (bodyData) {
      // Parse the HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(bodyData, "text/html");
      // Try to find a span with class 'patient-identifier-span'
      const spanPatientIdentifier = doc.querySelector(
        "span.patient-identifier-span"
      );
      let phoneNo = "";
      const spanPhoneNo = doc.querySelector(
        'span[ng-bind="PatientHubInfo.homePhone"]'
      );
      if (spanPhoneNo) {
        phoneNo = spanPhoneNo.textContent || spanPhoneNo.innerHTML;
      } else {
        // Fallback: look for #collapseData and get the second <font> tag's text
        const collapseDiv = doc.querySelector("#collapseData");
        if (collapseDiv) {
          const fontTags = collapseDiv.querySelectorAll("font");
          if (
            fontTags.length > 1 &&
            fontTags[0].textContent &&
            fontTags[0].textContent.trim().toLowerCase().startsWith("phone")
          ) {
            phoneNo = fontTags[1].textContent || fontTags[1].innerHTML;
          } else {
            phoneNo = "Patient phone number not found.";
          }
        } else {
          phoneNo = "Patient phone number not found.";
        }
      }

      console.log(spanPatientIdentifier);
      if (spanPatientIdentifier) {
        const text =
          spanPatientIdentifier.textContent || spanPatientIdentifier.innerHTML;
        // Extract name (before 🎂)
        const nameMatch = text.split("🎂")[0]?.trim();

        // Break down the name into first name and last name
        let firstName = "";
        let lastName = "";

        if (nameMatch) {
          // Format is "LASTNAME, Firstname"
          const nameParts = nameMatch.split(",");
          if (nameParts.length > 1) {
            lastName = nameParts[0].trim();
            firstName = nameParts[1].trim();
          } else {
            // If there's no comma, use the whole string as the name
            lastName = nameMatch;
          }
        }

        // Extract birthdate (after 🎂 and before '(' )
        let dobMatch = "";
        const dobRegex = /🎂\s*([^\(📁]*)/;
        const dobResult = text.match(dobRegex);
        if (dobResult && dobResult[1]) {
          dobMatch = dobResult[1].trim();
        }
        setPatientDetail({
          name: nameMatch || "Patient name not found.",
          firstName: firstName || "",
          lastName: lastName || "",
          dob: dobMatch || "Patient DOB not found.",
          phoneNo: phoneNo,
        });
      } else {
        setPatientDetail({
          name: "Patient details not found.",
          firstName: "",
          lastName: "",
          dob: "Patient DOB not found.",
          phoneNo: "Patient phone number not found.",
        });
      }
    }
  }, [bodyData]);

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  return (
    <>
      <div className="diagnosis-hcc-header">Extract Patient Data​</div>
      <div style={{}}>
        <button
          className="cora-button"
          onClick={() => {
            handleLogBody();
          }}
        >
          Find Patient Data
        </button>
      </div>

      {patientDetail.name === "Patient details not found." ? (
        <div style={{ color: "red", fontWeight: "bold" }}>No data found</div>
      ) : (
        patientDetail.name && patientDetail.dob && <>{findExactMatch()}</>
      )}
      {inputError && (
        <div style={{ color: "red", fontWeight: "bold" }}>{inputError}</div>
      )}

      <SuspectedCodes patientId={patientId} />
    </>
  );
};
