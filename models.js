const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
});

const postSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  message: String,
  comments: [
    {
      sentBy: { type: Schema.Types.ObjectId, ref: 'User' },
      sentAt: { type: Date, default: Date.now },
      liked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
  ],
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { User, Post };
