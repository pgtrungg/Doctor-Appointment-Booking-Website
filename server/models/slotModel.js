const mongoose = require('mongoose');
const User = require('./userModel');
const Doctor = require('./doctorModel');
const slotSchema = new mongoose.Schema({
    doctor_id: {
        type: String,
        required: true,
        ref : 'Doctor',
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: [String],
        required: true,
        default: ["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"],

    },
}, {
    timestamps: true,
});
const Slot = mongoose.model('Slot', slotSchema);
module.exports = Slot;