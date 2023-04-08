import React, { useState, useContext, useEffect } from "react";
import { LocationContext } from "../../Context/locationContext";
import { selectTripContext } from "../../Context/SelectTrip";
import axiosInstance from "../../api/axios";
import axios from "axios"
import mapboxgl from "mapbox-gl"
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const RiderSelector = () => {
  const { pickupCoordinates, dropoffCoordinates } = useContext(LocationContext);
  const { driver, selectDriver, setTripDetails } = useContext(selectTripContext);
  const [carlist, setCarlist] = useState([]);
  const [dropOff, setDropoff] = useState();
  const [distance, setDistance] = useState();
   const getDirection = async (pickupCoordinates, dropoffCoordinates) => {
    console.log(pickupCoordinates)
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=${mapboxgl.accessToken}`;
    const result = await axios.get(url);
    console.log(result)
    return result;
  };
  
   const getLocationName = async (lng, lat) => {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`);
    const data = await response.json();
  
    const location = data.features[0].place_name;
    const parts = location.split(",");
    const locationName = `${parts[parts.length - 3]}, ${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
  
    return locationName;
  };

  const getCarList = async (pickupCoordinates) => {
    try {
      const response = await axiosInstance.get("/carlist");
      const data = await response.data.Driver;
      console.log(response,"response")
      const availableCars = [];
  
      for (let i = 0; i < data.length; i++) {
        const car = data[i];
        const availableCar = await getAvaiableCar(pickupCoordinates, car);
        console.log(availableCar,"vail")
        if (availableCar.length > 0) {
          availableCars.push(availableCar[0]);
        }
      }
      return availableCars;
    } catch (error) {
      return error;
    }
  };

  const getAvaiableCar = async (pickupCoordinates, driver) => {
    const carLists = [];
    console.log("entered")
    const driverLocation = driver.current_location.location[0];
    console.log(driverLocation,"driverLocation")
    const findDistance = await getDirection(pickupCoordinates, driverLocation);
    console.log(findDistance,"findDistance")
    const distance = (findDistance.data.routes[0].distance / 1000).toFixed(0);
    console.log(distance)
    
    
      carLists.push(driver);
  
  
    return carLists;
  };
  
  const handleClick = async (car) => {
    const response = await getLocationName(pickupCoordinates[0], pickupCoordinates[1]);
    const response2 = await getLocationName(dropoffCoordinates[0], dropoffCoordinates[1]);
    selectDriver(car);
    setTripDetails({
      pickup: response,
      dropOff: response2,
      driver: driver,
      distance: distance,
    });
  };

  useEffect(() => {
    setDropoff(dropoffCoordinates);
    const carList = async () => {
      const response = await getCarList(pickupCoordinates);
      setCarlist(response);
    };
    carList();
    const tripDetails = async () => {
      const response = await getDirection(pickupCoordinates, dropoffCoordinates);
      const data = response.data.routes[0].distance;
      let distance = Math.floor(data / 1000);
      setDistance(distance);
    };

    tripDetails();
  }, [distance, dropoffCoordinates, pickupCoordinates]);

  return (
    <div className="h-full flex flex-col ">
      {!dropOff || carlist.length === 0 ? (
        <div className="flex justify-center md:mt-48">
          <div className="flex items-center justify-center space-x-2 ">
            <div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
            <div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
            <div className="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
          </div>
        </div>
      ) : (
        <>
          {carlist.length > 0 && (
            <>
              <div className="text-gray-500 text-center text-xs py-2 "></div>
              <div className="flex flex-col flex-1 overflow-scroll scrollbar-hide">
                {carlist.map((car, index) => (
                  <div
                    className={`flex p-3 m-2 items-center border-2 border-white hover:bg-slate-200 cursor-pointer ${
                      driver === car._id ? "bg-slate-200" : ""
                    }`}
                    onClick={() => handleClick(car._id)}
                    key={index}>
                    <img src={`/images/${car.PicturePath}`} alt={car.lastName} height="50" width="50" className="h-14" />
                    <div className="ml-2 flex-1">
                      <div className="font-bold">{`${car.firstName}  ${car.lastName}`}</div>
                      <div className="text-xs text-black font-medium">{car.vehicleModel}</div>

                      <div className="text-xs text-black">{car.vehicleNo}</div>

                      <div className="text-xs text-green-500">{distance} km</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-[-0.8rem]">₹ {car.Rate * distance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RiderSelector;
