import React from "react";
import Siderbar from "../../components/Admin/Sidebar";
import Dashboard from "../../components/Admin/Dashboard";
const AdminHome = () => {
  return (
    <>
      <Siderbar />
      <div className="p-6  sm:ml-64 h-full">
      <Dashboard/>
      </div>
    </>
  );
};

export default AdminHome;