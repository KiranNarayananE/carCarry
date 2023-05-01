import UserModel from "../model/user.js";
import DriverModel from "../model/driver.js";
import tripModel from "../model/booking.js"
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { generateToken } from "../middleware/auth.js";
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await UserModel.findOne({ email: email,admin:true });

    if (!admin) return res.status(201).json({ msg: "Invalid Email " });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(202).json({ msg: "Incorrect Password " });
    const { _id, name } = admin;

    const token = generateToken(_id,"admin");
    res.status(200).json({ token: token, name: name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approvalList = async (req, res) => {
  try {
    const driver = await DriverModel.aggregate([{ $match: { Approval: false } }]);
    res.status(200).json({ Driver: driver });
  } catch (err) {
    res.sendStatus(500);
  }
};

export const driverDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await DriverModel.findOne({ _id: id });
    res.status(200).json({ driver });
  } catch (error) {
    res.sendStatus(500);
  }
}
export const updateApproval = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(req.body);
    await DriverModel.updateOne({ _id: id }, { $set: { Approval: true } });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

export const userDetails = async (req, res) => {
  try {
    const user = await UserModel.find({});
    res.status(200).json({ user: user });
  } catch (err) {
    res.sendStatus(500);
  }
}
export const blockUser= async (req, res) => {
  try {
    console.log(req.body);
    const { id,verified } = req.body;
    const user = await UserModel.findOneAndUpdate({ _id: id },{$set:{verified:!verified}},{new:true});
    res.status(200).json({ user });
  } catch (error) {
    res.sendStatus(500);
  }
}
export const driverList = async (req, res) => {
  try {
    const driver = await DriverModel.aggregate([{ $match: { Approval: true } }]);
    res.status(200).json({ driver: driver });
  } catch (err) {
    res.sendStatus(500);
  }
}
export const blockDriver= async (req, res) => {
  try {
    console.log(req.body);
    const { id,verified } = req.body;
    const driver = await DriverModel.findOneAndUpdate({ _id: id },{$set:{verified:!verified}},{new:true});
    res.status(200).json({ driver });
  } catch (error) {
    res.sendStatus(500);
  }
}
export const getBookingHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const bookingList = await tripModel.aggregate([
      { $match: {bookingStatus: { $nin: ["Pending","Driver_Canceled"] } } },
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
    ).populate("user").populate("driver")
    console.log(bookingList)
    res.status(200).json({ Bookings: bookingList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
export const barGraph= async (req, res, next) => {
  try {
    const { id } = req.user
      let saleReport
     saleReport = await tripModel.aggregate([
          { $match:
            { bookingStatus: "Completed" }
        },
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
          { $match:
            { bookingStatus: { $in: ["Cancelled","Driver_Canceled","Completed" ] } }
       },
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
export const report= async (req, res, next) => {
  try {
      let saleReport
   
     saleReport = await tripModel.aggregate([
          { $match:
            { bookingStatus: "Completed" }
         },
          {
              $group: {
                  _id: { $dateToString: { format: "%m-%Y", date: "$createdAt" } },
                  totalPrice: { $sum: "$payment.amount" },
                  count: { $sum: 1 },
              },
          }, { $sort: { _id: 1 } }
      ])
    

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
        console.log(newOne);
        let id = newOne._id.slice(0, 2)
        if(id<10){
         id = newOne._id.slice(1, 2)}
        console.log(id )
        newOne._id = months[id-1]+' '+newOne._id.slice(3);

        return newOne;
    })
  
    console.log(saleReport)
      res.json({ saleReport: saleReport })
  }
   catch(err){
    res.status(500).json({ error: "Internal Server Error !" })
   }
}