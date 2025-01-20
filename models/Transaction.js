const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  amount: { type: Number, require: true },
  type: {
    type: String,
    enum: ['income', 'expense', 'savings'],
    require: true
  },
  repeat: {
    type: String,
    default: null,
    require: false,
  },
  jobKey: {
    type: String,
    default: null,
    require: false,
  },
  cateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
    require: true,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
