const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'User',
    },
    doctor_id: {
        type: String,
        required: true,
        ref: 'Doctor',
    },
    slot_id: {
        type: String,
        required: true,
        ref : 'Slot',
    },
    notes: {
        type: String,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Pending",
        enum: ["Pending", "Approved", "Rejected","Cancelled","Request for Cancellation","Failed for Cancellation"],
    },
}, {
    timestamps: true,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;