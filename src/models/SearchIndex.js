const mongoose = require('mongoose');

const searchIndexSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('SearchIndex', searchIndexSchema, 'search_index');
