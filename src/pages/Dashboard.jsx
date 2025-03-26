import React, { useState } from 'react';
import Add from '../components/Add';
import Detail from '../components/Detail';

function Dashboard() {
  const [users, setUsers] = useState([]); // Store users

  // Function to add a new user to the list
  const addUserToList = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); // Append new user
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #FFF5E4, #C1D8C3)", minHeight: "100vh", paddingBottom: "40px" }}>
      <div className="container pt-5">
        
        {/* Header Section */}
        <div className="text-center">
          <h2 className="fw-bold" style={{ color: "#6A9C89" }}>
            <span style={{ color: "#FFA725" }}>Greenleaf</span> Pollution Testing Center
          </h2>
          <p className="text-muted">Ensuring environmental safety with accurate pollution checks</p>
        </div>

        {/* Add User Section */}
        <div className="d-flex justify-content-center mt-4">
          <div className="card shadow p-4 rounded-4" 
               style={{ maxWidth: '500px', background: "#C1D8C3", border: "2px solid #6A9C89" }}>
            <h5 className="mb-3 text-dark">Add New Vechicle</h5>
            <Add addUserToList={addUserToList} />
          </div>
        </div>

        {/* User Details Section */}
        <div className="mt-5">
          <Detail users={users} />
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
