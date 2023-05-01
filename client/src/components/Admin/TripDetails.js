import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AxiosInstance from "../../api/axios";
import { useNavigate,useParams } from 'react-router-dom'
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';

const BookingList = ({ trip }) => {
    let {id}=useParams()
    const token = useSelector((state) => state.adminLogin.token);
    const [otp, setOtp] = useState();
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState();
  const navigate = useNavigate()


  const fetchBookingHistory = async (token) => {
    try {
      const response = await AxiosInstance.get(`/admin/booking-details/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const fetchHistory = async () => {
    const response = await fetchBookingHistory(token);
    if (response.status === 200) return setTrips(response.data.Bookings);
    if (response.status === 500) return setError("Try again after some time");
  };

  useEffect(() => {
    fetchHistory();

  }, []);
  return (
    <>
    
<div class="md:py-14  md:pl-80 md:pt-6  2xl:mx-auto">
{console.log(trips)}


<fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-regal-blue">
          <div className="space-y-2 col-span-full lg:col-span-1">
            <p className="font-extrabold text-lg text-real-orange">
              Order Details
            </p>
            </div>
        </fieldset>
  <div class="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0 ">
    <div class="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8 ">
    <div class="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full rounded-[50px] text-center shadow-[1px_1px_2px_2px_grey]">
        <p class="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-real-orange">Ride Details</p>
        <div class="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
          <div class="pb-4 md:pb-8 w-full md:w-40">
            <img class="w-full hidden md:block" src={`/images/${trips?.user?.profile}`} alt="dress" />
            <img class="w-full md:hidden" src="https://i.ibb.co/L039qbN/Rectangle-10.png" alt="dress" />
          </div>
          <div class="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
            <div class="w-full flex flex-col justify-start items-start space-y-8">
              <h3 class="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">Customer:{trips?.user?.name}</h3>
              <div class="flex justify-start items-start flex-col space-y-2">
                <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Pickup: </span> {trips?.location?.pickup}</p> 
                 <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Dropoff: </span> {trips?.location?.dropoff}</p> 
                <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Date: </span> {trips?.date}</p>
                <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Time: </span> {trips?.time}</p>
              </div>
            </div>
            <div class="flex justify-between space-x-8 items-start w-full">
              <p class="text-base dark:text-white xl:text-lg leading-6">Rs {trips?.payment?.amount} </p>
              <p class="text-base dark:text-white xl:text-lg leading-6 text-gray-800">Payment Status:</p>
              {trips?.payment?.status === true ? 
                                    <p  className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Paid</p>:
                                    <p  className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">Unpaid</p>

                                }
            </div>
          </div>
        </div>
       
      </div>
      <div class="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
        <div class="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6 rounded-[50px] text-center shadow-[1px_1px_2px_2px_grey]">
          <h3 class="text-xl dark:text-white font-semibold leading-5 text-real-orange">Driver Details</h3>
          <div class="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
            <div class="flex justify-between w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Name</p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600">{trips?.driver?.firstName}</p>
            </div>
            <div class="flex justify-between items-center w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Email</p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600">{trips?.driver?.email}</p>
            </div>
            <div class="flex justify-between items-center w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Phone</p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600">{trips?.driver?.phone}</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6 rounded-[50px] text-center shadow-[1px_1px_2px_2px_grey]">
          <h3 class="text-xl dark:text-white font-semibold leading-5 text-real-orange">User details</h3>
          <div class="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
            <div class="flex justify-between w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Name</p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600 capitalize">{trips?.user?.name}</p>
            </div>
            <div class="flex justify-between items-center w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Email </p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600">-{trips?.user?.email}</p>
            </div>
            <div class="flex justify-between items-center w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Phone</p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600">{trips?.user?.phone}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <div class="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
      <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800">Customer</h3>
      <div class="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
        <div class="flex flex-col justify-start items-start flex-shrink-0">
          <div class="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
            <img src="https://i.ibb.co/5TSg7f6/Rectangle-18.png" alt="avatar" />
            <div class="flex justify-start items-start flex-col space-y-2">
              <p class="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">{trips?.user?.name}</p>
              <p class="text-sm dark:text-gray-300 leading-5 text-gray-600">10 Previous Orders</p>
            </div>
          </div>

          <div class="border border-red-500 rounded-[10px] p-4">
  <p class="text-red-500 font-bold">Emergency Help</p>
  <p class="text-red-500 pt-5">There is No Emergency Help Request</p>
</div>
        </div>
        <div class="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
        
        </div>
      </div>
    </div>
  </div>
</div>


    </>             

      
   
  );
};  

export default BookingList;