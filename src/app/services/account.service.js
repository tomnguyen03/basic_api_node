const authHelper = require('../../helpers/auth.helper')
const AccountModel = require('../models/account.model')

const accountService = {
  createOne: async data => {
    try {
      const account = new AccountModel(data)
      return account.save()
    } catch (error) {
      return error
    }
  },
  findOne: async data => {
    try {
      return AccountModel.findOne(data)
    } catch (error) {
      return error
    }
  },
  find: async () => {
    try {
      return AccountModel.find().select(
        '_id email roleId name avatar phone detail_address createdAt isActive'
      )
    } catch (error) {
      return error
    }
  },
  changePassword: async (userId, data) => {
    try {
      const user = authHelper.changePassword(userId, data)
      return user
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = accountService
