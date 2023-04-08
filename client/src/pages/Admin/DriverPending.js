import React from "react";
import Siderbar from "../../components/Admin/Sidebar";
import Driver from "../../components/Admin/DriverPending";

const DriverApprovalPage = () => {
  return (
    <>
      <Siderbar />
      <div className="p-4 sm:ml-64 h-full">
        <Driver />
      </div>
    </>
  );
};

export default DriverApprovalPage;
