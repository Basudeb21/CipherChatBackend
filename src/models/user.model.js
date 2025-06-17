import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    publicKey: {
        type: String,
        required: [true, "Public key is required"],
        unique: true,
    },
    refreshToken: {
        type: String,
    }


}, {
    timestamps: true
})



export const User = mongoose.model("User", userSchema);