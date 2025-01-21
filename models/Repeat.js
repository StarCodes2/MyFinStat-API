const mongoose = require('mongoose');

const { Schema } = mongoose;

const repeatSchema = new Schema({
  amount: { type: Number, require: true },
  type: {
    type: String,
    enum: ['income', 'expanse', 'savings'],
    require: true,
  },
  repeat: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annually'],
    require: true,
  },
  jobKey: {
    type: String,
    require: true,
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

const Repeat = mongoose.model('Repeat', repeatSchema);
module.exports = Repeat;
