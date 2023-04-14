const express = require('express')
const route = express.Router()
const controller = require('../../app/controllers/todolist.controller')
const authMiddleware = require('../middleware/auth.middleware')

route.post('/', controller.createTodoItem)

route.get('/', controller.getListTodo)

route.put('/', controller.updateTodoItem)

route.delete('/', controller.deleteItem)

module.exports = route
