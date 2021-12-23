const express = require('express')
const app = express()
const port = 5000

require('dotenv').config({path : '.env'});

const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${process.env.ID}:${process.env.PW}@boilerplate.ou3bg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})