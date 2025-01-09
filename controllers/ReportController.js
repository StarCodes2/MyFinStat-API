// Defines a class that handles all financial summary reports
const AuthController = require('./AuthController');
const dbClient = require('../utils/db');
const ReportTools = require('../utils/ReportTools');

class ReportController {
  static async dailyReport(req, res) {
    // Returns the daily reports for the last 7 days.
    const user = AuthController.checkConnection(req, res);
    if (!user) return user;

    const dateRange = ReportTools.dayRange(new Date(), false);
    const match = {
      userId: user._id,
      created_at: {
        $gte: dateRange.startDate,
        $lt: dateRange.currentDate,
      },
    };

    const group = {
      _id: {
        date: {
          $dateToString: {
            format: '%y-%m-%d', date: { $min: '$created_at' },
	  },
	},
        type: '$type',
      },
      count: { $sum: 1 },
      total: { $sum: '$amount' },
      max: { $max: '$amount' },
      avg: { $avg: '$amount' },
      minDate: { $min: '$created_at' },
    };

    try {
      const result = await dbClient.tranAggregate(match, group);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Requested report not available' });
      }

      const reports = ReportTools.computeReport(result);

      return res.json(reports);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async monthlyReport(req, res) {
    // Returns the daily reports for the last 7 days.
    const user = AuthController.checkConnection(req, res);
    if (!user) return user;

    const dateRange = ReportTools.monthRange(new Date(), false);
    const match = {
      userId: user._id,
      created_at: {
        $gte: dateRange.startDate,
        $lt: dateRange.currentDate,
      },
    };

    const group = {
      _id: {
        date: {
          $dateToString: {
            format: '%y-%m', date: { $min: '$created_at' },
	  },
	},
        type: '$type',
      },
      count: { $sum: 1 },
      total: { $sum: '$amount' },
      max: { $max: '$amount' },
      avg: { $avg: '$amount' },
      minDate: { $min: '$created_at' },
    };

    try {
      const result = await dbClient.tranAggregate(match, group);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Requested report not available' });
      }

      const reports = ReportTools.computeReport(result);

      return res.json(reports);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = ReportController;
