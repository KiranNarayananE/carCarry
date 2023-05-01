import express from "express";
import {login,signup,googleAuth,loginSuccess,passwordCheck, carList, bookTrip, driverDetails,getTrips,autoCancel,PendingRide,cancelBooking, paymentAction, paymentSucess, addAmount, userDetails, userProfileUpload, addCashWallet, getWalletHistory, getWalletBalance,getBookingDetails} from "../controller/user.js";
import { verifyTokenUser } from "../middleware/auth.js";
import multer from "../middleware/multer.js"
const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/loginsuccess", loginSuccess);
router.post("/password", passwordCheck);
router.get("/carlist", carList)
router.get("/driver-details", driverDetails)
router.get("/booking-details/:id", verifyTokenUser, getBookingDetails)
router.post("/trip-book",verifyTokenUser, bookTrip);
router.get("/get-trips", verifyTokenUser, getTrips)
router.delete("/auto-cancel", verifyTokenUser, autoCancel);
router.patch("/cancel-ride", verifyTokenUser, PendingRide); 
router.patch("/cancel-booking", verifyTokenUser, cancelBooking);
router.patch("/payment-action", verifyTokenUser, paymentAction);
router.get("/payment-success/:id", paymentSucess);
router.get("/payment-add", addAmount);
router.get("/info", verifyTokenUser, userDetails); 
router.get("/wallet-balance", verifyTokenUser, getWalletBalance);
router.get("/wallet-details", verifyTokenUser, getWalletHistory);
router.post("/profile", multer.array("image", 4), verifyTokenUser, userProfileUpload); 
router.post("/add-cash", verifyTokenUser, addCashWallet);


export default router;