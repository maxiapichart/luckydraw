const soap = require('soap')
const jwt = require('jsonwebtoken')

const app = require('../app')
const auth = require('../middleware/auth')
const { devs, getUser } = require('../global')
const Event = require('../models/event')

const { PASSPORT_URI, TOKEN_KEY } = process.env

app.post('/auth', auth, async (req, res) => {
  try {
    const { username, asAdmin } = req.user
    let user = await getUser(username)
    if (asAdmin) user = await adminDetail(user)

    return res.status(200).send(user)
  } catch (err) {
    console.log(err)
  }
  return res.status(499).send('Invalid Token')
})

app.post('/account/login', async (req, res) => {
  try {
    const { password, asAdmin } = req.body
    const username = req.body.username.toLowerCase().trim()

    // Validate user input
    if (!(username && password))
      return res.status(400).send('All input is required')

    soap.createClient(PASSPORT_URI, (err, client) => {
      if (err) return res.status(500).send(err)

      client.GetStudentDetails({ username, password }, async (err, result) => {
        if (err) return res.status(500).send(err)
        const [id] = result.GetStudentDetailsResult.string
        if (id) {
          let user = await getUser(username)
          if (asAdmin) user = await adminDetail(user)

          const token = jwt.sign(
            { username, ...(asAdmin ? { asAdmin } : {}) },
            TOKEN_KEY,
            { expiresIn: '12h' }
          )
          return res.status(200).json({ user, token })
        }
        return res.status(400).send('Invalid Credentials')
      })
    })
  } catch (err) {
    console.log(err)
  }
})

app.get('/account/finduser', async (req, res) => {
  try {
    const username = req.query.username.toLowerCase().trim()
    let admin = await getUser(username)
    return res.status(200).json(admin)
  } catch (err) {
    console.log(err)
  }
})

const adminDetail = async (user) => {
  try {
    const { username } = user
    const isDev = devs.includes(username)
    if (isDev) user.isDev = true
    else {
      user.isAdmin = true
      const events = await Event.find({ 'admins.username': username })
      if (!events) return res.status(400).send('Invalid Credentials')
    }
    return user
  } catch (err) {
    console.log(err)
  }
}
