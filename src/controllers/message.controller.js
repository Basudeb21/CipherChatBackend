import { asyncHandelr } from "../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import { Message } from "./../models/message.model.js";



const sendMessage = asyncHandelr(async (req, res) => {
    const { receiverID, cipherText, iv, messageType = "text" } = req.body

    if (!receiverID || !cipherText || !iv) {
        throw new ApiError(400, "All fields are required")
    }


    const senderID = req.user._id;
    const conversationId = [senderID.toString(), receiverID.toString()].sort().join("_");

    const message = await Message.create({
        conversationId,
        receiver: receiverID,
        sender: senderID,
        cipherText,
        iv,
        messageType
    })


    if (!message) {
        throw new (500, "Something went wrong in the time of sending message.");
    }

    return res.status(201).json(
        new ApiResponse(200, message, "Message sent successfully....")
    )


});

const getMessage = asyncHandelr(async (req, res) => {
    const receiverID = req.user._id;
    const { senderID } = req.body;

    if (!senderID) {
        throw new ApiError(400, "Sender ID is required");
    }

    const conversationId = [receiverID.toString(), senderID.toString()].sort().join("_");

    const messages = await Message.find({
        conversationId,
        receiver: receiverID,
        isDelivered: false
    }).sort({ createdAt: 1 });

    await Message.updateMany(
        { conversationId, receiver: receiverID, isDelivered: false },
        { $set: { isDelivered: true } }
    );

    return res.status(200).json(
        new ApiResponse(200, messages, "New messages fetched successfully")
    );
});

const markAsRead = asyncHandelr(async (req, res) => {
    const receiverID = req.user._id;
    const { senderID } = req.body;

    if (!senderID) throw new ApiError(400, "Sender ID is required");

    const result = await Message.updateMany(
        { sender: senderID, receiver: receiverID, isRead: false },
        { $set: { isRead: true } }
    );

    return res.status(200).json(new ApiResponse(200, result, "Messages marked as read"));
});

const deleteMessage = asyncHandelr(async (req, res) => {
    const userID = req.user._id;
    const { messageId } = req.body;

    if (!messageId) {
        throw new ApiError(400, "Message ID is required");
    }

    const message = await Message.findById(messageId);

    if (!message) {
        throw new ApiError(404, "Message not found");
    }

    if (message.sender.toString() !== userID.toString()) {
        throw new ApiError(403, "You are not authorized to delete this message");
    }

    await message.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Message deleted successfully")
    );
});

export default { sendMessage, getMessage, markAsRead, deleteMessage }