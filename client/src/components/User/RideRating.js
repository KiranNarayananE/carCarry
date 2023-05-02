import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WalletLeft from "./WalletLeft";
import WalletRight from "./WalletRight";
import axiosInstance from "../../api/axios";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [trans, setTrans] = useState([]);
  const [rating, setRating] = useState(0);
  const token = useSelector((state) => state.userLogin.token);

  useEffect(() => {
    const fetchBalance = async () => {
      const response = await getBalance(token);
      if (response.status === 500) return;
      if (response.status === 200) return setWallet(response.data.balance);
    };
    const getBalance = async (token) => {
        try {
          const response = await axiosInstance.get("/wallet-balance", { headers: { Authorization: `Bearer ${token}` } });
          return response;
        } catch (error) {
          return error.response;
        }
      };
      const getWallet = async (token) => {
        try {
          const response = await axiosInstance.get("/wallet-details", { headers: { Authorization: `Bearer ${token}` } });
          return response;
        } catch (error) {
          return error.response;
        }
      };  
    const fetchWallet = async () => {
      const response = await getWallet(token);
      if (response.status === 201) return;
      if (response.status === 200) return setTrans(response.data.wallet);
      if (response.status === 500) return;
    };

    fetchBalance();
    fetchWallet();
  }, [wallet]);

  return (
    <>
       {console.log(rating)}
     <div class="min-h-screen bg-gray-300 py-6 flex flex-col justify-center sm:py-12">
  <div class="py-3 sm:max-w-xl sm:mx-auto">
    <div class="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg">
      <div class="px-12 py-5">
        <h2 class="text-gray-800 text-3xl font-semibold">Your opinion matters to us!</h2>
      </div>
      <div class="bg-gray-200 w-full flex flex-col items-center">
        <div class="flex flex-col items-center py-6 space-y-3">
          <span class="text-lg text-gray-800">How was quality of the call?</span>
          <div class="flex space-x-3">
          <div className="rating rating-lg">
         
  {rating==1||rating==0?<input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" checked onClick={()=>setRating(1)}/>:
  <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" onClick={()=>setRating(1)}/>}
  {rating==2?<input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" checked onClick={()=>setRating(2)}/>:
  <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" onClick={()=>setRating(2)}/>}
  {rating==3?<input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" checked onClick={()=>setRating(3)}/>:
  <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" onClick={()=>setRating(3)} />}
  {rating==4?<input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" checked onClick={()=>setRating(4)}/>:
  <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" onClick={()=>setRating(4)}/>}
  {rating==5?<input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" checked onClick={()=>setRating(5)}/>:
  <input type="radio" name="rating-8" className="mask mask-star-2 bg-orange-400" onClick={()=>setRating(5)}/>}
</div>
          </div>
        </div>
        <div class="w-3/4 flex flex-col">
          <textarea rows="3" class="p-4 text-gray-500 rounded-xl resize-none">Leave a message, if you want</textarea>
          <button class="py-3 my-8 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white">Rate now</button>
        </div>
      </div>
      <div class="h-20 flex items-center justify-center">
        <a href="#" class="text-gray-600">Maybe later</a>
      </div>
    </div>

  </div>
</div>
    </>
  );
};

export default Wallet;