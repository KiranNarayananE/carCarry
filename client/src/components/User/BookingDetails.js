import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AxiosInstance from "../../api/axios";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { useNavigate,useParams } from 'react-router-dom'


const BookingList = () => {
     let {id}=useParams()
     const token = useSelector((state) => state.userLogin.token);
  const [trips, setTrips] = useState([]);
   const [error, setError] = useState();
  const navigate = useNavigate()

  const fetchBookingHistory = async (token) => {
    try {
      const response = await AxiosInstance.get(`/booking-details/${id}`, { headers: { Authorization: `Bearer ${token}` } });
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
    

<div class="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">


  <div class="flex justify-start item-start space-y-2 flex-col">
    <h1 class="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Order #13432</h1>
    <p class="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">24th April 2023 </p>
  </div>
  <div class="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
    <div class="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
      <div class="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
        <p class="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Ride Details</p>
        <div class="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
          <div class="pb-4 md:pb-8 w-full md:w-40">
            <img class="w-full hidden md:block" src={`/images/${trips?.driver?.PicturePath}`} alt="dress" />
            <img class="w-full md:hidden" src="https://i.ibb.co/L039qbN/Rectangle-10.png" alt="dress" />
          </div>
          <div class="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
            <div class="w-full flex flex-col justify-start items-start space-y-8">
              <h3 class="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">Driver:{trips?.driver?.firstName}</h3>
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
        <div class="mt-6 md:mt-0 flex justify-start flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-6 xl:space-x-8 w-full">


          {/* <div class="w-full md:w-40">
            <img class="w-full hidden md:block" src="https://i.ibb.co/s6snNx0/Rectangle-17.png" alt="dress" />
            <img class="w-full md:hidden" src="https://i.ibb.co/BwYWJbJ/Rectangle-10.png" alt="dress" />
          </div>
          <div class="flex justify-between items-start w-full flex-col md:flex-row space-y-4 md:space-y-0">
            <div class="w-full flex flex-col justify-start items-start space-y-8">
              <h3 class="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">High Quaility Italic Dress</h3>
              <div class="flex justify-start items-start flex-col space-y-2">
                <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Style: </span> Italic Minimal Design</p>
                <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Size: </span> Small</p>
                <p class="text-sm dark:text-white leading-none text-gray-800"><span class="dark:text-gray-400 text-gray-300">Color: </span> Light Blue</p>
              </div>
            </div>
            <div class="flex justify-between space-x-8 items-start w-full">
              <p class="text-base dark:text-white xl:text-lg leading-6">$20.00 <span class="text-red-300 line-through"> $30.00</span></p>
              <p class="text-base dark:text-white xl:text-lg leading-6 text-gray-800">01</p>
              <p class="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">$20.00</p>
            </div>
          </div> */}
        </div>
      </div>
     
    </div>
    <div class="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
    <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800 mb-10">Status</h3>
<ol class="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">                  
    <li class="mb-10 ml-6">            
        
        {trips.bookingStatus=="Conform"||trips.bookingStatus=="Started To Pickup Location"?
        <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
        < HourglassTopIcon/>
         </span>
            :
            <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
            <svg aria-hidden="true" class="w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </span>
         } 
        <h3 class="font-medium leading-tight">Reached Pickup</h3>
        
    </li>
    <li class="mb-10 ml-6">            
        
        {trips.bookingStatus=="Conform"||trips.bookingStatus=="Started To Pickup Location"||trips.bookingStatus=="Reached Pickup Location"?
        <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
        < HourglassTopIcon/>
         </span>
            :
            <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
            <svg aria-hidden="true" class="w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </span>
         } 
        <h3 class="font-medium leading-tight">Started To Destination</h3>
        
    </li>
    <li class="mb-10 ml-6">            
        
        {trips.bookingStatus!="Completed"?
        <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
        < HourglassTopIcon/>
         </span>
            :
            <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
            <svg aria-hidden="true" class="w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </span>
         } 
        <h3 class="font-medium leading-tight">Reached Destination</h3>
        
    </li>
   
</ol>


      
    </div>
  </div>
</div>
    </>             

      
   
  );
};  

export default BookingList;