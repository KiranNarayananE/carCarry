import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RailwayAlertIcon from "@mui/icons-material/RailwayAlert";
import { setLocation, setActive, setInactive, setLocationData, setStartDrive } from "../../Store/Slice/DriverLogin";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../api/axios";
import mapboxgl from "mapbox-gl";

const DriverLoacation = () => {
  const [suggestions, setSuggestions] = useState([]);
  const { location, active, token, driving } = useSelector((state) => state.driverLogin);
  const [id, setid] = useState();
  const [customer, setCustomer] = useState();
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getLocationName = async (lng, lat) => {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`);
    const data = await response.json();
  
    const location = data.features[0].place_name;
    const parts = location.split(",");
    const locationName = `${parts[parts.length - 3]}, ${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
  
    return locationName;
  };
  const getlocation = async (token) => {
    try {
      const response = await AxiosInstance.get("/driver/current-location", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  };
  const getTripDetails = async (token, id) => {
    try {
      const response = await AxiosInstance.patch("/driver/trip-start", { id }, { headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      return error.response;
    }
  };
  const stopRiding = async (token) => {
    try {
      const response = await AxiosInstance.patch("/driver/trip-end", { status: false }, { headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      return error.response;
    }
  };
  
  const onRide = async (token) => {
    try {
      const response = await AxiosInstance.patch("/driver/trip-on", { status: false }, { headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const fetchLoactionData = async () => {
    const response = await getlocation(token);
    console.log(response.data);
    if (response.status === 306) return dispatch(setStartDrive({ driving: false }));
    if (response.status === 302) return dispatch(setStartDrive({ driving: true }));
    if (response.status === 200) {
      const lng = response.data.location[0];
      const lat = response.data.location[1];
      await getLocationName(lng, lat).then((locationName) => {
        dispatch(setLocation({ location: locationName, active: true, driving: false }));
      });
    }
  };

  useEffect(() => {
    fetchLoactionData();

  }, []);

  //* location suggestion *//
  let bbox = [72.55, 8.15, 78.55, 13.05];
  const handleInput = async (event) => {
    const query = event.target.value;

    if (!query) {
      setSuggestions([]);
      return;
    }
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places//${encodeURIComponent(query)}.json?access_token=${
      process.env.REACT_APP_MAPBOX_TOKEN
    }&country=IN&region=KA,TN,KL&bbox=${bbox.join(",")}`;
    const response = await fetch(url);
    const data = await response.json();
    setSuggestions(data.features);
  };

  //* location selecter *//
  const selectLocation = (suggestion) => {
    dispatch(setLocation({ location: suggestion.place_name, coordinates: suggestion.center, active: true }));
    dispatch(setLocationData());
    setSuggestions([]);
  };

  //* online *//
  const selectOffline = (event) => {
    const status = event.target.checked;
  
    if (!status) {
      dispatch(setInactive());
      dispatch(setLocationData());
      return;
    }
  
    // If active is already true, set the current location
    if (status&&!location) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${
            process.env.REACT_APP_MAPBOX_TOKEN
          }`;
          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              const currentLocation = data.features[0].place_name;
              dispatch(setLocation({ location: currentLocation, coordinates: [longitude, latitude], active: true }));
              dispatch(setLocationData());
            });
        });
      }
    } else {
      dispatch(setActive());
    }
  };

  // * send id and get details *//
  const submitCode = async () => {
    const response = await getTripDetails(token, id);
    if (response.status === 200) return setCustomer(response.data.ride);
    if (response.status === 203) return setError("No User found");
    if (response.status === 500) return navigate("/driver/error");
  };

  const appectRide = async () => {
    dispatch(setInactive());
    dispatch(setLocationData());
    dispatch(setStartDrive({ driving: true }));
    await onRide(token);
  };

  const stopRide = async () => {
    dispatch(setStartDrive({ driving: false }));
    await stopRiding(token);
  };

  return (
    <>
      <div className="md:flex items-center hidden">
        {!driving ? (
          <label htmlFor="my-modal-6" className="btn btn-sm md:btn-md mx-10 bg-green-600 text-black hover:text-white">
            Start ride
          </label>
        ) : (
          <button className="btn btn-sm md:btn-md mx-10 bg-red-600 text-black hover:text-white" onClick={stopRide}>
            Stop
          </button>
        )}

        <div className="form-control mr-4">
          <div className="input-group">
            <input
              type="text"
              value={active ? location : ""}
              placeholder="Select Location"
              className="input input-bordered text-real-orange"
              onChange={handleInput}
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-400 w-96 max-h-48 overflow-y-scroll mt-12  rounded shadow-md">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => selectLocation(suggestion)}
                    className="cursor-pointer hover:bg-gray-200 p-2 border-b border-gray-400 text-black">
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {active && <h1 className="text-green-500 mr-4">Active</h1>}
        <div className="flex items-center md:mr-16">
          <div>
            <input type="checkbox" checked={active} className={`toggle toggle-lg  ${!active ? "" : "bg-green-500"}`} onChange={selectOffline} />
          </div>
        </div>
      </div>

      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle text-white">
        <div className="modal-box">
          {error && (
            <div className="alert alert-error shadow-lg my-5">
              <div>
                <RailwayAlertIcon className="stroke-current flex-shrink-0 h-6 w-6" />
                <span>{error}</span>
              </div>
            </div>
          )}
          {!customer && (
            <>
              <h3 className="font-bold text-lg text-black">Enter the trip Id </h3>
              <div className="flex justify-center items-center w-full ">
                <div className="form-control md:mt-10 w-56 ">
                  <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    className="input input-bordered text-black"
                    onChange={(e) => setid(e.target.value)}
                  />

                  <button className="btn btn-outline btn-error w-24 my-2 mx-16" onClick={submitCode}>
                    Start
                  </button>
                </div>
              </div>
            </>
          )}

          {customer && (
            <>
              <h3 className="font-bold text-lg text-center text-black">Customer details </h3>

              <div className="card w-full bg-base-100 shadow-xl  mt-5 text-black">
                <div className="card-body">
                  <h2 className="card-title text-black">Name: {customer.user.name}</h2>
                  <p className=" text-black">Contact : {customer.user.phone}</p>
                  <p className=" text-black">Pick-up : {customer.location.pickup}</p>
                  <p className=" text-black">Drop-up : {customer.location.dropoff}</p>
                  <p className=" text-black"> Payment : {customer.payment.amount}</p>
                  <p className=" text-black">
                    Status :
                    {customer.payment.status ? (
                      <span className="text-green-500 ml-2 font-bold">Paid</span>
                    ) : (
                      <span className="text-red-500 ml-2 font-bold">Unpaid</span>
                    )}
                  </p>
                  <div className="card-actions justify-end">
                    <label htmlFor="my-modal-6" className="btn bg-red-500 text-black">
                      Wait
                    </label>
                    <label htmlFor="my-modal-6" className="btn btn-primary" onClick={appectRide}>
                      Start To Pickup Now
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverLoacation;
