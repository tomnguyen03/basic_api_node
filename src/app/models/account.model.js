const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Account = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      minLength: 10,
      maxLength: 11,
      required: false,
      unique: true
    },
    avatar: {
      type: String,
      required: false
    },
    birthday: {
      type: Date,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('account', Account)
