import { v4 as uuidv4 } from 'uuid';

const Queue = require('bull');
const Transaction = require('../models/Transaction');

class RepeatQueue {
  constructor() {
    // Creates a queue and add process
    const repeatQueue = new Queue('new-transaction');
    repeatQueue.on('error', (error) => {
      console.error(error);
    });

    repeatQueue.process(async (job, done) => {
      // Add a new transaction
      try {
        const data = {
          amount: job.data.amount,
          type: job.data.type,
          cateId: job.data.cateId,
          userId: job.data.userId,
        };

        const tran = new Transaction(data);
        await tran.save();
        done();
      } catch (err) {
        console.error(err);
        done(err);
      }
    });
    this.repeatQueue = repeatQueue;
  }

  async addRepeat(data, repeat) {
    // Add a repeatable job to the queue
    let cron = null;
    if (repeat === 'daily') cron = '0 0 * * *';
    if (repeat === 'weekly') cron = '0 0 * * 1';
    if (repeat === 'monthly') cron = '0 0 1 * *';
    if (repeat === 'yearly') cron = '0 0 1 1 *';

    const job = await this.repeatQueue.add(uuidv4(), data, { repeat: { cron } });
    return job;
  }

  async removeRepeat(key) {
    // Remove a repeatable job from the queue
    await this.repeatQueue.removeRepeatableByKey(key);
  }
}

const queueClient = new RepeatQueue();

module.exports = queueClient;
