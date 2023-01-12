const mongoose = require('mongoose')

// const { MONGO_URI } = process.env
// exports.connect = () =>
//   mongoose
//     .connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       // useCreateIndex: true,
//       // useFindAndModify: false,
//       keepAlive: true,
//     })
//     // .then(() => console.log('Connected to mongodb'))
//     .catch((err) => {
//       console.log(`Error connecting to mongodb ${err}`)
//       process.exit(1)
//     })

const { MONGO_URL } = process.env
exports.connect = () =>
  mongoose
    .connect(MONGO_URL)
    .then(() => console.log('MongoDB is connected sucessfully'))
    .catch((err) => console.error(err))
