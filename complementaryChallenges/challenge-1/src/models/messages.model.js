import { Schema, model } from "mongoose";

const messageSchema = new Schema ({
  message: {
    type: String,
    required: true,
  }
})

const MessageModel = model ('message', messageSchema)

export default MessageModel