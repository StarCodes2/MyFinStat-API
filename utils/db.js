const mongoose = require('mongoose');

class MongooseConnect {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DATABASE || 'my_fin_stat';
    const url = `mongodb://${host}:${port}/${database}`;

    if (MongooseConnect.instance) {
      return MongooseConnect.instance;
    }
    mongoose.connect(url).then(() => {
      MongooseConnect.instance = this;
    })
     .catch((err) => {
       console.error(`Error: ${err.message}`);
     });
  }
}

const dbConnect = new MongooseConnect();
module.exports = dbConnect;
