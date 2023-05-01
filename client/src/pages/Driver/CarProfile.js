import React from "react";
import Navbar from "../../components/Driver/Navbar";
import CarProfile from "../../components/Driver/Carprofile";
import Sidebar from "../../components/Driver/Sidebar"

const CarProfilePage = () => {
  return (
<>
      <Navbar />
   
        <Sidebar />
        <div className="p-10  mt-8 md:mt-20 sm:ml-64 h-full">
          <CarProfile />
          </div>
          </>   
          
  );
};

export default CarProfilePage;