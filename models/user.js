const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  isAdmin: { type: Boolean, default: false },
  email: { type: String, required: true, lowercase: true },  
  password: { type: String, required: true },  
  customerType: { type: String, default: 'free' },
  emailVerify: { type: Boolean, required: true, default: false },
  activationToken: String,
  resetToken: String,
  resetTokenExpiration: Date,
});

module.exports = mongoose.model('User', userSchema);
