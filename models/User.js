const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  virtuals: {
    fullname: {
      get() {
        return `${this.name.first} ${this.name.last}`;
      },
    },
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
