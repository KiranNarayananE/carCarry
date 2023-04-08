import express from "express";
import {approvalList, driverDetails, login, updateApproval, userDetails,blockUser,driverList,blockDriver} from "../controller/admin.js";
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


export default router;