import express from "express";
import {acceptRide, declineRide, endTrip, getBookingDetails, getBookingHistory, getBookings, getCurrentLocation, getPendingBookingList, login, setCurrentLocation, signup, startTrip, startedTrip,reachedPickup,destinationstart, acceptBooking,getWalletBalance,getWalletHistory,addCashWallet,addAmount,barGraph,pieGraph,emergency} from "../controller/driver.js";
import { verifyTokenDriver } from "../middleware/auth.js";
import multer from "../middleware/multer.js"

const router = express.Router();

router.post("/signup",multer.array("image", 4),signup)
router.post("/login", login);
router.get("/current-location", verifyTokenDriver, getCurrentLocation);
router.post("/car",verifyTokenDriver,multer.array("image", 4),signup)
router.patch("/set-location", verifyTokenDriver, setCurrentLocation);
router.get("/bookings", verifyTokenDriver, getBookings); 
router.get("/pending-bookinglist", verifyTokenDriver, getPendingBookingList); 
router.get("/booking-history", verifyTokenDriver, getBookingHistory);
router.get("/booking-details/:id", verifyTokenDriver, getBookingDetails)
router.patch("/accept-ride", verifyTokenDriver, acceptRide);
router.patch("/accept-booking", verifyTokenDriver, acceptBooking);
router.patch("/decline-ride", verifyTokenDriver, declineRide);
router.patch("/trip-start", verifyTokenDriver, startTrip)
router.patch("/trip-reachedPickup", verifyTokenDriver, reachedPickup); 
router.patch("/trip-destination", verifyTokenDriver, destinationstart); 
router.patch("/trip-end", verifyTokenDriver, endTrip); 
router.patch("/trip-on", verifyTokenDriver, startedTrip)
router.patch("/emergency", verifyTokenDriver, emergency)
router.get("/wallet-balance", verifyTokenDriver, getWalletBalance);
router.get("/wallet-details", verifyTokenDriver, getWalletHistory);
router.post("/add-cash", verifyTokenDriver, addCashWallet);
router.get("/payment-add", addAmount);
router.get("/salesProject",verifyTokenDriver,barGraph)
router.get("/graph",verifyTokenDriver,pieGraph)



export default router;