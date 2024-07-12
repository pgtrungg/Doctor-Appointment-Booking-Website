const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'doctor']

    },
    dateOfBirth: {
        type: Date,
    },
    gender : {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    medicalHistory: {
        type: String,
    },
    healthInsuranceNumber: {
        type: String,
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },


    

}, { timestamps: true });
const User = mongoose.model('User', userSchema);
module.exports = User;