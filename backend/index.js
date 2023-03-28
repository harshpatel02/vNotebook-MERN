const connectMongo = require('./db')
const express = require('express')
const cors = require('cors')

connectMongo()
const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.send('hello')
})

app.use(cors())
app.use(express.json())
// available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, (req, res) => {
    console.log("server started at port " + port)
})
