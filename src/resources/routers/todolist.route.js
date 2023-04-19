const express = require('express')
const route = express.Router()
const controller = require('../../app/controllers/todolist.controller')

route.post('/', controller.createTodoItem)

route.get('/', controller.getListTodo)

route.put('/title', controller.updateTodoItem)

route.put('/complete', controller.updateCompleteItem)

route.delete('/deleteCompletedItem', controller.deleteCompleteItem)

route.put('/setCompleteAllItem', controller.setCompleteAllItem)

route.delete('/:id', controller.deleteItem)

module.exports = route
