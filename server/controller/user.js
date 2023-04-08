import UserModel from "../model/user.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { generateToken } from "../middleware/auth.js";
import jwt_decode from "jwt-decode"
import DriverModel from "../model/driver.js";
import tripModel from "../model/booking.js";
import  {Trip,findMatchDate,formatDate}  from "./trip.js";


export const signup = async (req, res) => {
  try {
    const { email, password, phone, name } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await newUser.save();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
     console.log(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      res.status(200).json({ email });
    } else {
      
      const { phone, email, _id } = user;
 
      res.status(200).json({ phone, email, _id });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Google Auth  //

export const googleAuth = (req, res) => {
  const { id } = req.body;
  console.log(id)
  const decoded = jwt_decode(id);
  console.log(decoded)
  googleLogin(req, res, decoded);
};

//  user find //
const googleLogin = async (req, res, user) => {
  try {
    const findUser = await UserModel.findOne({ email: user.email });

    if (!findUser) {
      return res.status(201).json({ email: user.email });
    } else {
      const { phone, email, _id } = findUser;
      return res.status(200).json({ phone, email, _id });
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};
//  user loginSuccess after OTP//
export const loginSuccess = async (req, res) => {
  try {
    const {phone } = req.body;
  const user = await UserModel.findOne({ phone: phone,verified:true  });
      const { name, _id } = user;
      const token = generateToken(_id,"user");
      res.status(201).json({ token, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Password Check //
export const passwordCheck = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await UserModel.findOne({ email: email,verified:true });

    if (!user) return res.status(400).json({ msg: "Invalid User" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Incorrect Password " });

    const { _id, name } = user;
    const token = generateToken(_id,"user");
    res.status(200).json({ token, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const carList = async (req, res) => {
  try {
    console.log("sss");
    const driver = await DriverModel.aggregate([{ $match: { Approval: true, "current_location.status": true } }]);
    console.log(driver);
    res.status(200).json({ Driver: driver });
  } catch (error) {
    res.status(500).json({ error: "Internal server error !" });
  }
};

export const driverDetails = async (req, res) => {
  try {
    const { id } = req.query;
    const driver = await DriverModel.findById(id);
    res.status(200).json({ driver: driver });
  } catch (error) {
    res.status(500).json({ error: "Internal server error !" });
  }
};
//* Booked trip *//
export const bookTrip = async (req, res) => {
  try {
    console.log(req.body)
    const userId = req.user.id;
    const { date, time, driverID, pickup, dropoff, distance } = req.body;
    

    const addTrip = await Trip(date, time, driverID, pickup, dropoff, distance, userId);
    if (!addTrip) return res.status(404).json({ success: false });
   else
    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error !" });
  }
};
export const getTrips = async (req, res) => {
  try {
    const Id = req.user.id;
    const trips = await tripModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(Id) } },
      { $lookup: { from: "drivers", localField: "driver", foreignField: "_id", as: "driver" } },
      { $project: { "driver.password": 0 } },
    ]);
    res.status(200).json({ trip: trips });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Internal server error !" });
  }
};
export const PendingRide = async (req, res) => {
  try {
    const { tripId } = req.body;
    await tripModel.updateOne({ _id: tripId }, { $set: { bookingStatus: "Cancelled" } });
    return res.status(200).json({ msg: "Booking has been canceled" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error !" });
  }
};

export const autoCancel = async (req, res) => {
  try {
    const date = formatDate(currentDate);
    const cancel = await findMatchDate(date);

    if (cancel) {
      console.log(cancel);
      return res.status(200).json({ msg: "Pending Booking as cancelled" });
    } else {
      return res.status(204).json({ msg: "No Pending Booking on current Date" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error !" });
  }
};
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.body;
    const trip = await tripModel.findById(id);
    const refundAmount = trip.payment.amount;
    const userId = trip.user.valueOf();

    const timestamp = Date.parse(trip.date);
    const givenDate = new Date(timestamp);
    const diffMs = givenDate - currentDate;
    const lessThanTwoDays = diffMs < 48 * 60 * 60 * 1000;
    await tripModel.updateOne({ _id: id }, { $set: { bookingStatus: "Cancelled"} });
      return res.status(200).json({ msg: "Trip cancellated " });

  
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error !" });
  }
};