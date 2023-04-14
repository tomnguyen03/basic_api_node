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
        let { id, title } = data

        if (title) {
          return TodoListModel.updateOne(
            { _id: id },
            { title }
          ).select('_id title isCompleted')
        }
      }
    } catch (error) {
      return error
    }
  },

  delete: async id => {
    try {
      return TodoListModel.deleteOne({ _id: id })
    } catch (error) {
      return error
    }
  }
}

module.exports = todoListService
