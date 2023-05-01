import React from "react";
import Siderbar from "../../components/Admin/Sidebar";

import Report from "../../components/Admin/Report";

const ReportPage = () => {
  return (
    <>
      <Siderbar />
      <div className="p-10 pt-0 sm:ml-64 h-full">
        <Report />
      </div>
    </>
  );
};

export default ReportPage;