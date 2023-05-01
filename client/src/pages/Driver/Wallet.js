import React from "react";
import Siderbar from "../../components/Driver/Sidebar";
import Navbar from "../../components/Driver/Navbar";
import Wallet from "../../components/Driver/Wallet";

const WalletPageDriver = () => {
  return (
    <>
      <Navbar />
      <Siderbar />
      <div className="p-10 mt-16 sm:ml-64 h-full">
        <Wallet />
      </div>
    </>
  );
};

export default WalletPageDriver;