// Defines a class that handles all financial summary reports
const AuthController = require('./AuthController');
const dbClient = require('../utils/db');
const ReportTools = require('../utils/ReportTools');

class ReportController {
  static async regularReport(req, res) {
    // Returns the daily reports for the last 7 days.
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    // Set the date range and group id date format for the given period
    const { period } = req.params;
    // Get two date objects for 7 days ago and now
    let dateRange = ReportTools.dayRange(new Date(), false);
    let dFormat = '%Y-%m-%d';
    if (period === 'monthly') {
      // Get two date objects set to 12 month ago and now
      dateRange = ReportTools.monthRange(new Date(), false);
      dFormat = '%Y-%m';
    } else if (period === 'yearly') {
      // Get two date objects set to 5 years ago and now
      dateRange = ReportTools.yearRange(new Date(), 5);
      dFormat = '%Y';
    }

    const match = {
      userId: user._id,
      date: {
        $gte: dateRange.startDate,
        $lt: dateRange.currentDate,
      },
    };

    const group = {
      _id: {
        date: {
          $dateToString: {
            format: dFormat, date: { $min: '$date' },
	  },
	},
        type: '$type',
      },
      count: { $sum: 1 },
      total: { $sum: '$amount' },
      max: { $max: '$amount' },
      avg: { $avg: '$amount' },
      minDate: { $min: '$date' },
    };

    try {
      const result = await dbClient.tranAggregate({
        match,
        group,
      });
      if (result.length === 0) {
        return res.status(404).json({ error: 'Requested report not available' });
      }

      // Get an array of reports for each day
      const reports = ReportTools.computeReport(result);

      return res.json(reports);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async weeklyReport(req, res) {
    // Returns the weekly reports for the last 52 weeks.
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    // Get two date objects set to 12 months ago and now
    const dateRange = ReportTools.monthRange(new Date(), false);
    const match = {
      userId: user._id,
      date: {
        $gte: dateRange.startDate,
        $lt: dateRange.currentDate,
      },
    };

    const addField = {
      week: {
        $concat: [
          { $substr: [{ $year: '$date' }, 0, 4] },
          '-W',
          { $substr: [{ $isoWeek: '$date' }, 0, 2] }
        ],
      },
    };

    const group = {
      _id: {
        date: '$week',
        type: '$type',
      },
      count: { $sum: 1 },
      total: { $sum: '$amount' },
      max: { $max: '$amount' },
      avg: { $avg: '$amount' },
      minDate: { $min: '$date' },
    };

    try {
      const result = await dbClient.tranAggregate({
        match,
        addField,
        group,
      });
      if (result.length === 0) {
        return res.status(404).json({ error: 'Requested report not available' });
      }

      // Get an array of reports for each week
      const reports = ReportTools.computeReport(result);

      return res.json(reports);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async quarterlyReport(req, res) {
    // Returns the quarterly reports for the last 2 years.
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    // Get two date objects set to 2 years ago and now
    const dateRange = ReportTools.yearRange(new Date(), 2);
    const match = {
      userId: user._id,
      date: {
        $gte: dateRange.startDate,
        $lt: dateRange.currentDate,
      },
    };

    // Add field to mark data by quarter
    const addField = {
      quarter: {
        $concat: [
          { $substr: [{ $year: '$date' }, 0, 4] },
          '-Q',
          {
            $substr: [{
              $ceil: {
                $divide: [{ $month: '$date' }, 3],
              },
            }, 0, 1]
          },
        ],
      },
    };

    const group = {
      _id: {
        date: '$quarter',
        type: '$type',
      },
      count: { $sum: 1 },
      total: { $sum: '$amount' },
      max: { $max: '$amount' },
      avg: { $avg: '$amount' },
      minDate: { $min: '$date' },
    };

    try {
      const result = await dbClient.tranAggregate({
        match,
        addField,
        group,
      });
      if (result.length === 0) {
        return res.status(404).json({ error: 'Requested report not available' });
      }

      // Get an array of reports for each quarter
      const reports = ReportTools.computeReport(result);

      return res.json(reports);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = ReportController;
