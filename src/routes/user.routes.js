import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    registerUser,
    loginuser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
} from "./../controllers/user.controllers.js"


const router = Router()


router.route("/register").post(registerUser);
router.route("/login").post(loginuser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-password").post(verifyJWT, changeCurrentPassword);
router.route("/user").get(verifyJWT, getCurrentUser);
router.route("/update-account").post(verifyJWT, updateAccountDetails);







export default router