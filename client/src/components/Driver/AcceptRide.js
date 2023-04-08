import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AcceptProfile from "./AcceptProfile";
import AxiosInstance from "../../api/axios";

const AcceptRide = () => {
  const token = useSelector((state) => state.driverLogin.token);
  const [bookingList, setBookings] = useState([]);
  const [message, setMessage] = useState("");
   const getBookings = async (token) => {
    try {
      const response = await AxiosInstance.get("/driver/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  };
  
  // * accept ride *//
   const acceptRide = async (id, token) => {
    try {
      const response = await AxiosInstance.patch(
        "/driver/accept-ride",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }
  };
  
  // * decline ride *//
 const declineRide = async (id, token) => {
    try {
      const response = await AxiosInstance.patch("/driver/decline-ride", { id }, { headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      return error.response;
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  }, []);

  const fetchBookings = async () => {
    const response = await getBookings(token);
    if (response.status === 200) return setBookings(response.data.trips);
  };

  const handleSubmit = async (id) => {
    const response = await acceptRide(id, token);
    if (response.status === 200) {
      setMessage("Trip Accepted");
      setTimeout(() => {
        setMessage("");
      }, 2000);

      fetchBookings();
    }
  };

  const handleDecline = async (id) => {
    const response = await declineRide(id, token);
    if (response.status === 200) {
      setMessage("Trip Declined");
      setTimeout(() => {
        setMessage("");
      }, 2000);

      fetchBookings();
    }
  };

  return (
    <>
      {message && (
        <div className="flex justify-center">
          <div className="alert alert-success shadow-lg w-96 ">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your {message} </span>
            </div>
          </div>
        </div>
      )}

      {!bookingList.length > 0 ? (
        <section className="text-black-400  body-font overflow-hidden">
          <div>
            <div className="flex flex-wrap w-full mb-10">
              <div className="lg:w-1/2 w-full mb-4 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-real-orange">Rides Available </h1>
                <div className="h-1 w-20 bg-indigo-500 rounded"></div>
              </div>
            </div>
            <div className="container px-5 py-24 mx-auto">
              <div className="-my-8 divide-y-2 divide-gray-800">
                <div className="py-8  border-b-2 border-gray-500 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-extrabold  text-lg title-font text-red-600">Booking Date</span>
                    <span className="mt-1 text-black text-sm">NIL</span>
                  </div>
                  <div className="md:flex-grow">
                    <h2 className="text-2xl font-medium text-black title-font mb-2">No Avaiable Booking list</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="text-black-400  body-font overflow-hidden">
          <div className="flex flex-wrap w-full mb-10">
            <div className="lg:w-1/2 w-full mb-4 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-real-orange"> Rides Available</h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          {bookingList.map((trip, _id) => (
            <div className="container px-5 py-10 mx-auto" key={_id}>
              <div className="-my-8 divide-y-2 divide-gray-800">
                <div className="py-8  border-b-2 border-gray-500 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-extrabold  text-lg title-font text-black-600">Booking Date</span>
                    <span className="mt-1  text-sm text-black">{trip.date}</span>
                  </div>
                  <div className="md:flex-grow ">
                    <h2 className="text-xl font-medium text-black-400 title-font mb-2">
                      <span className="font-bold text-xl text-black md:mr-2">PICK UP :</span>
                      {trip.location.pickup}
                    </h2>
                    <h2 className="text-xl font-medium text-black-400  title-font mb-2">
                      <span className="font-bold text-xl  text-black md:mr-2">DROP OFF:</span>
                      {trip.location.dropoff}
                    </h2>
                    <div className="md:flex md:justify-between  md:w-4/5">
                      <p className="font-semibold text-lg  text-black ">
                        Time:<span className="text-black-400  font-medium ml-2">{trip.time}</span>
                      </p>
                      <p className="font-semibold text-lg  text-black  ">
                        Km:<span className="text-black-400  font-medium ml-2">{trip.location.distance} KM</span>
                      </p>
                      <p className="font-semibold text-lg  text-black ">
                        Price:
                        <span className="text-black-400  font-medium ml-2">{trip.payment.amount}</span>
                      </p>
                    </div>
                    <div className="flex gap-10 mt-10">
                      <button className="btn bg-green-400 text-black" onClick={() => handleSubmit(trip._id)}>
                        Accept
                      </button>
                      <button className="btn bg-gray-500 text-black" onClick={() => handleDecline(trip._id)}>
                        Decline
                      </button>
                    </div>
                  </div>
                  {/* <AcceptProfile
                    name={trip.user[0].name}
                    email={trip.user[0].email}
                    phone={trip.user[0].phone}
                    image={trip.user[0].profile ? trip.user[0].profile : null}
                  /> */}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default AcceptRide;
