const express = require('express')
const route = express.Router()
const controller = require('../../app/controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

route.post('/register', controller.registerUser)
route.post('/login', controller.login)
route.get('/users', authMiddleware.isUser, controller.getUser)
route.get(
  '/users/search',
  authMiddleware.isUser,
  controller.getListSearch
)
route.get(
  '/user/:id',
  authMiddleware.isUser,
  controller.getDetailUser
)
route.put(
  '/my-account/update',
  authMiddleware.isUser,
  controller.update
)
route.get(
  '/my-account',
  authMiddleware.isUser,
  controller.getMyAccount
)
route.put(
  '/my-account/change-password',
  authMiddleware.isUser,
  controller.changePassword
)
// route.get(
//   '/statistical',
//   authMiddleware.isAdmin,
//   controller.statistical
// )
// route.get('/user', authMiddleware.isAdmin, controller.getAllUser)
// route.put(
//   '/updateActive',
//   authMiddleware.isAdmin,
//   controller.updateAccountActive
// )
// route.put(
//   '/updateRole',
//   authMiddleware.isAdmin,
//   controller.updateRole
// )
// route.get('/roles', controller.getRole)

module.exports = route
