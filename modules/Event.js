const auth = require('../middleware/auth')

const app = require('../app')
const Event = require('../models/event')
const User = require('../models/user')

const MAX_NUMBER = 999999
app.get('/event/randompin', auth, async (req, res) => {
  const pin = await randomPin()
  return res.status(200).json(pin)
})

app.get('/event/events', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    return res.status(200).json(events)
  } catch (err) {
    console.log(err)
  }
})
app.get('/event/event', async (req, res) => {
  try {
    const { _id, pin } = req.query
    const event = await Event.findOne({ $or: [{ _id }, { pin }] })
    return res.status(200).json(event)
  } catch (err) {
    console.log(err)
  }
})

app.post('/event/action', auth, async (req, res) => {
  try {
    const { _id } = req.query
    const input = req.body
    if (_id) {
      const event = await Event.findByIdAndUpdate(
        _id,
        { $set: input },
        { new: true }
      )
      return res.status(200).json(event)
    }
    const event = await Event.create(input)
    return res.status(200).json(event)
  } catch (err) {
    console.log(err)
  }
})

app.delete('/event/delete', auth, async (req, res) => {
  try {
    const { _id } = req.query
    const users = User.find({ event: _id, isLucky: true })
    if (users.length) return res.status(409).json(false)
    await Event.findByIdAndDelete(_id)
    await User.deleteMany({ event: _id })
    return res.status(200).json(true)
  } catch (err) {
    console.log(err)
  }
})
app.get('/event/admin', auth, async (req, res) => {
  try {
    const { _id } = req.query
    const { username } = req.user
    const event = await Event.findOne({ _id, 'admins.username': username })
    return res.status(200).json(event)
  } catch (err) {
    console.log(err)
  }
})

const randomPin = async () => {
  try {
    let pin = Math.floor(Math.random() * MAX_NUMBER)
    pin = String(pin).padStart(6, '0')
    const event = await Event.count({ pin })
    return event ? await randomPin() : pin
  } catch (err) {
    console.log(err)
  }
}
