import React from "react";
import Siderbar from "../../components/Admin/Sidebar";
import DriverList from "../../components/Admin/DriverList";

const DriverPage = () => {
  return (
    <>
      <Siderbar />
      <div className="p-4 sm:ml-64 h-full">
        <DriverList/>
      </div>
    </>
  );
};

export default DriverPage;