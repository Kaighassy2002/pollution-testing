import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { detailsAPI } from "../server/allApi";
import { Link } from "react-router-dom";

function FilteredResults() {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (startDate && endDate) {
      fetchAndFilterData();
    }
  }, [startDate, endDate]);

  const fetchAndFilterData = async () => {
    setLoading(true);
    try {
      const response = await detailsAPI();
      const fetchedData = response?.data || [];

      const startTimestamp = new Date(startDate).getTime();
      const endTimestamp = new Date(endDate).getTime();

      const filtered = fetchedData.filter((detail) => {
        if (!detail.validDate || isNaN(new Date(detail.validDate).getTime())) {
          return false; // Ignore invalid dates
        }

        const validTimestamp = new Date(detail.validDate).getTime();
        return validTimestamp >= startTimestamp && validTimestamp <= endTimestamp;
      });

      setFilteredData(filtered);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated function to display "Fail" if the value is "Failed"
  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date === "Failed") return "Fail"; // Show "Fail" instead of "Failed"
    return new Date(date).toLocaleDateString("en-GB");
  };

  // ✅ Fixed total rate calculation
  const totalRate = filteredData.reduce((sum, detail) => {
    const rate = parseFloat(detail.rate) || 0; // Convert to number, handle NaN
    return sum + rate;
  }, 0);

  // ✅ Print Function (Fixed)
  const handlePrint = () => {
    const printableContent = document.getElementById("printable-area").innerHTML;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>
          <h4 class="text-center">Filtered Vehicle Details</h4>
          ${printableContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500); // Allow time for rendering
  };

  return (
    <div className="mt-5 container">
      <h4 className="text-center mb-3">Filtered Vehicle Details</h4>
      <Link to={'/'}> <Button>Back</Button> </Link>

      {/* Date Selection Form */}
      <div className="d-flex justify-content-center mb-4">
        <Form.Group className="mx-2">
          <Form.Label>Start Date:</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate || ""}
          />
        </Form.Group>

        <Form.Group className="mx-2">
          <Form.Label>End Date:</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || ""}
          />
        </Form.Group>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <>
          {/* ✅ Wrapped Table for Printing */}
          <div id="printable-area">
            <Table striped bordered hover responsive className="table-custom">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Vehicle No</th>
                  <th>Mobile No</th>
                  <th>Valid Date</th>
                  <th>Upto Date</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((detail, index) => (
                    <tr key={detail.id || index}>
                      <td>{index + 1}</td>
                      <td>{detail.vehicleNo}</td>
                      <td>{detail.mobile}</td>
                      <td>{formatDate(detail.validDate)}</td>
                      <td>{formatDate(detail.uptoDate)}</td>
                      <td>₹{parseFloat(detail.rate).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-danger">No records found</td>
                  </tr>
                )}
              </tbody>
            </Table>

            <h5 className="text-center mt-4">Total Sum of Rates: ₹{totalRate.toFixed(2)}</h5>
          </div>

          {/* Buttons */}
          <div className="text-center mt-3">
            <Button className="me-3" variant="primary" onClick={() => window.location.reload()}>Reset</Button>
            <Button  variant="secondary" onClick={handlePrint}>Print</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default FilteredResults;
