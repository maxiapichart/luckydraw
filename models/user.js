const { Schema, model } = require('mongoose')

const schema = Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  username: { type: String, lowercase: true, trim: true, index: true },
  name: String,
  unit: String,

  isLucky: { type: Boolean, default: false },
  order: { type: Number, default: null },
  luckyAt: { type: Date, default: null },
  luckyBy: { type: String, default: null },

  status: { type: Number, default: null },
  statusAt: { type: Date, default: null },
  statusBy: { type: String, default: null },

  createdAt: { type: Date, default: Date.now },
  createdBy: String,
}).index({ event: 1, username: 1 }, { unique: true })

module.exports = model('User', schema)
