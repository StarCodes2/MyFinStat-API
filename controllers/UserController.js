const sha1 = require('sha1');
const User = require('../models/User');

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
      const user = User.findUser({ email });
      if (user) {
        return res.status(400).json({ error: 'Email already connect to an account' });
      }

      hashedpwd = sha1(password);
      const user = new User({
        name: { firstname, lastname },
        email,
        password: hashedpwd,
      });
      await user.save();

      res.status(201).json({ id: user._id, status: 'Account created' });
    } catch (err) {
      return res.status(500).json('error': 'Internal Server Error');
    }
  }
}
