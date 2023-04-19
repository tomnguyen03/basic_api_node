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

      const filter = req.query.filter

      if (filter) {
        if (filter === 'active') {
          data = response.filter(item => !item.isCompleted)
        }

        if (filter === 'completed') {
          data = response.filter(item => item.isCompleted)
        }

        return res.status(200).json({
          message: 'Successfully',
          data
        })
      } else {
        return res.status(200).json({
          message: 'Successfully',
          data: response
        })
      }
    } catch (error) {
      console.log(error)
    }
  },

  updateTodoItem: async (req, res) => {
    try {
      await TodoListService.update({
        id: req.body.id,
        title: req.body.title,
        userId: req.user._id
      })

      return res.status(200).json({
        message: 'Successfully',
        data: {}
      })
    } catch (error) {
      console.log(error)
    }
  },

  updateCompleteItem: async (req, res) => {
    try {
      await TodoListService.updateComplete({
        id: req.body.id,
        userId: req.user._id
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
      await TodoListService.delete(req.params.id, req.user._id)

      return res.status(200).json({
        message: 'Successfully',
        data: {}
      })
    } catch (error) {
      console.log(error)
    }
  },

  deleteCompleteItem: async (req, res) => {
    try {
      await TodoListService.deleteMany(req.user._id)

      return res.status(200).json({
        message: 'Successfully',
        data: {}
      })
    } catch (error) {
      console.log(error)
    }
  },

  setCompleteAllItem: async (req, res) => {
    try {
      await TodoListService.setCompleteAllItem(req.user._id)

      return res.status(200).json({
        message: 'Successfully',
        data: {}
      })
    } catch (error) {
      console.log(error)
    }
  },

  getItemLeft: async (req, res) => {
    try {
      const data = await TodoListService.getItemLeft(req.user._id)

      return res.status(200).json({
        message: 'Successfully',
        data
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = TodoListController
