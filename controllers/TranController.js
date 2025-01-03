const AuthController = require('./AuthController');
const Transaction = require('../models/Transaction');
const dbClient = require('../utils/db');
const mongoose = require('mongoose');

class TranController {
  static async createTransaction(req, res) {
    const user = AuthController.checkConnection(req, res);
    if (!user) return user;

    const { type, amount, category } = req.body;
    if (!type || !amount || !category) {
      return res.status(400).json({ error: 'amount, type, and category are required' });
    }

    try {
      const cate = await dbClient.getCateByName(user._id, category.toLowerCase());
      if (!cate) return res.status(400).json({ error: 'Category does not exist' });

      const trans = new Transaction({ amount, type, cateId: cate._id });
      trans.save();

      return res.status(201).json({ status: 'Created', id: trans._id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getTransactions(req, res) {
    const user = AuthController.checkConnection(req, res);
    if (!user) return user;

    try {
      const trans = await dbClient.getTransByUserId(user._id);
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
    const user = AuthController.checkConnection(req, res);
    if (!user) return user;

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid transaction id' });
    }

    let { amount, type, category } = req.body;
    if (!type && !amount && !categroy) {
      return res.status(400).json({ error: 'Fields to be updated missing' });
    }

    const trans = await dbClient.getTranById(user._id, id);
    if (!trans) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (!amount) amount = trans.amount;
    if (!type) type = trans.type;
    if (!category) category = trans.cateId.name;
    if (type !== 'income' || type !== 'expense' || type !== 'savings') {
      return res.status(400).json({ error: 'Type can only be income, expense, or savings' });
    }
    const values = { amount, type };
    const filter = { id, userId: user._id };

    try {
      if (category !== trans.cateId.name) {
        const cate = dbClient.getCateByName(user._id, category.toLowerCase());
        if (!cate) return res.status(404).json({ error: 'Invalid Category' });
        values.cateId = cate._id;
      }

      const update = await dbClient.updateTran(filter, values);
      if (update.update.modifiedCount < 1) {
        return res.status(400).json({ error: 'Not Updated' });
      }

      return res.status(200).json({ id, status: 'Updated' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = TranController;
