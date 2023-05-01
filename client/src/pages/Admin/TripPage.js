import React from "react";
import Siderbar from "../../components/Admin/Sidebar";

import Trips from "../../components/Admin/Trips";

const UpcomingtripPage = () => {
  return (
    <>
      <Siderbar />
      <div className="p-10 pt-0 sm:ml-64 h-full">
        <Trips />
      </div>
    </>
  );
};

export default UpcomingtripPage;