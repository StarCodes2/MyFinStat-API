const sha1 = require('sha1');
const User = require('../models/User');
const Category = require('../models/Category');
const dbClient = require('../utils/db');
const ReportTools = require('../utils/ReportTools');
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

    // Range beginning of the current year till present date
    const dateRange = ReportTools.monthRange(new Date(), true);
    const match = {
      userId: user._id,
      date: {
        $gte: dateRange.startDate,
        $lt: dateRange.currentDate,
      },
    };

    const group = {
      _id: {
        date: { $substr: [{ $year: '$date' }, 0, 4] },
        type: '$type',
      },
      count: { $sum: 1 },
      total: { $sum: '$amount' },
      avg: { $avg: '$amount' },
      max: { $max: '$amount' },
      minDate: { $min: '$date' },
    };

    try {
      const result = await dbClient.tranAggregate({
        match,
        group,
      });

      let report = [`No reports available for ${dateRange.startDate.getFullYear()}!`];
      if (result.length !== 0) {
        report = ReportTools.computeReport(result);
      }

      return res.status(201).json({
        id: user._id,
        name: user.fullname,
        email: user.email,
        report: report[0],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UserController;
