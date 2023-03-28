const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/vnoteusers"

const connectMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("connected to db")
    })
}

module.exports = connectMongo;