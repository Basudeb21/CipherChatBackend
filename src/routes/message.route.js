import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    sendMessage,
    getMessage,
    markAsRead,
    deleteMessage
} from "./../controllers/message.controller.js";

const router = Router()


router.route("/send-message").post(verifyJWT, sendMessage);
router.route("/receive-message").post(verifyJWT, getMessage);
router.route("/mark-as-read").post(verifyJWT, markAsRead);
router.route("/delete").post(verifyJWT, deleteMessage);




export default router