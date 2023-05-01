import bcrypt from "bcrypt"
import DriverModel from "../model/driver.js";
import tripModel from "../model/booking.js";
import { generateToken } from "../middleware/auth.js";
import mongoose from "mongoose";
import stripePackage from "stripe";
const stripe = stripePackage(process.env.STRIPE_KEY);
import * as dotenv from "dotenv";
dotenv.config()
const paymentAdd = process.env.PAYMENT_ADD_DRIVER;

const generateVerficationCode = () => {
  return Math.floor(500000 + Math.random() * 5000000);
};
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
      DLRCountry,
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
      DLRCountry,
      vehicleModel,
      Rate,
      DLRImage: image,
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
export const carDetails = async (req, res) => {
  try {
    const {
      model,
      vehicleNo,
      place,
      kilometer
    } = req.body;
    const image = req.files[0].filename;
    const start =  await tripModel.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.user.id)},{$set: { vehicleNo,kilometer,place,PicturePath:image}},{new:true})

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.code });
    console.log(err.message);
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
      { $match: { driver: new mongoose.Types.ObjectId(id), bookingStatus: { $nin: ["Pending","Driver_Canceled","Completed" ] } } },
      { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { "user.password": 0, "user.createdAt": 0, "user.updatedAt": 0 } },
    ]);
    res.status(200).json({ Bookings: bookingList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const bookingList = await tripModel.findOne({_id: new mongoose.Types.ObjectId(id)}
    ).populate("user")
    console.log(bookingList)
    res.status(200).json({ Bookings: bookingList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

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
    const code = generateVerficationCode();
    await tripModel.updateOne({ _id: id }, { $set: { bookingStatus: "Conform", verficationCode: code } });
    const driver = await tripModel.findOne({ _id: id });
    const driverId = driver.driver.valueOf();
    const bookingDate = driver.date;

 
    await tripModel.updateMany(
      { driver: new mongoose.Types.ObjectId(driverId), date: bookingDate, bookingStatus: "Pending" },
      { $set: { bookingStatus: "Driver_Canceled", driver: null } }
    );

    res.status(200).json({ success: true });;
  } catch (error) {

  }
};
export const acceptBooking = async (req, res) => {
  try {
    const { id } = req.body;
  
    const driverId = req.user.id;
    const prevBookings = await tripModel.findOne({ _id: id }).select("date");
    console.log(id,driverId,prevBookings)
    const prev = await tripModel.aggregate([{ $match: { driver: new mongoose.Types.ObjectId(driverId), date: prevBookings.date } }]);
    if (prev.length != 0) return res.status(302).json({ msg: "Already booking aviable  in this date" });

    const code = generateVerficationCode();
    await tripModel.updateOne({ _id: id }, { $set: { driver: driverId, bookingStatus: "Conform", verficationCode: code } });

    return res.status(200).json({ msg: "New booking accepted" });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Internal Server Error!" });
  }
};
export const startTrip = async (req, res) => {
  try {
    const {id}=req.body
    const start =  await tripModel.findOneAndUpdate({_id: new mongoose.Types.ObjectId(id)},{$set: { bookingStatus: "Started To Pickup Location" }},{new:true}
      ).populate("user")
     
    console.log(start)

    if (start.length === 0) return res.status(203).json({ ride: false });

    res.status(200).json({ ride: start });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};
export const reachedPickup = async (req, res) => {
  try {
    const {id}=req.body
    const start =  await tripModel.findOneAndUpdate({_id: new mongoose.Types.ObjectId(id)},{$set: { bookingStatus: "Reached Pickup Location" }},{new:true}
      ).populate("user")
     
    

    if (start.length === 0) return res.status(203).json({ ride: false });

    res.status(200).json({ ride: start });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};
export const destinationstart = async (req, res) => {
  try {
    const {id,otp}=req.body
    const start =  await tripModel.findOneAndUpdate({_id: new mongoose.Types.ObjectId(id),verficationCode:otp},{$set: { bookingStatus: "Started To Destination" }},{new:true}
      ).populate("user")
     
    

    if (start.length === 0) return res.status(203).json({ ride: false });

    res.status(200).json({ ride: start });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};
export const emergency = async (req, res) => {
  try {
    const {id,message}=req.body
    const start =  await tripModel.findOneAndUpdate({_id: new mongoose.Types.ObjectId(id),verficationCode:otp},{$set: { emergency: message }},{new:true}
      ).populate("user")
     
    

    if (start.length === 0) return res.status(203).json({ ride: false });

    res.status(200).json({ ride: start });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};
export const endTrip = async (req, res) => {
  try {
    const { id } = req.user;
    await tripModel.aggregate([
      { $match: { driver: new mongoose.Types.ObjectId(id), bookingStatus: "Started To Destination" } },
      { $set: { bookingStatus: "Completed" } },
    ]);

    await DriverModel.updateOne({ _id: id }, { $set: { onRide: false } });

    return res.status(200).json({ msg: "Driver is reached location " });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const startedTrip = async (req, res) => {
  try {
    const { id } = req.user;
    await DriverModel.updateOne({ _id: id }, { $set: { onRide: true } });
    return res.status(200).json({ msg: "Driver is on ride " });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};
export const getWalletBalance = async (req, res) => {
  try {
    const { id } = req.user;
    const balance = await DriverModel.findOne({ _id: id }).select({
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
export const getWalletHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const wallet = await DriverModel.findOne({ _id: id }).select({
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
const addMoneyStrip = async (id, amount) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "INR",
          product_data: {
            name: "Add Payment to your Wallet",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${paymentAdd}?id=${id}&amount=${amount}`,
    // cancel_url: `${paymentCancel}`,
  });
  return session.id;
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
export const addAmount = async (req, res) => {
  try {
    const id = req.query.id;
    const amount = req.query.amount;
    const wallet = await DriverModel.updateOne(
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
    res.redirect("http://localhost:3000/driver/wallet");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error !" })
  }
};
export const barGraph= async (req, res, next) => {
  try {
    const { id } = req.user
      let saleReport
     saleReport = await tripModel.aggregate([
          { $match: { "$and":[
            { driver:new mongoose.Types.ObjectId(id)  },
            { bookingStatus: "Completed" }
        ]} },
          {
              $group: {
                  _id: { $dateToString: { format: "%m", date: "$createdAt" } },
                  totalPrice: { $sum: "$payment.amount" },
                  count: { $sum: 1 },
              },
          }, { $sort: { _id: 1 } }
      ])
     console.log(saleReport)
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
     saleReport = saleReport.map((el) => {
        const newOne = { ...el };
        let id = newOne._id.slice(0, 2)
        if(id<10){
         id = newOne._id.slice(1, 2)}
        newOne._id = months[id-1]

        return newOne;
    })


res.status(200).json({ saleReport: saleReport })
  }
   catch(err){
    res.status(500).json({ error: "Internal Server Error !" })
   }
}
export const pieGraph= async (req, res, next) => {
  try {
    const { id } = req.user
      let saleReport
     saleReport = await tripModel.aggregate([
          { $match: { "$and":[
            { driver:new mongoose.Types.ObjectId(id)  },
            { bookingStatus: { $in: ["Cancelled","Driver_Canceled","Completed" ] } }
        ]} },
          {
            $group: {
              _id:  "$bookingStatus",
              count: { $sum: 1 },
          },
          }, { $sort: { _id: 1 } }
      ])
    


res.status(200).json({ saleReport: saleReport })
  }
   catch(err){
    res.status(500).json({ error: "Internal Server Error !" })
   }
}