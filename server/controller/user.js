import UserModel from "../model/user.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { generateToken } from "../middleware/auth.js";
import jwt_decode from "jwt-decode"
import DriverModel from "../model/driver.js";
import tripModel from "../model/booking.js";
import  {Trip,findMatchDate,formatDate}  from "./trip.js";
import { addMoneyStrip, paymentStripe, walletPayment } from "./payment.js";


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
    console.log(trips)
    res.status(200).json({ trip: trips });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Internal server error !" });
  }
};
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const bookingList = await tripModel.findOne({_id: new mongoose.Types.ObjectId(id)}
    ).populate("user").populate("driver")
    res.status(200).json({ Bookings: bookingList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
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

    if (lessThanTwoDays) {
      let cost = refundAmount * 0.05;
      await UserModel.updateOne(
        { _id: userId },
        {
          $inc: { "wallet.Amount": refundAmount - cost },
          $push: { "wallet.transactions": { transactionsID: id, method: "refund", cash: refundAmount - cost } },
        }
      );
      await tripModel.updateOne({ _id: id }, { $set: { bookingStatus: "Cancelled", "payment.refund": true } });
      return res.status(200).json({ msg: "Trip cancellated refund credit to wallet after detition" });
    } else {
      await UserModel.updateOne(
        { _id: userId },
        { $inc: { "wallet.Amount": refundAmount }, $push: { "wallet.transactions": { transactionsID: id, method: "refund", cash: refundAmount } } }
      );
      await tripModel.updateOne({ _id: id }, { $set: { bookingStatus: "Cancelled", "payment.refund": true } });
      return res.status(200).json({ msg: "Trip cancellated refund credit to wallet" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error !" });
  }
};

export const paymentAction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.body;
    const trip = await tripModel.findOne({ _id: id });

    if (await walletPayment(userId, trip)) {
      res.status(202).json({ msg: "Payment is done from wallet" });
    } else {
      const response = await paymentStripe(id, trip);
      res.status(200).json({ response });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error !" });
  }
};
export const paymentSucess = async (req, res) => {
  const { id } = req.params;
  let payment = await tripModel.findOneAndUpdate({ _id: id }, { $set: { "payment.status": true } },{new:true});
  const wallet = await DriverModel.updateOne(
    { _id: payment.driver},
    {
      $inc: { "wallet.Amount":payment.payment.amount*.9},
    }
  );
  res.redirect(process.env.REDIRECT_URL);
};
export const userDetails = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await UserModel.findById(id).select({ password: 0, wallet: 0, createdAt: 0, updatedAt: 0 });

    const pending = await tripModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id), bookingStatus: "Driver_Canceled" } },
      { $count: "count" },
    ]);

    if (pending.length === 0) return res.status(201).json({ user: user });

    const results = await tripModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } },
      {
        $facet: {
          canceled: [{ $match: { bookingStatus: "Driver_Canceled" } }, { $count: "count" }],
          confirmed: [{ $match: { bookingStatus: "Conform" } }, { $count: "count" }],
        },
      },
    ]);

    const pendingCount = results[0].canceled[0].count ??0;
    const confirmedCount = results[0].confirmed[0].count ??0;
    return res.status(200).json({ user: user, pending: pendingCount, conform: confirmedCount });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Internal Server Error !" });
  }
};
export const addAmount = async (req, res) => {
  try {
    const id = req.query.id;
    const amount = req.query.amount;
    const wallet = await UserModel.updateOne(
      { _id: id },
      {
        $inc: { "wallet.Amount": amount },
        $push: {
          "wallet.transactions": {
            transactionID: id,
            method: "credit card",
            cash: amount,
          },
        },
      }
    );
    res.redirect("http://localhost:3000/wallet");
  } catch (error) {}
};

export const getWalletBalance = async (req, res) => {
  try {
    const { id } = req.user;
    const balance = await UserModel.findOne({ _id: id }).select({
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      profile: 0,
      phone: 0,
      email: 0,
      _id: 0,
      name: 0,
      __v: 0,
      "wallet.transactions": 0,
    });

    return res.status(200).json({ balance: balance.wallet.Amount });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error !" });
  }
};
export const userProfileUpload = async (req, res) => {
  try {
    const { id } = req.user;
    const imageUrl = req.files[0].filename;
    await UserModel.updateOne({ _id: id }, { $set: { profile: imageUrl } });
    await UserModel.findOne({ _id: id }).then((user) => {
      res.status(200).json({ userProfile: user.profile });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error !" });
  }
};

export const addCashWallet = async (req, res) => {
  try {
    const { id } = req.user;
    const amount = req.body.amount;
    const response = await addMoneyStrip(id, amount);
    res.status(200).json({ response });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error !" });
  }
};
export const getWalletHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const wallet = await UserModel.findOne({ _id: id }).select({
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      profile: 0,
      phone: 0,
      email: 0,
      _id: 0,
      name: 0,
      __v: 0,
    });

    if (wallet.wallet.transactions === 0) return res.status(201).json({ msg: "no wallet transactions" });

    return res.status(200).json({ wallet: wallet.wallet.transactions });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error !" });
  }
};

