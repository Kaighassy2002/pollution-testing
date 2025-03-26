import React, { useEffect, useState } from "react";
import { Button, InputGroup, Form, Table } from "react-bootstrap";
import { deleteAPI, detailsAPI } from "../server/allApi";
import Edit from "./Edit";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Detail({ users }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15; 
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await detailsAPI();
        setDetails(response?.data?.reverse() || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleData();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setDetails((prev) => [...users, ...prev]);
    }
  }, [users]);

  const updateUserInState = async () => {
    try {
      const response = await detailsAPI();
      setDetails(response?.data?.reverse() || []);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error fetching updated data:", error);
      toast.error("Failed to fetch updated data");
    }
  };

  const filteredData = details.filter(
    (detail) =>
      detail.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.mobile?.includes(searchTerm)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Failed") return "Failed";
    if (dateString.includes("/")) return dateString;

    const date = new Date(dateString);
    if (isNaN(date)) return "Failed";

    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteAPI(id);
        toast.info("Vehicle deleted successfully");
        setDetails((prev) => prev.filter((user) => user._id !== id));
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    }
  };

  return (
   <div style={{ minHeight: "100vh", paddingBottom: "40px" }}>
      <div className="container mt-5">
      <h4 className="text-center mb-4 fw-bold" style={{ color: "#6A9C89" }}>
          <i className="fa-solid fa-car" style={{ color: "#FFA725" }}></i> Vehicle Details
        </h4>
  
        {/* Search and Buttons */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <InputGroup className="w-50 shadow-sm">
            <InputGroup.Text className=" border-0" style={{backgroundColor:'#6A9C89'}}>
              <i className="fa-solid fa-magnifying-glass text-secondary"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by Vehicle No or Mobile No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0"
              style={{backgroundColor:'#C1D8C3'}}
            />
          </InputGroup>
          <div>
            <Link to="/message">
              <button style={{fontSize:"30px"}} className="me-2 btn"><i style={{color:'#FFA725'}} class="fa-solid fa-envelope-circle-check"></i></button>
            </Link>
            <Link to="/filter">
              <Button style={{ background: "#6A9C89", border: "none" }}> Filter</Button>
            </Link>
          </div>
        </div>
  
        {/* Table Section */}
        <div className="table-responsive shadow rounded-4 p-3 bg-white">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-danger">{error}</div>
          ) : (
            <>
              <Table striped bordered hover responsive className="table-custom">
                <thead style={{ background: "#6A9C89", color:'#C1D8C3' }}>
                  <tr >
                    <th style={{color:'#FFA725'}}>#</th>
                    <th style={{color:'#FFA725'}}>Vehicle No</th>
                    <th style={{color:'#FFA725'}}>Mobile No</th>
                    <th style={{color:'#FFA725'}}>Valid Date</th>
                    <th style={{color:'#FFA725'}}>Upto Date</th>
                    <th style={{color:'#FFA725'}}>Rate</th>
                    <th style={{color:'#FFA725'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length > 0 ? (
                    currentRecords.map((detail, index) => (
                      <tr key={detail._id || index}>
                        <td>{indexOfFirstRecord + index + 1}</td>
                        <td>{detail.vehicleNo}</td>
                        <td>{detail.mobile}</td>
                        <td>{formatDate(detail.validDate)}</td>
                        <td style={{ color: detail.uptoDate === "Failed" ? "red" : "black" }}>
                          {formatDate(detail.uptoDate)}
                        </td>
                        <td>₹{detail.rate}.00</td>
                        <td>
                          <Button style={{ background: "#6A9C89" }}  size="sm" onClick={() => handleEditClick(detail)}>
                            <i style={{  color: "#FFF5E4" }} className="fa-solid fa-pen"></i>
                          </Button>
                          <button  size="sm" className="ms-2 btn" onClick={() => handleDelete(detail._id)}>
                            <i style={{  color: "#6A9C89" }} className="fa-solid fa-trash"></i>
                          </button>
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
                    ◀ Previous
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
                    Next ▶
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
  
        {/* Edit Modal */}
        {selectedUser && (
          <Edit
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            detail={selectedUser}
            onUpdate={updateUserInState}
          />
        )}
  
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
      </div>
   </div>
  );
}

export default Detail;
