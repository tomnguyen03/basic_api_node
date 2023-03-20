const AccountModel = require('../app/models/account.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validateHelper = require('../helpers/validate.helper')

const authHelper = {
  hashedPassword: password => {
    // using bcrypt npm to hash password
    const salt = bcrypt.genSaltSync(Number.parseInt(process.env.SALT))
    const hashed = bcrypt.hashSync(password, salt)
    return hashed
  },

  checkEmail: async email => {
    const user = await AccountModel.findOne({
      email: email
    })
    if (!user) {
      return false
    }
    return user
  },

  checkPassword: (password1, password2) => {
    const invalidPassword = bcrypt.compareSync(password1, password2)
    if (!invalidPassword) {
      return false
    }

    return invalidPassword
  },

  createToken: payload => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '10d'
    })
  },

  createRefreshToken: payload => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '10d'
    })
  },

  login: async (req, res) => {
    let user = await authHelper.checkEmail(req.body.email)
    let invalidPassword = false
    if (user) {
      invalidPassword = authHelper.checkPassword(
        req.body.password,
        user.password
      )
    }

    if (!user || !invalidPassword) {
      return false
    }

    if (user && invalidPassword) {
      const payload = { ...user }
      const token = authHelper.createToken(payload)
      const refreshToken = authHelper.createRefreshToken(payload)

      let { password, __v, ...other } = user._doc
      const res_data = { ...other, token, refreshToken }
      return res_data
    }
  },

  verifyToken: token => {
    const res = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, user) => {
        if (err) {
          return [false, null]
        } else {
          return [true, user]
        }
      }
    )
    return res
  },

  verifyRefreshToken: refreshToken => {
    const res = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, user) => {
        if (err) {
          return [false, null]
        } else {
          return [true, user]
        }
      }
    )
    return res
  },

  changePassword: async (userId, data) => {
    try {
      user = await AccountModel.findOneAndUpdate(
        { _id: userId },
        { password: hashPassword },
        { new: true }
      )
      return user
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = authHelper
