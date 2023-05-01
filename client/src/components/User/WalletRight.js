import React from "react";

const WalletRight = ({ wallet }) => {
  return (
    <>
      <div className="sm:w-4/12 mb-10 px-4 w-full bg-gray-200 hover:bg-gray-300 rounded-lg">
        <div className="h-52 text-center mt-4 align-bottom">
            
          <div><h3 className="text">Wallet Balance</h3></div>
         <div> <h1 className="text-3xl mt-4 text-black font-bold">₹ {wallet ? wallet : "00.000"}</h1></div>
        <div className="flex justify-center">
         <img src={`/images/wal.png`} alt=".." className="w-32 text-center"/>
        </div>
        </div>
      </div>
    </>
  );
};

export default WalletRight;
