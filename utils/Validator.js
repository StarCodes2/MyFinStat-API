// Validates user inputs
const mongoose = require('mongoose');

class Validator {
  static isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  static isNumber(str) {
    const num = Number(str);
    return !Number.isNaN(num);
  }

  static isValidType(str) {
    if (str !== 'income' && str !== 'expense' && str !== 'savings') {
      return false;
    }

    return true;
  }

  static isValidRepeat(str) {
    if (str !== 'stop' && str !== 'daily' && str !== 'weekly'
        && str !== 'monthly' && str !== 'quaterly' && str !== 'yearly') {
      return false;
    }

    return true;
  }
}

module.exports = Validator;
