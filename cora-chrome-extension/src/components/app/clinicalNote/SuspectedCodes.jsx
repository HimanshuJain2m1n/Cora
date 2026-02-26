import { useEffect } from "react";
import { useState } from "react";
import HccCandidatesService from "../../../api/HccCandidatesService";
import {
  Row,
  Col,
  Card,
  Flex,
  Typography,
  Input,
  Select,
  Button,
  Spin,
  Modal,
  message,
  Checkbox,
} from "antd";
const { Text } = Typography;

const SuspectedCodes = ({ patientId }) => {
  const [hccData, setHccData] = useState([]);
  const [isSuspectLoading, setIsSuspectLoading] = useState(false);
  const [checkedEvidenceIds, setCheckedEvidenceIds] = useState(new Set());
  const [collapsedCards, setCollapsedCards] = useState(new Set());

  useEffect(() => {
    fetchHccRisks();
  }, [patientId]);

  const fetchHccRisks = async () => {
    try {
      setIsSuspectLoading(true);

      // Get HCC candidates for the current year using the new API
      // Filter by specific statuses as per requirements:
      // - pending: Coder still needs to work on this
      // - candidate: Coder accepted this
      // - rejected: Rejected by coder and/or doctor
      const currentYear = new Date().getFullYear().toString();
      const includeStatus = ["pending", "candidate", "rejected"];

      const candidatesResponse =
        await HccCandidatesService.getHccCandidatesByPatient(
          patientId,
          currentYear,
          100,
          0,
          includeStatus
        );

      console.log("HCC risk adjustments response:", candidatesResponse);

      if (candidatesResponse && candidatesResponse.hcc_groups) {
        // Data is already in hierarchical structure from the new API
        const hierarchicalData = candidatesResponse.hcc_groups;

        // Sort HCC groups: suspects first, then gaps, prioritize by HCC code
        const sortedData = hierarchicalData.sort((a, b) => {
          // Gaps go to bottom
          if (a.type === "gap" && b.type !== "gap") return 1;
          if (b.type === "gap" && a.type !== "gap") return -1;

          // For same type, sort by HCC code
          return a.hcc_code.localeCompare(b.hcc_code);
        });

        setHccData(sortedData);

        // Pre-populate checkedEvidenceIds with approved/accepted evidence IDs
        const approvedEvidenceIds = new Set();
        sortedData.forEach((hccGroup) => {
          hccGroup.evidences.forEach((evidence) => {
            if (
              evidence.status === "approved" ||
              evidence.status === "accepted" ||
              evidence.status === "candidate"
            ) {
              approvedEvidenceIds.add(evidence.id);
            }
          });
        });
        setCheckedEvidenceIds(approvedEvidenceIds);

        // Don't auto-collapse any cards - keep all expanded by default
        setCollapsedCards(new Set());
      } else {
        setHccData([]);
      }
    } catch (error) {
      console.error("Error fetching HCC risk adjustments:", error);
      // Only show error message if it's not a 404 (no data found)
      if (!error.message.includes("Failed to fetch HCC candidates")) {
        message.error("Failed to load HCC risk adjustments");
      }
      setHccData([]);
    } finally {
      setIsSuspectLoading(false);
    }
  };

  console.log(isSuspectLoading, checkedEvidenceIds, collapsedCards);

  return (
    <>
      <Card>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: "16px" }}
        >
          {isSuspectLoading ? (
            "loading HCCs ..."
          ) : (
            <>
              <div>
                <Text style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  HCC Risk Adjustments ({hccData.length})
                </Text>
              </div>
              {/* <Button
            type="primary"
            // icon={<FileTextOutlined />}
            // onClick={handlePrepPrevisitNote}
          >
            Preview
          </Button> */}
            </>
          )}
        </Flex>
      </Card>
    </>
  );
};

export default SuspectedCodes;
