// Defines a class that handles all financial summary reports
const AuthController = require('./AuthController');
const dbClient = require('../utils/db');

class ReportController {
  static dayRange(date, weekStart) {
    // Returns the timestamp for the first day of the week or
    // for the same day in the previous week
    if (!(date instanceof Date) || typeof weekStart !== 'boolean') {
      return null;
    }

    const currentDay = date.getDate();
    const weekDay = date.getDay();
    const dayOffset = weekStart ? -weekDay : -7;
    const startDate = new Date(date).setDate(currentDay + dayOffset);

    return { startDate, currentDate: date };
  }

  static monthRange(date, yearStart) {	
    // Returns the timestamp for the first month of the year
    // or for the same month in the previous year
    if (!date instanceof Date || typeof yearStart !== 'boolean') {
      return null;
    }

    const currentMonth = date.getMonth();
    const month = yearStart ? 0 : currentMonth - 12;
    const startDate = new Date(date).setMonth(month, 1);

    return { startDate, currentDate: date };
  }

  static async dailyReport(req, res) {
    // Returns the daily reports for the last 7 days.
    const user = AuthController.checkConnection(req, res);
    if (!user) return user;

    const dateRange = this.dayRange(new Date(), false);
    const match = {
      userId: user._id,
      created_at: {
        $gte: dateRange.startDate,
        $lt: dateRange.currentDate,
      },
    };

    const group = {
      _id: {
        date: { $dateToString: { format: '%y-%m-%d', date: '$created_at' } },
        type: '$type',
      },
      count: { $sum: 1 }
      total: { $sum: '$amount' },
      max: { $max: '$amount' },
      avg: { $avg: '$amount' },
      date: { $min: '$created_at' },
    };

    try {
      const result = await dbClient.tranAggregate(match, group);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Requested report not available' });
      }

      const reports = [];
      let i = 0;
      while (i < result.length) {
        const trans = { [result[i]._id.type]: result[i] };
        const report = {};

        // Checks if other types have reports for this day
        if (trans[0]._id.date === result[i + 1]._id.date) {
	  trans[result[i + 1]._id.type] = result[i + 1];
	}
        if (trans[0]._id.date === result[i + 2]._id.date) {
	  trans[result[i + 2]._id.type] = result[i + 2];
	}

        // Compute and format the report for a single day

        reports.push(report);
        i += Object.keys(trans).length;
      }

      return res.json(reports);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
  }
}
