import React from "react";
import Navbar from "../../components/Driver/Navbar";
import Sidebar from "../../components/Driver/Sidebar"
import PendingBookings from "../../components/Driver/PendingBookings"

const PendingBookingPage = () => {
  return (
<>
      <Navbar />
   
        <Sidebar />
        <div className="p-10 mt-8 sm:ml-64 h-full">
          <PendingBookings />
          </div>
          </>   
  );
};

export default PendingBookingPage;