const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoList = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('todolist', TodoList)
