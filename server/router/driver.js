import express from "express";
import {acceptRide, declineRide, getBookingHistory, getBookings, getCurrentLocation, getPendingBookingList, login, setCurrentLocation, signup} from "../controller/driver.js";
import { verifyTokenDriver } from "../middleware/auth.js";
import multer from "../middleware/multer.js"

const router = express.Router();

router.post("/signup",multer.array("image", 4),signup)
router.post("/login", login);
router.get("/current-location", verifyTokenDriver, getCurrentLocation);
router.patch("/set-location", verifyTokenDriver, setCurrentLocation);
router.get("/bookings", verifyTokenDriver, getBookings); //* fetch approval list *//
router.get("/pending-bookinglist", verifyTokenDriver, getPendingBookingList); // * fetch pending booking List *//
router.get("/booking-history", verifyTokenDriver, getBookingHistory); //* fetch booking history *//
router.patch("/accept-ride", verifyTokenDriver, acceptRide);
router.patch("/decline-ride", verifyTokenDriver, declineRide);



export default router;