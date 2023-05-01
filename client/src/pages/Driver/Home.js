import React from "react";
import Siderbar from "../../components/Driver/Sidebar";
import Navbar from "../../components/Driver/Navbar";
import Test from "../../components/Driver/test";
const DriverHome = () => {
  return (
    <>
      <Navbar/>
      <Siderbar/>
      <div className="p-10 mt-8 sm:ml-64 h-full">
      <Test/>
      </div>
    </>
  );
};

export default DriverHome;