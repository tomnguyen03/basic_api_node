const formidable = require('formidable')
const lodash = require('lodash')
const accountService = require('../services/account.service')
const authHelper = require('../../helpers/auth.helper')
const accountModel = require('../models/account.model')
const uploader = require('../../config/cloudinary/cloudinary.config')

const AuthController = {
  registerUser: async (req, res) => {
    try {
      if (!req.body) {
        throw new Error('Invalid Input value')
      }
      const isExistEmail = await accountService.findOne({
        email: req.body.email
      })
      if (isExistEmail) {
        return res
          .status(403)
          .json({ message: 'Email already exists', key: 'email' })
      }

      const isExistUsername = await accountService.findOne({
        username: req.body.username
      })
      if (isExistUsername) {
        return res.status(403).json({
          message: 'Username already exists',
          key: 'username'
        })
      }

      req.body.password = authHelper.hashedPassword(req.body.password)
      await accountService.createOne({ ...req.body, isActive: true })
      const user = await accountModel.findOne({
        email: req.body.email
      })
      const token = authHelper.createToken({ ...user })
      const refreshToken = authHelper.createRefreshToken({ ...user })
      let { password, __v, ...other } = user._doc
      const res_data = { ...other, token, refreshToken }
      return res.json({ message: 'Successfully', data: res_data })
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, data: error })
    }
  },

  login: async (req, res) => {
    try {
      const loginResult = await authHelper.login(req, res)
      if (!loginResult) {
        throw new Error('Invalid account or password')
      }
      if (loginResult.isActive === false) {
        return res.status(405).json({ message: 'Account is blocked' })
      }

      return res.json({ message: 'Successfully', data: loginResult })
    } catch (error) {
      return res
        .status(403)
        .json({ message: error.message, data: error })
    }
  },

  update: async (req, res, next) => {
    const form = formidable({ multiples: true })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err)
        return
      }
      try {
        const accountId = req.user._id
        let data = {}

        const dataFields = {
          name: fields.name,
          phone: fields.phone,
          address: fields.address,
          birthday: fields.birthday
        }

        if (!lodash.isEmpty(files.avatar)) {
          const filepath = files.avatar.filepath
          const { url } = await uploader(filepath)
          data = { ...dataFields, avatar: url }
        } else {
          data = { ...dataFields }
        }
        await accountService.update(accountId, data)
        const dataAfterUpdate = await accountService.findOne({
          _id: accountId
        })
        const { password, ...result } = dataAfterUpdate._doc
        return res
          .status(200)
          .json({ message: 'Successfully', data: result })
      } catch (error) {
        return res
          .status(403)
          .json({ message: error.message, data: error })
      }
    })
  },

  getMyAccount: async (req, res) => {
    try {
      const accountId = req.user._id

      const response = await accountService.findOne({
        _id: accountId
      })

      let { password, __v, ...data } = response._doc

      return res.status(200).json({
        message: 'Successfully',
        data
      })
    } catch (error) {
      console.log(error)
    }
  },

  changePassword: async (req, res) => {
    try {
      const userId = req.user._id
      const response = await accountService.changePassword(
        userId,
        req.body
      )

      let { password, __v, ...data } = response._doc
      return res
        .status(200)
        .json({ message: 'Successfully', data: data })
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message, data: error })
    }
  },

  getUser: async (req, res) => {
    try {
      const totalItem = await accountService.count()
      const limit = Number.parseInt(req.query.limit) || 10
      const page = Number.parseInt(req.query.page) || 1

      const data = await accountService.find({ limit, page })
      const meta = {
        totalItem,
        totalPage: Math.ceil(totalItem / limit),
        page,
        limit
      }
      return res.status(200).json({
        message: 'Successfully',
        data: data,
        meta
      })
    } catch (error) {
      console.log(error)
    }
  }

  // updateAccountActive: async (req, res) => {
  //   try {
  //     const id = req.body.id
  //     const isActive = req.body.isActive

  //     await accountService.update(id, { isActive: isActive })

  //     return res.status(200).json({
  //       message: 'Successfully'
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // },

  // updateRole: async (req, res) => {
  //   try {
  //     const id = req.body.id
  //     const roleId = req.body.roleId

  //     await accountService.update(id, { roleId: roleId })

  //     return res.status(200).json({
  //       message: 'Successfully'
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}

module.exports = AuthController
