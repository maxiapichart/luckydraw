const { Schema, model } = require('mongoose')

const schema = Schema({
  pin: { type: String, unique: true },
  title: String,
  open: Date,
  close: Date,

  admins: [{ username: String, name: String, statusOnly: Boolean }],

  createdAt: { type: Date, default: Date.now },
})

module.exports = model('Event', schema)
