
import React from "react";
import { useEffect,useState } from "react";
import axiosInstance from "../../api/axios";
import {useSelector } from "react-redux";
import VerifiedIcon from '@mui/icons-material/Verified';
const Approvel = () => {
  let [approval,setApproval]=useState({})
  const {Approval} = useSelector((state) => state.driverLogin);
 
  return (
   
    <section className="h-screen pt-20 py-6 flex justify-center items-center dark:bg-violet-400 dark:text-gray-900 max-w">
      {Approval?(

       <div className="max-w-sm rounded overflow-hidden shadow-lg">
  <img className="w-full h-60 " src="/images/car.jpg" alt="Sunset in the mountains"/>
  <div className="px-6 py-4">
  
    <p class="text-red-600 font-bold text-xl flex items-center">
      
        <svg class="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
        </svg>
        Members only
      </p>
  </div>
  <div class="text-gray-900 font-bold text-xl mb-2 text-center">Donot Worry?</div>
      <p class="text-gray-700 text-base">Our Admins will review your request soon And will update soon!!</p>
    
  
</div>
    ):(<div className="max-w-sm rounded overflow-hidden shadow-lg">
    <img className="w-full h-60 " src="/images/car.jpg" alt="Sunset in the mountains"/>
    <div className="px-6 py-4">
    
    <p class="text-green-600 font-bold text-xl flex  text-center">
<VerifiedIcon/>
   CONGRATULATIONS
  </p>
    </div>
    <div class="text-gray-900 font-bold text-xl mb-2 text-center">KEEP GOING</div>
        <p class="text-gray-700 text-base">You are a part of our team now.Happy earning and drive safe with ethics</p>
      
    
  </div>)}
    </section>
  );
};

export default Approvel;