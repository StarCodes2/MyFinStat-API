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
    return mongoose.connection.readyState === 1;
  }

  async findUser(filter) {
    return await User.findOne(filter);
  }

  async getCatesByUserId(userId) {
    return await Category.find({ userId });
  }

  async getCateById(userId, id) {
    return await Category.findOne({ _id: id, userId });
  }

  async getCateByName(userId, name) {
    return await Category.findOne({ userId, name });
  }

  async deleteCate(userId, id) {
    return await Category.deleteOne({ _id: id, userId });
  }

  async updateCate(userId, id, name) {
    return await Category.updateOne({ _id: id, userId }, { name });
  }

  async getTransByUserId(userId, skip, limit) {
    return await Transaction.aggregate([
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
          repeatId: 1,
          date: 1,
        },
      }
    ]);
  }

  async getTranById(userId, id) {
    return await Transaction.findOne({ _id: id, userId }).populate('cateId');
  }

  async deleteTran(userId, id) {
    return await Transaction.deleteOne({ _id: id, userId });
  }

  async updateTran(filter, values) {
    const { id, userId } = filter;

    return await Transaction.updateOne(
      { _id: id, userId },
      values
    );
  }

  async tranAggregate(match, group) {
    return await Transaction.aggregate([
      { $match: match },
      { $group: group },
      { $sort: { date: -1 } }
    ]);
  }
}

const dbClient = new MongooseConnect();
module.exports = dbClient;
