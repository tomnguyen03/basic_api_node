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
      return AccountModel.findOne(data).select(
        '_id email username name avatar phone address birthday createdAt isActive'
      )
    } catch (error) {
      return error
    }
  },
  find: async data => {
    try {
      if (data) {
        let { limit, page } = data
        limit = Number.parseInt(limit) || 10
        let skip = (Number.parseInt(page) - 1) * limit || 0

        return AccountModel.find()
          .select(
            '_id email username name avatar phone address birthday createdAt isActive'
          )
          .limit(limit)
          .skip(skip)
      }
    } catch (error) {
      return error
    }
  },
  search: async data => {
    try {
      if (data) {
        let { searchName } = data

        if (searchName) {
          return AccountModel.find({ name: searchName }).select(
            '_id name'
          )
        }
      }
    } catch (error) {
      return error
    }
  },
  count: async query => {
    return AccountModel.count(query)
  },
  changePassword: async (userId, data) => {
    try {
      return AccountModel.findOneAndUpdate(
        { _id: userId },
        { password: authHelper.hashedPassword(data.newPassword) },
        { new: true }
      )
    } catch (error) {
      throw new Error(error)
    }
  },
  update: async (id, data) => {
    try {
      return AccountModel.updateOne({ _id: id }, data)
    } catch (error) {
      return error
    }
  }
}

module.exports = accountService
