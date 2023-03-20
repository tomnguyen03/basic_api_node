const passwordValidator = require('password-validator')

const validateHelper = {
  password: password => {
    var schema = new passwordValidator()
    schema
      .is()
      .min(6)
      .is()
      .max(16)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits(1)
      .has()
      .symbols(1)

    return schema.validate(password)
  },

  email: email => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
  },

  phone: phone => {
    return /^[0-9]*$/.test(phone)
  }
}

module.exports = validateHelper
