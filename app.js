const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(express.json())
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// })
app.use(cors())

module.exports = app
