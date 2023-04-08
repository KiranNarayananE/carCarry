import React from "react";
import Siderbar from "../../components/Driver/Sidebar";

import Approvel from "../../components/Driver/Approve";
import Topnav from "../../components/Driver/Topnav";
import Navbar from "../../components/Driver/Navbar";
const Approve = () => {
  return (
    <>
      <Navbar/>
      <Siderbar/>
      <Approvel />
    </>
  );
};

export default Approve;