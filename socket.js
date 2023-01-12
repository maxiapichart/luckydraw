const socketIO = require('socket.io')
const server = require('./server')

const io = socketIO(server, { cors: { origin: '*', methods: ['GET', 'POST'] } })

io.on('connect', async (client) => {
  client.on('join_pin', (pin) => {
    client.join(pin)
    console.log(`${now()}|connected (${pin}:${views(pin)})`)

    io.to(pin).emit('views', views(pin))

    client.on('delete_event', () => io.to(pin).emit('delete_event'))
    client.on('change_event', (event) => io.to(pin).emit('change_event', event))

    client.on('add_users', (users) => io.to(pin).emit('add_users', users))
    client.on('remove_users', (users) => io.to(pin).emit('remove_users', users))

    client.on('new_user', (user) => io.to(pin).emit('new_user', user))
    client.on('random', (users) => io.to(pin).emit('random', users))
    client.on('set_status', (user) => io.to(pin).emit('set_status', user))

    client.on('disconnect', () => {
      console.log(`${now()}|disconnected (${pin}:${views(pin)})`)
      io.to(pin).emit('views', views(pin))
    })
  })
})

const views = (id) => {
  const room = Array.from(io.sockets.adapter.rooms).filter(
    (room) => !room[1].has(room[0]) && room[0] === id
  )[0]
  return room ? Array.from(room[1]).length : 0
}

const now = () => new Date().toString().slice(0, 24)
