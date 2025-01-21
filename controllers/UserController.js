const sha1 = require('sha1');
const User = require('../models/User');
const Category = require('../models/Category');
const dbClient = require('../utils/db');
const AuthController = require('./AuthController');

class UserController {
  static async createUser(req, res) {
    const {
      firstname, lastname, email, password,
    } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ error: 'Email, Password, Firstname, and Lastname are required' });
    }

    try {
      const userExist = await dbClient.findUser({ email });
      if (userExist) {
        return res.status(400).json({ error: 'Email already connect to an account' });
      }

      const hashedpwd = sha1(password);
      const user = new User({
        name: { first: firstname, last: lastname },
        email,
        password: hashedpwd,
      });
      await user.save();
      // Add default categories to the database
      await Category.insertMany([
        { name: 'Food', userId: user._id },
        { name: 'Rent', userId: user._id },
        { name: 'Others', userId: user._id },
      ]);

      res.status(201).json({ id: user._id, status: 'Account created' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) {
      return user;
    }

    return res.status(201).json({
      id: user._id,
      name: user.fullname,
      email: user.email,
    });
  }
}

module.exports = UserController;
