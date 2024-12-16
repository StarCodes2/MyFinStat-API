const mongoose = require('mongoose');
const User = require('../models/User');

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
}

const dbClient = new MongooseConnect();
module.exports = dbClient;
