import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateAPI } from "../server/allApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Edit = ({ show, handleClose,  onUpdate, detail }) => {
  const [user, setUser] = useState({
    id: "",
    vehicleNo: "",
    mobile: "",
    validDate: "",
    uptoDate: "",
    rate: "",
  });


  
  // Populate form fields when detail is received
  useEffect(() => {
    if (detail) {
      setUser({
        id: detail._id || "",
        vehicleNo: detail.vehicleNo || "",
        mobile: detail.mobile || "",
        validDate: detail.validDate ? detail.validDate.split("T")[0] : "",
        uptoDate: detail.uptoDate ? detail.uptoDate.split("T")[0] : "",
        rate: detail.rate || "",
      });
    }
  }, [detail, show]);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Function to calculate Upto Date
  const calculateUptoDate = (months) => {
    if (!user.validDate) return; // Ensure Valid Date is selected
    const validDateObj = new Date(user.validDate);
    validDateObj.setMonth(validDateObj.getMonth() + months); // Add months
    validDateObj.setDate(validDateObj.getDate() - 1); // Subtract 1 day
    setUser({ ...user, uptoDate: validDateObj.toISOString().split("T")[0] });
  };

  // Handle setting Upto Date to "Failed"
  const handleFail = () => {
    setUser({ ...user, uptoDate: "Failed" });
    toast.error("Upto Date marked as Failed!");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.id) {
      toast.error("Error: User ID is missing!");
      return;
    }

    try {
      await updateAPI(user.id, user);
      toast.success("User updated successfully!");
      onUpdate(); // Update parent state
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vehicle Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Vehicle No - Read Only */}
            <Form.Group className="mb-3">
              <Form.Label>Vehicle No</Form.Label>
              <Form.Control
                type="text"
                className="bg-secondary"
                name="vehicleNo"
                value={user.vehicleNo}
                readOnly
                required
              />
            </Form.Group>

            {/* Mobile No */}
            <Form.Group className="mb-3">
              <Form.Label>Mobile No</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={user.mobile}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Valid Date */}
            <Form.Group className="mb-3">
              <Form.Label>Valid Date</Form.Label>
              <Form.Control
                type="date"
                name="validDate"
                value={user.validDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Upto Date with Selection Buttons */}
            <Form.Group className="mb-3">
              <Form.Label>Upto Date</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  name="uptoDate"
                  value={user.uptoDate}
                  readOnly
                  required
                />
                <Button
                  variant="outline-primary"
                  className="ms-2"
                  onClick={() => calculateUptoDate(6)}
                >
                  +6 Months
                </Button>
                <Button
                  variant="outline-primary"
                  className="ms-2"
                  onClick={() => calculateUptoDate(12)}
                >
                  +12 Months
                </Button>
                <Button variant="danger" className="ms-2" onClick={handleFail}>
                  Fail
                </Button>
              </div>
            </Form.Group>

            {/* Rate */}
            <Form.Group className="mb-3">
              <Form.Label>Rate</Form.Label>
              <Form.Control
                type="text"
                name="rate"
                value={user.rate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
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
    </div>
  );
};

export default Edit;
