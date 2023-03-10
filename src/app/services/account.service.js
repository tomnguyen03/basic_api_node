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
  find: async data => {
    try {
      if (data) {
        let { limit, page, ...query } = data
        limit = Number.parseInt(limit) || 10
        let skip = (Number.parseInt(page) - 1) * limit || 0

        return AccountModel.find(query)
          .select(
            '_id email name avatar phone detail_address createdAt isActive'
          )
          .limit(limit)
          .skip(skip)
          .lean()
      }
    } catch (error) {
      return error
    }
  },
  count: async () => {
    return AccountModel.count()
  },
  changePassword: async (userId, data) => {
    try {
      const user = authHelper.changePassword(userId, data)
      return user
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
