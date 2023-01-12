const app = require('../app')
const auth = require('../middleware/auth')
const { getUser, getUsers } = require('../global')
const User = require('../models/user')

app.get('/user/users', async (req, res) => {
  try {
    const { event } = req.query
    const isLucky = req.query.isLucky === 'true'
    const condition = { event }
    if (isLucky) condition.isLucky = isLucky
    const users = await User.find(condition).sort(isLucky && { order: -1 })
    return res.status(200).json(users)
  } catch (err) {
    console.log(err)
  }
})

app.get('/user/user', auth, async (req, res) => {
  try {
    const { event } = req.query
    const { username } = req.user
    const user = await User.findOne({ event, username })
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
  }
})

app.get('/user/users/total', async (req, res) => {
  try {
    const { event } = req.query
    const total = await User.find({ event }).count()
    return res.status(200).json(total)
  } catch (err) {
    console.log(err)
  }
})

app.post('/user/find_users', async (req, res) => {
  try {
    const { usernames, event } = req.body
    const users = await getUsers(usernames)
    const usersEvent = await User.find({ event, username: { $in: usernames } })
    const usersEventColumn = usersEvent.map(({ username }) => username)
    const usersColumn = users.map(({ username }) => username)
    const result = usernames.map((username) => {
      const i = usersColumn.indexOf(username)
      if (i >= 0) {
        const i2 = usersEventColumn.indexOf(username)
        const status =
          i2 >= 0
            ? { success: false, message: 'มีรายชื่อนี้แล้ว', status: 1 }
            : { success: true }

        return { ...users[i], ...status }
      } else
        return {
          username,
          success: false,
          message: 'ไม่พบรายชื่อนี้',
          status: 0,
        }
    })

    return res.status(200).json(result)
  } catch (err) {
    console.log(err)
  }
})

app.post('/user/send_draw', auth, async (req, res) => {
  try {
    const { event } = req.body
    const { username } = req.user
    const user = await getUser(username)
    user.event = event
    user.createdBy = username
    const newUser = await User.create(user)
    return res.status(200).json(newUser)
  } catch (err) {
    console.log(err)
  }
})
app.post('/user/add_users', auth, async (req, res) => {
  try {
    const { users, event } = req.body
    const createdBy = req.user.username
    const addUsers = users.map(({ username, name, unit }) => ({
      username,
      name,
      unit,
      event,
      createdBy,
    }))
    const newUser = await User.create(addUsers)
    return res.status(200).json(newUser)
  } catch (err) {
    console.log(err)
  }
})

app.post('/user/remove_users', auth, async (req, res) => {
  try {
    const { users } = req.body
    const deleted = await User.deleteMany({ _id: { $in: users } })
    return res.status(200).json(deleted)
  } catch (err) {
    console.log(err)
  }
})
app.post('/user/set_status', auth, async (req, res) => {
  try {
    const { status, _id } = req.body
    const set = { status, statusAt: new Date(), statusBy: req.user.username }
    const user = await User.findByIdAndUpdate(_id, { $set: set }, { new: true })
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
  }
})
app.post('/user/random', auth, async (req, res) => {
  try {
    const { num, event } = req.body
    const order = await User.find({ event, isLucky: true }).count()
    const users = (await User.find({ event, isLucky: false }))
      .sort(() => Math.random() - 0.5)
      .splice(0, num)

    const luckyAt = new Date()
    const luckyBy = req.user.username
    const newUsers = users.map((user, i) => {
      user.isLucky = true
      user.status = 1
      user.luckyAt = luckyAt
      user.luckyBy = luckyBy
      user.order = order + i + 1
      user.save()
      return user
    })
    return res.status(200).json(newUsers)
  } catch (err) {
    console.log(err)
  }
})
