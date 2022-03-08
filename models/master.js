const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterSchema = new Schema({
  category: [
    {
      title: { type: String, lowercase: true },
      description: { type: String, lowercase: true },
    },
  ],
  subject: [
    {
      title: { type: String, lowercase: true },
      description: { type: String, lowercase: true },
    },
  ],
  degree: [
    {
      title: { type: String, lowercase: true },
      description: { type: String, lowercase: true },
    },
  ],
  college: [
    {
      title: { type: String, lowercase: true },
      description: { type: String, lowercase: true },
    },
  ],
  stream: [
    {
      title: { type: String, lowercase: true },
      description: { type: String, lowercase: true },
    },
  ],
});

module.exports = mongoose.model('Master', masterSchema);
