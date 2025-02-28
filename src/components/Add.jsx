import React, { useState } from "react";
import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import { vehicleDataAPI } from "../server/allApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Add() {
  const [userInput, setUserInput] = useState({
    vehicleNo: "",
    mobile: "",
    validDate: "",
    uptoDate: "",
    rate: "",
  });
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState("");

  const handleClose = () => {
    setUserInput({ vehicleNo: "", mobile: "", validDate: "", uptoDate: "", rate: "" });
    setDuration("");
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const handleVehicleDetails = async (e) => {
    e.preventDefault();
    const mobileRegex = /^[0-9]{10}$/;

    if (!mobileRegex.test(userInput.mobile)) {
      toast.warning("Please enter a valid 10-digit mobile number");
      return;
    }

    if (userInput.vehicleNo && userInput.validDate && userInput.uptoDate && userInput.rate) {
      try {
        const result = await vehicleDataAPI(userInput);
        if (result.status === 200) {
          toast.success(`${userInput.vehicleNo} vehicle details are uploaded`);
          handleClose();
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error("Failed to upload vehicle details");
      }
    } else {
      toast.warning("Please fill in all required fields");
    }
  };

  const handleVehicleNoChange = (e) => {
    const formattedValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setUserInput((prevState) => ({ ...prevState, vehicleNo: formattedValue }));
  };

  const handleValidDateChange = (e) => {
    const newValidDate = e.target.value;
    setUserInput((prevState) => ({ ...prevState, validDate: newValidDate }));
    if (duration) {
      calculateUptoDate(newValidDate, duration);
    }
  };

  const handleDurationSelect = (selectedDuration) => {
    setDuration(selectedDuration);
    if (userInput.validDate) {
      calculateUptoDate(userInput.validDate, selectedDuration);
    }
  };

  const calculateUptoDate = (validDate, duration) => {
    if (!validDate || duration === "Fail") {
      setUserInput((prevState) => ({ ...prevState, uptoDate: "Failed" }));
      return;
    }
  
    let date = new Date(validDate);
    let originalDay = date.getDate();
  
    // Fix - Set the date to the 1st before adding months
    date.setDate(1);
    let newMonth = date.getMonth() + parseInt(duration);
    let newYear = date.getFullYear() + Math.floor(newMonth / 12);
    newMonth = newMonth % 12;
  
    // Get the last valid day of the new month
    let lastDayOfNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
  
    // Restore the original day or set it to the last valid day if out of range
    let newDay = originalDay > lastDayOfNewMonth ? lastDayOfNewMonth : originalDay;
  
    // Set final date with new adjustments
    date.setFullYear(newYear, newMonth, newDay);
  
    // 🔥 Reduce the date by 1 day
    date.setDate(date.getDate() - 1);
  
    setUserInput((prevState) => ({ ...prevState, uptoDate: formatDate(date) }));
  };
  
  

  const formatDate = (date) => {
    if (!date) return "Failed";
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>Add Details</Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Pollution Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel label="Vehicle No:" className="mb-3">
              <Form.Control type="text" value={userInput.vehicleNo} onChange={handleVehicleNoChange} />
            </FloatingLabel>

            <FloatingLabel label="Mobile No:" className="mb-3">
              <Form.Control type="text" value={userInput.mobile} onChange={(e) => setUserInput({ ...userInput, mobile: e.target.value })} />
            </FloatingLabel>

            <FloatingLabel label="Valid Date" className="mb-3">
              <Form.Control type="date" value={userInput.validDate} onChange={handleValidDateChange} />
            </FloatingLabel>

            {/* Three Buttons for Duration Selection */}
            <Row className="mb-3">
              <Col>
                <Button
                  variant={duration === "6" ? "success" : "outline-success"}
                  className="w-100"
                  onClick={() => handleDurationSelect("6")}
                >
                  6 Months
                </Button>
              </Col>
              <Col>
                <Button
                  variant={duration === "12" ? "success" : "outline-success"}
                  className="w-100"
                  onClick={() => handleDurationSelect("12")}
                >
                  12 Months
                </Button>
              </Col>
              <Col>
                <Button
                  variant={duration === "Fail" ? "danger" : "outline-danger"}
                  className="w-100"
                  onClick={() => handleDurationSelect("Fail")}
                >
                  Fail
                </Button>
              </Col>
            </Row>

            <FloatingLabel label="Upto Date" className="mb-3">
              <Form.Control
                type="text"
                value={userInput.uptoDate}
                readOnly
                style={{ color: userInput.uptoDate === "Failed" ? "red" : "black" }}
              />
            </FloatingLabel>

            <FloatingLabel label="Rate:" className="mb-3">
              <Form.Control type="text" value={userInput.rate} onChange={(e) => setUserInput({ ...userInput, rate: e.target.value })} />
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleVehicleDetails}>Save</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default Add;
