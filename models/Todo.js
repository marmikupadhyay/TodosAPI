const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  priority: {
    type: Number,
    required: true
  }
});

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
