import mongoose from "mongoose";
import todo from "../model/todo.model.js"
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({

    UserName: {
        type: "String",
        required: [true, "please Enter UserName"],
        unique: [true, "UserName in Use"],
      },
      email: {
        type: "String",
        required: [true, "please Enter Email"],
        unique: [true, "Email in Use"],
      },
      password: {
        type: "String",
        required: [true, "please Enter Password"],
      },
      
      list:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'todo'
      }]
})

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (e) {
    console.log("Failed to hash!");
  }
});


export default mongoose.model('user',UserSchema);