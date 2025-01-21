const Queue = require('bull');
const Transaction = require('./models/Transaction');

const repeatQueue = new Queue('Add a new transaction');
repeatQueue.on('error', (error) => {
  console.error(error);
});

repeatQueue.process(async (job, done) => {
  // Add a new transaction
  const data = {
    amount: job.data.amount,
    type: job.data.type,
    cateId: job.data.cateId,
    userId: job.data.userId,
  };

  const tran = new Transaction(data);
  await tran.save();
  done();
});

module.exports = repeatQueue;
