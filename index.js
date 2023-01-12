const fs = require('fs')
const path = require('path')

const app = require('./app')
const server = require('./server')

require('./database/mongodb').connect()
require('./socket')
const { PORT } = process.env

const modules = path.join(__dirname, 'modules')
fs.readdirSync(modules).forEach((file) => require('./modules/' + file))

app.get('/', (req, res) => res.status(200).send('server are ready!'))

server.listen(PORT, () =>
  console.log(`${now()}|Server running on port:${PORT}`)
)

const now = () => new Date().toString().slice(0, 24)
