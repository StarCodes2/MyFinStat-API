const AuthController = require('./AuthController');
const Transaction = require('../models/Transaction');
const dbClient = require('../utils/db');
const Validator = require('../utils/Validator');
const queueClient = require('../utils/worker');

class TranController {
  static async createTransaction(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    const {
      type, amount, category, repeat,
    } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ error: 'amount, type, and category are required' });
    }
    if (!Validator.isNumber(amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!Validator.isValidType(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const data = {
      amount,
      type,
      userId: user._id,
    };

    try {
      const cate = await dbClient.getCateByName(user._id, category.toLowerCase());
      if (!cate) return res.status(400).json({ error: 'Category does not exist' });
      data.cateId = cate._id;

      if (repeat && Validator.isValidRepeat(repeat)) {
        // Add a repeatable job to queue
        const job = await queueClient.addRepeat(data, repeat);
        data.repeat = repeat;
        data.jobKey = job.opts.repeat.key;
      } else if (repeat && !Validator.isValidRepeat(repeat)) {
        return res.status(400).json({ error: 'Invalid repeat' });
      }

      const trans = new Transaction(data);
      await trans.save();

      return res.status(201).json({ status: 'Created', id: trans._id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getTransactions(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    const page = parseInt(req.query.page, 10) || 0;
    const limit = 20;
    const skip = page * limit;

    try {
      const trans = await dbClient.getTransByUserId(user._id, skip, limit);
      if (trans.length === 0) {
        return res.status(404).json({ error: 'No transaction found' });
      }

      return res.status(200).json(trans);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateTransaction(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    const { tranId } = req.params;
    if (!Validator.isValidId(tranId)) {
      return res.status(400).json({ error: 'Invalid transaction id' });
    }

    const {
      amount, type, category, repeat,
    } = req.body;
    if (!type && !amount && !category && !repeat) {
      return res.status(400).json({ error: 'Fields to be updated missing' });
    }

    if (amount && !Validator.isNumber(amount)) {
      return res.status(400).json({ error: 'Amount not a valid number' });
    }
    if (type && !Validator.isValidType(type)) {
      return res.status(400).json({ error: 'Type can only be income, expense, or savings' });
    }
    if (repeat && !Validator.isValidRepeat(repeat)) {
      return res.status(400).json({ error: 'Repeat can only be daily, weekly, monthly, or yearly' });
    }

    try {
      const trans = await dbClient.getTranById(user._id, tranId);
      if (!trans) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (amount) trans.amount = amount;
      if (type) trans.type = type;

      // Change the transactions category
      if (category && category.toLowerCase() !== trans.cateId.name) {
        const cate = await dbClient.getCateByName(user._id, category.toLowerCase());
        if (!cate) return res.status(404).json({ error: 'Invalid Category' });
        trans.cateId = cate._id;
      }

      // Removes and add a new repeatablt job to the queue
      if (repeat && repeat !== 'stop' && trans.repeat !== repeat) {
        if (trans.jobKey !== null) await queueClient.removeRepeat(trans.jobKey);
        const job = await queueClient.addRepeat(trans, repeat);
        trans.jobKey = job.opts.repeat.key;
        trans.repeat = repeat;
      }

      // Remove the transactions repeatable job
      if (repeat === 'stop' && trans.jobKey !== null) {
        await queueClient.removeRepeat(trans.jobKey);
        trans.jobKey = null;
        trans.repeat = null;
      }

      await trans.save();

      return res.status(200).json({ id: tranId, status: 'Updated' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deleteTransaction(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    const { tranId } = req.params;
    if (!Validator.isValidId(tranId)) {
      return res.status(400).json({ error: 'Invalid transaction id' });
    }

    try {
      const trans = await dbClient.getTranById(user._id, tranId);
      if (!trans) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      if (trans.jobKey) await queueClient.removeRepeat(trans.jobKey);

      const deleted = dbClient.deleteTran(user._id, tranId);
      if (deleted.deletedCount === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      return res.status(200).json({ status: 'Transaction deleted' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = TranController;
