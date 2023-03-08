const express = require('express')
const jwt = require('jsonwebtoken')
const { ROLE } = require('../../constants/role.constant')

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const Authorization = req.get('Authorization')
    if (Authorization) {
      const token = Authorization.split(' ')[1]
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            res.status(403).json({ message: 'Forbidden', data: {} })
          }

          req.user = user._doc
          next()
        }
      )
    } else {
      return res
        .status(401)
        .json({ message: 'Vui lòng đăng nhập', data: {} })
    }
  },

  verifyTokenCustom: (req, res, next) => {
    const Authorization = req.get('Authorization')
    if (Authorization) {
      const token = Authorization.split(' ')[1]
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            res.status(403).json({ message: 'Forbidden', data: {} })
          }

          req.user = user._doc
          next()
        }
      )
    } else {
      next()
    }
  },

  isAdmin: (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (req.user.roleId.name === ROLE.ADMIN) {
        next()
      } else
        return res
          .status(403)
          .json({ message: 'Forbidden', data: {} })
    })
  },

  isStaff: (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (
        req.user.roleId.name === ROLE.STAFF ||
        req.user.roleId.name === ROLE.ADMIN
      ) {
        next()
      } else
        return res
          .status(403)
          .json({ message: 'Forbidden', data: {} })
    })
  },

  isUser: (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (req.user) {
        next()
      } else
        return res
          .status(403)
          .json({ message: 'Forbidden', data: {} })
    })
  },

  isOptionLogin: (req, res, next) => {
    authMiddleware.verifyTokenCustom(req, res, () => {
      next()
    })
  }
}

module.exports = authMiddleware
