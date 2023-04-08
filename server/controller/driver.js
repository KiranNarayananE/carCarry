import bcrypt from "bcrypt"
import DriverModel from "../model/driver.js";
import tripModel from "../model/booking.js";
import { generateToken } from "../middleware/auth.js";
import mongoose from "mongoose";
// * REGISTER DRIVER    *//

export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      city,
      state,
      zip,
      DLRNO,
      vehicleNo,
      vehicleModel,
      Rate,
    } = req.body;
    console.log(req.files)
    const image = req.files[0].filename;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new DriverModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      city,
      state,
      zip,
      DLRNO,
      vehicleNo,
      vehicleModel,
      Rate,
      PicturePath: image,
    });
    await newUser.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.code });
    console.log(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const driver = await DriverModel.findOne({ email: email });

    if (!driver) return res.status(201).json({ msg: "Invalid Email " });

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) return res.status(202).json({ msg: "Incorrect Password " });
    const { _id, firstName, lastName, Approval } = driver;

    const token = generateToken(_id,"driver");
    console.log(token);
    res.status(200).json({
      token: token,
      name: firstName + " " + lastName,
      approve: Approval,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getCurrentLocation = async (req, res) => {
  try {
    const { id } = req.user;
    const currentLocation = await DriverModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $project: { _id: 0, current_location: 1, onRide: 1 } },
    ]);

    const location = currentLocation[0].current_location.location[0];
    const status = currentLocation[0].current_location.status;
    const rideOn = currentLocation[0].onRide;

    if (rideOn === true) return res.status(302).json({ msg: "Driver is on ride" });
    if (!location) return res.status(306).json({ msg: "No current location" });

    res.status(200).json({ location, status, rideOn });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const setCurrentLocation = async (req, res) => {
  try {
    const { location, status } = req.body;

    const { id } = req.user;
    await DriverModel.updateOne(
      { _id: id },
      {
        $set: { current_location: { location: location, status: status }, onRide: false },
      }
    );

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};
export const getBookings = async (req, res) => {
  try {
    const { id } = req.user;
    const bookings = await tripModel.aggregate([
      { $match: { driver: new mongoose.Types.ObjectId(id), bookingStatus: "Pending" } },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
      { $project: { "user.password": 0 } },
    ]);
    return res.status(200).json({ trips: bookings });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error !" });
  }
};
export const getBookingHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const bookingList = await tripModel.aggregate([
      { $match: { driver: new mongoose.Types.ObjectId(id), bookingStatus: "Conform" } },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { "user.password": 0, "user.createdAt": 0, "user.updatedAt": 0 } },
    ]);
    res.status(200).json({ Bookings: bookingList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const getPendingBookingList = async (req, res) => {
  try {
    const bookings = await tripModel.aggregate([
      { $match: { bookingStatus: "Driver_Canceled" } },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { "user.password": 0, "user.createdAt": 0, "user.updatedAt": 0 } },
    ]);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const declineRide = async (req, res) => {
  try {
    const { id } = req.body;
    await tripModel.updateOne({ _id: id }, { $set: { bookingStatus: "Driver_Canceled", driver: null } });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const { id } = req.body;
    const generateVerficationCode = () => {
      return Math.floor(500000 + Math.random() * 5000000);
    };
    const code = generateVerficationCode();
    await tripModel.updateOne({ _id: id }, { $set: { bookingStatus: "Conform", verficationCode: code } });
    const driver = await tripModel.findOne({ _id: id });
    const driverId = driver.driver.valueOf();
    const bookingDate = driver.date;

    
    await tripModel.updateMany(
      { driver: mongoose.Types.ObjectId(driverId), date: bookingDate, bookingStatus: "Pending" },
      { $set: { bookingStatus: "Driver_Canceled", driver: null } }
    );

    res.sendStatus(200);
  } catch (error) {}
};

