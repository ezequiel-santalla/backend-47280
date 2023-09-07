import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
  email: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  }
})

const MessageModel = model('messages', messageSchema)

export default MessageModel