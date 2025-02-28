import React, { useEffect, useState } from "react";
import { Button, InputGroup, Form, Table } from "react-bootstrap";
import { deleteAPI, detailsAPI } from "../server/allApi";
import Edit from "./Edit";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Detail() {
  const [searchTerm, setSearchTerm] = useState("");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15; // Number of records per page
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await detailsAPI();
        const fetchedData = response?.data || [];

        // Reverse order to show latest first
        setDetails([...fetchedData.reverse()]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user details.");
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  // Function to add new data dynamically
  const addNewRecord = (newRecord) => {
    setDetails((prevDetails) => [newRecord, ...prevDetails]);
  };

  // Function to update user details in state after editing
  const updateUserInState = (updatedUser) => {
    setDetails((prevDetails) =>
      prevDetails.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  // Apply search filter to the entire dataset BEFORE pagination
  const filteredData = details.filter(
    (detail) =>
      detail.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.mobile?.includes(searchTerm)
  );

  // Reset to the first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination Logic (applied AFTER filtering)
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Failed") return "Failed";
  
    const date = new Date(dateString);
  
    // If JavaScript fails to parse the date, return "Failed"
    if (isNaN(date)) return "Failed";
  
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };
  
  
  

  // Open edit modal with selected user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  const fetchVehicleData = async () => {
    try {
      const response = await detailsAPI();
      const fetchedData = response?.data || [];
  
      // Reverse order to show latest first
      setDetails([...fetchedData.reverse()]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch user details.");
      setLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchVehicleData();
  }, []);
  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteAPI(id);
        toast.info("Vehicle deleted successfully");
        fetchVehicleData(); 
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    }
  };
  

  

  return (
    <>
      <div className="mt-5">
        <h4 className="text-center mb-3">Vehicle Details</h4>
        <div className="d-flex justify-content-between">
          <div>
            <InputGroup className="mb-3">
              <InputGroup.Text className="bg-white">
                <i className="fa-solid fa-magnifying-glass"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by Vehicle No or Mobile No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
          <div>
            
           <Link to={'/filter'}> <Button>Filter</Button></Link>
          </div>
        </div>
        <div className="container mt-5 mb-2">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-danger">{error}</div>
          ) : (
            <>
              <Table striped bordered hover responsive className="table-custom">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Vehicle No</th>
                    <th>Mobile No</th>
                    <th>Valid Date</th>
                    <th>Upto Date</th>
                    <th>Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length > 0 ? (
                    currentRecords.map((detail, index) => (
                      <tr key={detail._id || index}>
                        <td>{indexOfFirstRecord + index + 1}</td>
                        <td>{detail.vehicleNo} </td>
                        <td>{detail.mobile}</td>
                        <td>{formatDate(detail.validDate)}</td>
                        <td style={{ color: detail.uptoDate === "Failed" ? "red" : "black" }}>
  {formatDate(detail.uptoDate)}
</td>
                        <td>₹{detail.rate}.00</td>
                        <td className="d-flex">
                          <Button variant="light" onClick={() => handleEditClick(detail)}>
                            <i className="fa-solid fa-pen"></i>
                          </Button>
                          <Button variant="outline-light" className="ms-2 " onClick={() => handleDelete(detail._id)}>
                            <i className="fa-solid fa-trash text-danger"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-danger">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination Controls */}
              {filteredData.length > recordsPerPage && (
                <div className="d-flex justify-content-center mt-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="me-2"
                  >
                    Previous
                  </Button>
                  <span className="align-self-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ms-2"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
  <Edit
  show={showEditModal}
  handleClose={() => setShowEditModal(false)}
  detail={selectedUser}
  onUpdate={updateUserInState} // ✅ This correctly updates state
/>
)}

<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default Detail;
