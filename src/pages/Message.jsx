import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import { messageAPI, sendmessageAPI } from "../server/allApi"; // Ensure correct API import
import { Link } from "react-router-dom";

export default function Message() {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(null);

  const fetchMessageData = async () => {
    setLoading(true);
    try {
      const response = await messageAPI();
      console.log("📥 Updated expired users list:", response.data);

      if (!response.data || response.data.length === 0) {
        setDetails([]);
        setError("No records found.");
      } else {
        // ✅ Ensure correct format of `uptoDate`
        const formattedData = response.data.map((item) => ({
          ...item,
          uptoDate: formatDate(item.uptoDate),
        }));
        setDetails(formattedData);
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError("Failed to fetch user details.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessageData();
  }, []);

  // Function to send WhatsApp messages
  const sendMessages = async () => {
    console.log("📤 Users to send:", details);

    if (details.length === 0) {
      setError("No users to send messages to.");
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await sendmessageAPI({ users: details });

      console.log("📩 API Response:", response);

      if (!response || !response.data) {
        throw new Error("Invalid API response");
      }

      setDetails((prevDetails) =>
        prevDetails.map((user) => ({
          ...user,
          verified: true, // ✅ Mark users as verified
        }))
      );

      setSuccess(response.data.message || "Messages sent successfully!");
    } catch (err) {
      console.error("❌ Error sending messages:", err);
      setError(err.response?.data?.error || "Failed to send messages.");
    }

    setSending(false);
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="container mt-4 p-4 bg-white shadow-lg rounded">
      <h3 className="text-center text-primary mb-4 fw-bold">📋 Today's List</h3>
      <Link to={"/"}>
        <Button>Back</Button>
      </Link>

      {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {!loading && !error && details.length === 0 && (
        <p className="text-center text-muted">No records found.</p>
      )}

      {!loading && !error && details.length > 0 && (
        <div className="table-responsive">
          <Table className="table-custom">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Vehicle No</th>
                <th>Mobile</th>
                <th>Up-to-date</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.vehicleNo}</td>
                  <td>{item.mobile}</td>
                  <td>{item.uptoDate}</td>
                  <td>
                    <span className={`badge ${item.verified ? "bg-success" : "bg-danger"}`}>
                      {item.verified ? "✔ Yes" : "✖ No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center mt-4">
            <Button className="d-flex align-items-center" onClick={sendMessages} disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>
        {`
          .table-custom {
            width: 100%;
            border-collapse: collapse;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          }

          .table-custom thead {
            background: linear-gradient(45deg, #007bff, #0056b3);
            color: white;
            font-weight: bold;
          }

          .table-custom tbody tr {
            transition: all 0.3s ease-in-out;
          }

          .table-custom tbody tr:hover {
            background-color: rgba(0, 123, 255, 0.1);
            transform: scale(1.02);
          }

          .badge {
            font-size: 0.9rem;
            padding: 6px 12px;
            border-radius: 8px;
          }
        `}
      </style>
    </div>
  );
}
