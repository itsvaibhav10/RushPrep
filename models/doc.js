const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: false, required: true },
    isPaid: { type: Boolean, default: false, required: true },
    downloads: { type: Number, required: true, default: 0 },
    docType: { type: String, lowercase: true, trim: true, required: true },
    title: { type: String, lowercase: true, trim: true, required: true },
    category: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, lowercase: true, trim: true },
    file: { type: String, trim: true, required: true },
    keywords: { type: String, lowercase: true, trim: true, required: true },
    month: { type: String, lowercase: true, trim: true },
    year: { type: String, lowercase: true, trim: true },
    college: { type: String, lowercase: true, trim: true },
    degree: { type: String, lowercase: true, trim: true },
    stream: { type: String, lowercase: true, trim: true },
    searchString: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doc', docSchema);
