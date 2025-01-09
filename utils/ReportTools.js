// Defines a class that holds all the methods needed to handle all report formatting and calculations

class ReportTools {
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

  static ComputeReport(result) {
    // Computes and returns the formatted reports for a given query result.
    try {
      const reports = [];
      let i = 0;
      while (i < result.length) {
        const type = result[i]._id.type;
        const trans = { [type]: result[i] };
        const report = {};
        let date = null;

        // Checks if other types have reports for this date
        if (trans[type]._id.date === result[i + 1]._id.date) {
	  trans[result[i + 1]._id.type] = result[i + 1];
	}
        if (trans[type]._id.date === result[i + 2]._id.date) {
	  trans[result[i + 2]._id.type] = result[i + 2];
	}

        // Compute and format the report for a date
        if ('expense' in trans) {
	  report['totalExpense'] = trans['expense'].total;
          report['averageExpense'] = trans['expense'].avg;
	  report['mostExpensive'] = trans['expense'].max;
	  report['leastExpensive'] = trans['expense'].min;
	  date = trans['expense'].minDate;
	} else {
	  report['totalExpense'] = report['averageExpense'] = report['mostExpensive'] = report['leastExpensive'] = 0;
	}

        if ('income' in trans) {
	  report['totalIncome'] = trans['income'].total;
          report['averageIncome'] = trans['income'].avg;
	  report['highestIncome'] = trans['income'].max;
	  report['lowestIncome'] = trans['income'].min;
	  date = trans['income'].minDate;
	} else {
	  report['totalIncome'] = report['averageIncome'] = report['highestIncome'] = report['lowestIncome'] = 0;
	}

        if ('savings' in trans) {
	  report['totalSavings'] = trans['savings'].total;
          report['averageSavings'] = trans['savings'].avg;
	  report['mostSaved'] = trans['savings'].max;
	  report['leastSaved'] = trans['savings'].min;
	  date = trans['savings'].minDate;
	} else {
	  report['totalSavings'] = report['averageSavings'] = report['mostSaved'] = report['leastSaved'] = 0;
	}

        let percent = (report['totalExpense'] / report['totalIncome']) * 100;
        report['incomeSpent'] = `${percent}%`;
        percent = (report['totalSavings'] / report['totalIncome']) * 100;
        report['incomeSaved'] = `${percent}%`;
        report['netIncome'] = report['totalIncome'] - report['totalExpense'];
        report['date'] = date

        reports.push(report);
        i += Object.keys(trans).length;
      }

      return reports;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = ReportTools;
