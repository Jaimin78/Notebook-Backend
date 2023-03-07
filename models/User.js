const mongoose = require('mongoose')
const {Schema} = require('mongoose')

//Schema for user table
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.model('users', userSchema);
module.exports = User