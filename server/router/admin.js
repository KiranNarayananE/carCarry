import express from "express";
import {approvalList, driverDetails, login, updateApproval, userDetails,blockUser,getBookingHistory,getBookingDetails,driverList,blockDriver,barGraph,pieGraph,report} from "../controller/admin.js";
import { verifyTokenAdmin } from "../middleware/auth.js";


const router = express.Router();


router.post("/login", login);
router.get("/approval",verifyTokenAdmin, approvalList)
router.get("/driverList", verifyTokenAdmin,driverList)
router.patch("/driver", verifyTokenAdmin,blockDriver)
router.get("/details/:id",verifyTokenAdmin, driverDetails)
router.post("/approval", verifyTokenAdmin, updateApproval)
router.get("/userList", verifyTokenAdmin,userDetails)
router.patch("/user", verifyTokenAdmin,blockUser)
router.get("/booking-history", verifyTokenAdmin, getBookingHistory);
router.get("/booking-details/:id", verifyTokenAdmin, getBookingDetails)
router.get("/salesProject",verifyTokenAdmin,barGraph)
router.get("/graph",verifyTokenAdmin,pieGraph)
router.get("/report",verifyTokenAdmin,report)


export default router;