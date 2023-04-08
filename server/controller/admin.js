import UserModel from "../model/user.js";
import DriverModel from "../model/driver.js";
import bcrypt from "bcrypt";
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