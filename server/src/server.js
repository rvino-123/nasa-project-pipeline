const http = require('http')
const mongoose = require('mongoose')
const app = require('./app')
require('dotenv').config()
const PORT = process.env.PORT || 8000;

const MONGO_URL = process.env.MONGO_CONNECTION_STRING
const server = http.createServer(app);
const {loadPlanetData} = require('./models/planets.model')
const {loadLaunchData} = require('./models/launches.model')

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function startServer() {
    await mongoose.connect(MONGO_URL)
    await loadPlanetData()
    await loadLaunchData()
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    })
}

startServer()




