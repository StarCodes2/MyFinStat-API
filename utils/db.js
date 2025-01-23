const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

class MongooseConnect {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DATABASE || 'my_fin_stat';
    this.url = `mongodb://${host}:${port}/${database}`;

    this.User = User;
    this.Cate = Category;
    this.Tran = Transaction;

    this.connect();
  }

  async connect() {
    try {
      this.connection = await mongoose.connect(this.url);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }

  isConnected() {
    return this.connection && this.connection.readyState === 1;
  }

  async findUser(filter) {
    const res = await this.User.findOne(filter);
    return res;
  }

  async getCatesByUserId(userId) {
    const res = await this.Cate.find({ userId });
    return res;
  }

  async getCateById(userId, id) {
    const res = await this.Cate.findOne({ _id: id, userId });
    return res;
  }

  async getCateByName(userId, name) {
    const res = await this.Cate.findOne({ userId, name });
    return res;
  }

  async deleteCate(userId, id) {
    const res = await this.Cate.deleteOne({ _id: id, userId });
    return res;
  }

  async updateCate(userId, id, name) {
    const res = await this.Cate.updateOne({ _id: id, userId }, { name });
    return res;
  }

  async getTransByUserId(userId, skip, limit) {
    const res = await this.Tran.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'categories',
          localField: 'cateId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          userId: 1,
          amount: 1,
          'category.name': 1,
          type: 1,
          repeat: 1,
          jobKey: 1,
          date: 1,
        },
      },
      { $sort: { date: -1 } },
    ]);
    return res;
  }

  async getTranById(userId, id) {
    const res = await this.Tran.findOne({ _id: id, userId }).populate('cateId');
    return res;
  }

  async deleteTran(userId, id) {
    const res = await this.Tran.deleteOne({ _id: id, userId });
    return res;
  }

  async updateTran(filter, values) {
    const { id, userId } = filter;

    const res = await this.Tran.updateOne(
      { _id: id, userId },
      values,
    );
    return res;
  }

  async tranAggregate(steps) {
    let res = null;
    if ('addField' in steps) {
      res = await this.Tran.aggregate([
        { $match: steps.match },
        { $addFields: steps.addField },
        { $group: steps.group },
        { $sort: { minDate: -1 } },
      ]);
    } else {
      res = await this.Tran.aggregate([
        { $match: steps.match },
        { $group: steps.group },
        { $sort: { minDate: -1 } },
      ]);
    }
    return res;
  }
}

const dbClient = new MongooseConnect();
module.exports = dbClient;
