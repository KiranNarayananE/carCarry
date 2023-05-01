import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import {  useNavigate } from "react-router-dom";

const BookingList = ({ trip }) => {
  const navigate= useNavigate()
  return (
    <>
                        <tbody className="text-gray-600 text-sm font-light">
                            <tr className="border-b border-gray-200 hover:bg-gray-100">
                                
                                <td className="py-3 px-6 text-left">
                                    <div className="flex items-center">
                                        <div className="mr-2">
                                            <img className="w-6 h-6 rounded-full" src={`/images/${trip.user.profile}`}/>
                                        </div>
                                        <span>{trip.user.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center whitespace-nowrap">
                                    <div className=" text-center">
                                     
                                        <span className="font-medium ">{trip.location.pickup.split(",")[0]}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex items-center justify-center">
                                    {trip.location.dropoff.split(",")[0]}
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex items-center justify-center">
                                    {trip.date}
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex items-center justify-center">
                                    {trip.time}
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-center">
                                {trip.payment.status === true ? 
                                    <span  className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Paid</span>:
                                    <span  className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">Unpaid</span>

                                }
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center">
                                       
                                        <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110" >
                                        <button className="btn btn-xs" onClick={()=>{navigate(`/driver/booking-details/${trip._id}`)}}>Details</button>
                                        </div>
                                        
                                    </div>
                                </td>
                            </tr>
                           
                        </tbody>
                    

      
    </>
  );
};

export default BookingList;