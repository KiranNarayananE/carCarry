import React from "react";

import Login from "../../components/Driver/Login";
import Topnav from "../../components/Driver/Topnav";

const DriverLogin = () => {
  return (
    <>
      <Topnav />
      <div className="flex justify-evenly items-center h-screen">
        <Login />
      </div>
    </>
  );
};

export default DriverLogin;