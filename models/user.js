let mongoose = require(`mongoose`);

let Schema = mongoose.Schema;
let User = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  key: {
    type: Object,
    required: true
  },
  created: {
    type: String,
    required: true
  },
  NumChat: {
    type: Number,
    required: true
  },
  timeSend: {
    type: Date
  }
})


module.exports = mongoose.model(`User`, User);
