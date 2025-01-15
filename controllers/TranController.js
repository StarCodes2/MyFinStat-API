const AuthController = require('./AuthController');
const Transaction = require('../models/Transaction');
const dbClient = require('../utils/db');
const Validator = require('../utils/Validator');

class TranController {
  static async createTransaction(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    const { type, amount, category, repeat } = req.body;
    if (!type || !amount || !category) {
      return res.status(400).json({ error: 'amount, type, and category are required' });
    }

    try {
      if (repeat && Validator.isValidRepeat(repeat)) {
        // Add document to repeat table
      } else if (repeat && !Validator.isValidRepeat(repeat)) {
        return res.status(400).json({ error: 'Invalid repeat' });
      }

      const cate = await dbClient.getCateByName(user._id, category.toLowerCase());
      if (!cate) return res.status(400).json({ error: 'Category does not exist' });

      const trans = new Transaction({ amount, type, cateId: cate._id, userId: user._id });
      trans.save();

      return res.status(201).json({ status: 'Created', id: trans._id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getTransactions(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    const page = parseInt(req.query.page) || 0;
    const limit = 50;
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

    const { amount, type, category, repeat } = req.body;
    if (!type && !amount && !categroy) {
      return res.status(400).json({ error: 'Fields to be updated missing' });
    }

    const values = {};
    const filter = { id: tranId, userId: user._id };

    if (amount) values.amount = amount;
    if (type) values.type = type;
    if (repeat) values.repeat = repeat;
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

      if (category && category.toLowerCase() !== trans.cateId.name) {
        const cate = await dbClient.getCateByName(user._id, category.toLowerCase());
        if (!cate) return res.status(404).json({ error: 'Invalid Category' });
        values.cateId = cate._id;
      }

      const updated = await dbClient.updateTran(filter, values);
      if (updated.modifiedCount < 1) {
        return res.status(400).json({ error: 'Not Updated' });
      }

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
      const deleted = dbClient.deleteTran(user._id, tranId);
      if (deleted.deletedCount === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      return res.status(200).json({ status: 'Transaction deleted' });
    } catch(err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = TranController;
