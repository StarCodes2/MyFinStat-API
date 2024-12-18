const sha1 = require('sha1');
const User = require('../models/User');
const dbClient = require('../utils/db');
const AuthController = require('./AuthController');

class UserController {
  static async createUser(req, res) {
    const { firstname, lastname, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    if (!firstname) {
      return res.status(400).json({ error: 'Missing firstname' });
    }

    if (!lastname) {
      return res.status(400).json({ error: 'Missing lastname' });
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
