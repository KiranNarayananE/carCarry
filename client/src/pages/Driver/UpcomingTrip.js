import React from "react";
import Siderbar from "../../components/Driver/Sidebar";
import Navbar from "../../components/Driver/Navbar";
import UpcomingTrips from "../../components/Driver/UpcomingTrip";

const UpcomingtripPage = () => {
  return (
    <>
      <Navbar />
      <Siderbar />
      <div className="p-10 mt-16 sm:ml-64 h-full">
        <UpcomingTrips />
      </div>
    </>
  );
};

export default UpcomingtripPage;
