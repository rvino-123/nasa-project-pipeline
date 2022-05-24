const mongoose = require('mongoose')

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
        default: 100,
        min: 100,
        max: 999
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    target: {
        type: String,
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        require: true
    },
    success: {
        type: Boolean,
        require: true,
        default: true
    },
})

// connects launchesSchema with the 'launches' collection
module.exports = mongoose.model('Launch', launchesSchema)


