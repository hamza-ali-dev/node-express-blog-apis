const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  comments: [{ userId: mongoose.Schema.Types.ObjectId, comment: String }],
});

module.exports = mongoose.model('Post', postSchema);
