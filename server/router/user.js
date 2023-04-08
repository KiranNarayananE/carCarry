import express from "express";
import {login,signup,googleAuth,loginSuccess,passwordCheck, carList, bookTrip, driverDetails,getTrips,autoCancel,PendingRide,cancelBooking} from "../controller/user.js";
import { verifyTokenUser } from "../middleware/auth.js";
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/loginsuccess", loginSuccess);
router.post("/password", passwordCheck);
router.get("/carlist", carList)
router.get("/driver-details", driverDetails)
router.post("/trip-book",verifyTokenUser, bookTrip);
router.get("/get-trips", verifyTokenUser, getTrips)
router.delete("/auto-cancel", verifyTokenUser, autoCancel);
router.patch("/cancel-ride", verifyTokenUser, PendingRide); 
router.patch("/cancel-booking", verifyTokenUser, cancelBooking);
export default router;