import React from "react";
import AcceptRide from "../../components/Driver/AcceptRide";
import Siderbar from "../../components/Driver/Sidebar";
import Navbar from "../../components/Driver/Navbar";

const AcceptRidePage = () => {
  return (
    <>
      <Navbar />
      <Siderbar />
      <div className="p-10 mt-16 sm:ml-64 h-full">
        <AcceptRide />
      </div>
    </>
  );
};

export default AcceptRidePage;