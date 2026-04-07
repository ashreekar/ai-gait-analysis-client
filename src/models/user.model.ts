import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  name: { type: String, default: "Guest User" },
  
  // Extra Data from Settings/Pairing
  age: { type: Number },
  weight: { type: Number }, // Critical for gait algorithms
  sleepTimeout: { type: String, default: "5 Min" },
  syncMode: { type: String, default: "Wi-Fi Only" },
  
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return //next();
  this.password = await bcrypt.hash(this.password, 10);
//   next();
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model("User", UserSchema);