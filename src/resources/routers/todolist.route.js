const express = require('express')
const route = express.Router()
const controller = require('../../app/controllers/todolist.controller')

route.post('/', controller.createTodoItem)

route.get('/', controller.getListTodo)

route.put('/title', controller.updateTodoItem)

route.put('/complete', controller.updateCompleteItem)

route.delete('/', controller.deleteItem)

module.exports = route
