const TodoListModel = require('../models/todolist.model')

const todoListService = {
  createOne: async data => {
    try {
      const item = new TodoListModel(data)

      return item.save()
    } catch (error) {
      return error
    }
  },

  getDetailItem: async id => {
    try {
      return TodoListModel.findOne({ _id: id })
    } catch (error) {
      return error
    }
  },

  findByUserId: async id => {
    try {
      if (id) {
        return TodoListModel.find({ userId: id }).select(
          '_id title isCompleted'
        )
      }
    } catch (error) {
      return error
    }
  },

  update: async data => {
    try {
      if (data) {
        let { id, title, userId } = data

        if (title) {
          return TodoListModel.updateOne(
            { _id: id, userId },
            { title }
          ).select('_id title isCompleted')
        }
      }
    } catch (error) {
      return error
    }
  },

  updateComplete: async data => {
    try {
      if (data) {
        let { id, userId } = data

        const dataItem = await todoListService.getDetailItem(id)

        return TodoListModel.updateOne(
          { _id: id, userId: userId },
          { isCompleted: !dataItem._doc.isCompleted }
        )
      }
    } catch (error) {
      return error
    }
  },

  delete: async (id, userId) => {
    try {
      return TodoListModel.deleteOne({ _id: id, userId: userId })
    } catch (error) {
      return error
    }
  },

  deleteMany: async userId => {
    try {
      return TodoListModel.deleteMany({
        userId: userId,
        isCompleted: true
      })
    } catch (error) {
      return error
    }
  },

  setCompleteAllItem: async userId => {
    try {
      const todoList = await todoListService.findByUserId(userId)

      if (todoList.some(item => item.isCompleted === false)) {
        return TodoListModel.updateMany(
          { userId: userId },
          { isCompleted: true }
        )
      }

      if (todoList.every(item => item.isCompleted === true)) {
        return TodoListModel.updateMany(
          { userId: userId },
          { isCompleted: false }
        )
      }
    } catch (error) {
      return error
    }
  }
}

module.exports = todoListService
