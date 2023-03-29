const formidable = require('formidable')
const lodash = require('lodash')
const accountService = require('../services/account.service')
const authHelper = require('../../helpers/auth.helper')
const accountModel = require('../models/account.model')
const uploader = require('../../config/cloudinary/cloudinary.config')
const validateHelper = require('../../helpers/validate.helper')

const AuthController = {
  registerUser: async (req, res) => {
    try {
      if (!req.body) {
        throw new Error('Invalid Input value')
      }

      if (!validateHelper.email(req.body.email)) {
        return res.status(403).json({
          message: 'Email invalidate',
          key: 'email'
        })
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

      if (validateHelper.password(req.body.password)) {
        req.body.password = authHelper.hashedPassword(
          req.body.password
        )
      } else {
        return res.status(403).json({
          message:
            'Password must be 6-16 characters long, and contain at least one uppercase, lowercase, number, symbols.',
          key: 'password'
        })
      }

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

      if (!validateHelper.email(req.body.email)) {
        return res.status(403).json({
          message: 'Email invalidate',
          key: 'email'
        })
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

        if (fields.phone && !validateHelper.phone(fields.phone)) {
          return res.status(403).json({
            message: 'Phone invalidate',
            key: 'phone'
          })
        }

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

      let user = await accountModel.findOne({ _id: userId })

      const { currentPassword, newPassword, confirmPassword } =
        req.body

      //Check user
      if (!user) {
        return res.status(403).json({
          message: 'User is not found'
        })
      }

      //Check invalid password
      const inValidPassword = authHelper.checkPassword(
        currentPassword,
        user.password
      )
      if (!inValidPassword) {
        return res.status(403).json({
          message: 'Invalid old password',
          key: 'currentPassword'
        })
      }

      //Check compare pw and new pw
      if (currentPassword === newPassword) {
        return res.status(403).json({
          message:
            'Current password and new password must not be the same',
          key: 'newPassword'
        })
      }

      //Check compare new pw and confirm pw
      if (newPassword !== confirmPassword) {
        return res.status(403).json({
          message: 'New password and confirm password does not match',
          key: 'confirmPassword'
        })
      }

      //Check regex new pw
      if (!validateHelper.password(newPassword)) {
        return res.status(403).json({
          message:
            'Password must be 6-16 characters long, and contain at least one uppercase, lowercase, number, symbols.',
          key: 'newPassword'
        })
      }

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
      const limit = Number.parseInt(req.query.limit) || 10
      const page = Number.parseInt(req.query.page) || 1

      let searchName
      if (!lodash.isEmpty(req.query.search))
        searchName = new RegExp(req.query.search, 'i')

      const data = await accountService.find({
        limit,
        page,
        searchName
      })

      let totalItem
      if (!lodash.isEmpty(req.query.search)) {
        totalItem = await accountService.count({
          name: searchName
        })
      } else {
        totalItem = await accountService.count()
      }

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
  },

  getDetailUser: async (req, res) => {
    try {
      const id = req.params.id

      const data = await accountService.findOne({ _id: id })

      return res.status(200).json({
        message: 'Successfully',
        data: data
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
