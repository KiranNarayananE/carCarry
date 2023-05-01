import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AxiosInstance from "../../api/axios";
import Map from "./Map";
import { useNavigate,useParams } from 'react-router-dom'
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';

const BookingList = ({ trip }) => {
    let {id}=useParams()
    const token = useSelector((state) => state.driverLogin.token);
    const [otp, setOtp] = useState();
    const [message, setMessage] = useState();
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState();
  const navigate = useNavigate()

  const getTripDetails = async (token, id,val) => {
    try {
      const response = await AxiosInstance.patch(`/driver/${val}`, { id,otp }, { headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      return error.response;
    }
  };
  const submitProblem = async (token, id,val) => {
    try {
      const response = await AxiosInstance.patch(`/driver/emergency`, { id,message }, { headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      return error.response;
    }
  };
  const submitReachedPickup = async (val) => {
    const response = await getTripDetails(token, id,val);
    if (response.status === 200) return setTrips(response.data.ride);
    
  };
  const submitCode = async (val) => {
    const response = await getTripDetails(token, id,val);
    if (response.status === 200) return setTrips(response.data.ride)
    if (response.status === 500) return navigate("/driver/error");
  };
  const submitMessage = async (val) => {
    const response = await submitProblem(token, id,val);
    
  };
  const fetchBookingHistory = async (token) => {
    try {
      const response = await AxiosInstance.get(`/driver/booking-details/${id}`, { headers: { Authorization: `Bearer ${token}` } });
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
    
<div class="md:py-14  md:pl-80 md:pt-24  2xl:mx-auto">
{console.log(trips)}

  <div class="flex justify-start item-start space-y-2 flex-col">
    <h1 class="text-2xl dark:text-white lg:text-2xl font-semibold leading-7 lg:leading-9 text-gray-800">Ride #{trips._id}</h1>
    <p class="text-base dark:text-gray-300 font-medium leading-6 text-gray-600"></p>
  </div>
  <div class="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
    <div class="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
      <div class="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
        <p class="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Ride Details</p>
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
      
      
        
      
    </div>
    <div class="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
      <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800"></h3>
      <div class="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
        <div class="flex flex-col justify-start items-start flex-shrink-0">
          <div class="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
          <WhereToVoteIcon/>
            <div class="flex justify-start items-start flex-col space-y-2">
                {trips.bookingStatus=="Started To Pickup Location" &&
            <button className="btn btn-xs btn-success" onClick={()=>{submitReachedPickup("trip-reachedPickup")}}>Reached Pickup</button>
                            }
                            {trips.bookingStatus=="Reached Pickup Location" &&
            <label htmlFor="my-modal-8" className="btn btn-xs btn-success text-white hover:bg-red">Start To Destination</label>
                            }
            </div>
          </div>

          <div class="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 7L12 13L21 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            
            <label htmlFor="my-modal-7" className="btn bg-error border-none text-white hover:bg-red">Emergency Help</label>
          </div>
        </div>
        
      </div>
    </div>
    
  </div>
  {trips&&
  <Map pickupLocation={trips?.location?.pickup} dropoffLocation={trips?.location?.dropoff}/>
  }
  <input type="checkbox" id="my-modal-7" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle text-white">
        <div className="modal-box">
          {trips && (
            <>
              <h3 className="font-bold text-lg text-black">Please Mention Your Problem </h3>
              <div className="flex justify-center items-center w-full h-full ">
                <div className="form-control md:mt-10 w-76 h-full">
                <textarea
                    type="text"
                    value={message}
                    className="input input-bordered text-black"
                     onChange={(e) => setMessage(e.target.value)}
                  />

<label htmlFor="my-modal-7" className="btn btn-outline btn-error w-24 my-4 mx-16" onClick={()=>{submitMessage()}}>
                  Submit
                    </label>
                </div>
              </div>
            </>
          )}


          <div className="modal-action">
            <label htmlFor="my-modal-7" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
      <input type="checkbox" id="my-modal-8" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle text-white">
        <div className="modal-box">
          {trips.bookingStatus=="Reached Pickup Location" && (
            <>
              <h3 className="font-bold text-lg text-black">Enter Otp </h3>
              <div className="flex justify-center items-center w-full h-full ">
                <div className="form-control md:mt-10 w-76 h-full">
                <input
                    type="text"
                     value={otp}
                    className="input input-bordered text-black"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <label htmlFor="my-modal-8" className="btn btn-outline btn-error w-24 my-4 mx-16" onClick={()=>{submitCode("trip-destination")}}>
                  Submit
                    </label>
                </div>
              </div>
            </>
          )}


          <div className="modal-action">
            <label htmlFor="my-modal-8" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
</div>

    </>             

      
   
  );
};  

export default BookingList;