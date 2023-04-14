const lodash = require('lodash')
const TodoListService = require('../services/todolist.service')

const TodoListController = {
  createTodoItem: async (req, res) => {
    try {
      const accountId = req.user._id

      const title = req.body.title

      const response = await TodoListService.createOne({
        userId: accountId,
        title: title
      })

      let { __v, ...other } = response._doc

      return res.status(200).json({
        message: 'Successfully',
        data: other
      })
    } catch (error) {
      console.log(error)
    }
  },

  getListTodo: async (req, res) => {
    try {
      const accountId = req.user._id

      const response = await TodoListService.findByUserId(accountId)

      return res.status(200).json({
        message: 'Successfully',
        data: response
      })
    } catch (error) {
      console.log(error)
    }
  },

  updateTodoItem: async (req, res) => {
    try {
      await TodoListService.update({
        id: req.body.id,
        title: req.body.title
      })

      return res.status(200).json({
        message: 'Successfully',
        data: {}
      })
    } catch (error) {
      console.log(error)
    }
  },

  deleteItem: async (req, res) => {
    try {
      await TodoListService.delete(req.body.id)

      return res.status(200).json({
        message: 'Successfully',
        data: {}
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = TodoListController
