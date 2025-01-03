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

  async updateCate(id, name) {
    return await Category.updateOne({ _id: id }, { name });
  }

  async getTransByUserId(userId) {
    return await Transaction.find({ userId }).populate('cateId');
  }

  async getTranById(userId, id) {
    return await Transaction.findOne({ _id: id, userId }).populate('cateId');
  }

  async deleteTran(userId, id) {
    return await Transaction.deleteOne({ _id: id, userId });
  }

  async updateTran(filter, values) {
    const { id, userId } = filter;
    const { type, amount, cateId } = values;

    return await Transaction.updateOne(
      { _id: id, userId },
      { type, amount, cateId },
    );
  }
}

const dbClient = new MongooseConnect();
module.exports = dbClient;
