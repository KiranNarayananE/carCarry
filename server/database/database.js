import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import * as dotenv from "dotenv"
dotenv.config();
const url =process.env.url
const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    //     res.redirect("/error");
    console.log(err.message);
  }
};

export default connectDB;