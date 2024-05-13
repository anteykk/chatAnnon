let mongoose = require(`mongoose`);

let Schema = mongoose.Schema;

let Chat = new Schema({
  name: {
    type: String,
    required: true
  },
  mesSum: {
    type: Number,
    required: true
  },
  create: {
    type: String,
    required: true
  },
  whocreate: {
    type: Object,
    required: true
  },
  messages: [
    {
      create: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }
  ]
})

module.exports = mongoose.model(`Chats`, Chat);