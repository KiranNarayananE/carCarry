import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
       unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    verified: {
     type: Boolean,
      default: true,
    },
    wallet: {
      transactions: [
        {
          transactionID: {
            type: String,
          },
          method: {
            type: String,
          },
          cash: {
            type: Number,
          },
        },
      ],
      Amount: {
        type: Number,
        default: 0,
      },
    },
    profile: {
      type: String,
    },
    profile: {
        type: Boolean,
        default:true
      }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
