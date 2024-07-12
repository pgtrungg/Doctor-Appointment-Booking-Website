const moongose = require('mongoose');
const Schema = moongose.Schema;
const departmentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    doctor_list: {
        type: [String],
    },
}, {
    timestamps: true,
});
const Department = moongose.model('Department', departmentSchema);
module.exports = Department;
