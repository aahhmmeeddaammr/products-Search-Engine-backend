const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    // Search fields for node-smart-search
    s__name: { type: String },
    s__description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
