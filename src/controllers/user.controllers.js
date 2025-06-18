import { asyncHandelr } from "../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import { User } from "./../models/user.model.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import jwt, { decode } from "jsonwebtoken"


const generateAccessTokenAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");

    }
}


const registerUser = asyncHandelr(async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body
    console.log("Email : ", email);

    if (
        [fullName, email, phoneNumber, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ $or: [{ email }, { phoneNumber }] })

    if (existedUser) {
        throw new ApiError(409, "User with email or phonenumber already exist");
    }


    const user = await User.create({
        fullName,
        email,
        password,
        phoneNumber
    })

    const isUserCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!isUserCreated) {
        throw new (500, "Something went wrong in the time of user registration.");
    }

    return res.status(201).json(
        new ApiResponse(200, isUserCreated, "User Created Successfully....")
    )


})

const loginuser = asyncHandelr(async (req, res) => {
    const { email, password } = req.body


    if (!email) {
        throw new ApiError(400, "Email is required.");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }


    const user = await User.findOne({ $or: [{ email }] })

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const flag = await user.isPasswordCorrect(password);
    if (!flag) {
        throw new ApiError(401, "Incorrect Password.");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshtoken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "User loggedin successfully.")
        )


})

const logoutUser = asyncHandelr(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    })

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out."))

})

const refreshAccessToken = asyncHandelr(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;


    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unautorized Request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token.")
    }


})

const changeCurrentPassword = asyncHandelr(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password");
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))

})

const getCurrentUser = asyncHandelr(async (req, res) => {
    return res.status(200)
        .json(
            new ApiResponse(200, req.user, "Current user data fetched successfully")
        )
})

const updateAccountDetails = asyncHandelr(async (req, res) => {
    const { fullName, email, phoneNumber } = req.body;
    if (!fullName || !email || phoneNumber) {
        throw new ApiError(400, "Full name, phone number and email required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email,
                phoneNumber
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully")
        )
})

export default {
    registerUser,
    loginuser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
}