const queue = require('bull');
const Transaction = require('./models/Transaction');

const repeatQueue = new queue('Add a new transaction');
repeatQueue.on('error', function (error) {
  console.error(error);
});

repeatQueue.process(async function (job, done) {
  // Add a new transaction
  job.data.jobKey = null;
  job.data.repeat = null;

  const tran = new Transaction(job.data);
  await tran.save();
  done();
});

module.exports = repeatQueue;
