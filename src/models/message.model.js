import mongoose, { Schema } from "mongoose";


const messageSchema = new Schema({
    conversationId: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    cipherText: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
    },
    iv: {
        type: String,
        required: [true, "IV is required"],
        trim: true,
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    messageType: {
        type: String,
        enum: ["text", "image", "file", "audio"],
        default: "text"
    }

}, {
    timestamps: true
})



export const Message = mongoose.model("Message", messageSchema);