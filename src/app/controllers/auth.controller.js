const accountService = require('../services/account.service')
const authHelper = require('../../helpers/auth.helper')
const { ROLE } = require('../../constants/role.constant')
const accountModel = require('../models/account.model')

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
          .json({ message: 'Email đã tồn tại', key: 'email' })
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
        throw new Error('Sai tài khoản hoặc mật khẩu')
      }
      if (loginResult.isActive === false) {
        return res
          .status(405)
          .json({ message: 'Tài khoản đã bị khóa' })
      }

      return res.json({ message: 'Successfully', data: loginResult })
    } catch (error) {
      return res
        .status(403)
        .json({ message: error.message, data: error })
    }
  }

  // update: async (req, res) => {
  //   const form = formidable({ multiples: true })

  //   form.parse(req, async (err, fields, files) => {
  //     if (err) {
  //       next(err)
  //       return
  //     }
  //     try {
  //       const accountId = req.user._id
  //       let data = {}

  //       if (!lodash.isEmpty(files.avatar)) {
  //         const filepath = files.avatar.filepath
  //         const { url } = await uploader(filepath)
  //         data = { ...fields, avatar: url }
  //       } else {
  //         data = { ...fields }
  //       }
  //       await accountService.update(accountId, data)
  //       const dataAfterUpdate = await accountService.findOne({
  //         _id: accountId
  //       })
  //       const { password, ...result } = dataAfterUpdate._doc
  //       return res
  //         .status(200)
  //         .json({ message: 'Successfully', data: result })
  //     } catch (error) {
  //       return res
  //         .status(400)
  //         .json({ message: error.message, data: error })
  //     }
  //   })
  // },

  // changePassword: async (req, res) => {
  //   try {
  //     const userId = req.user._id
  //     const user = await accountService.changePassword(
  //       userId,
  //       req.body
  //     )
  //     return res
  //       .status(200)
  //       .json({ message: 'Successfully', result: user })
  //   } catch (error) {
  //     return res
  //       .status(400)
  //       .json({ message: error.message, data: error })
  //   }
  // },

  // getAllUser: async (req, res) => {
  //   try {
  //     const data = await accountService.find()

  //     return res.status(200).json({
  //       message: 'Successfully',
  //       data: data
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

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
  // },

  // getRole: async (_, res) => {
  //   try {
  //     const role = await roleService.getRole()

  //     return res.status(200).json({
  //       message: 'Successfully',
  //       data: role
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}

module.exports = AuthController
