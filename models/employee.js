const mongoose = require("mongoose");
const { Schema } = mongoose;

const employee = new Schema({
    employeeName: { type: String, default: null },
    companyName: { type: String, default: null },
    cardNo: { type: String, default: null },
    email: { type: String, default: null },
    contactNo: { type: String, default: null },
    department: { type: String, default: null },
    password: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});

employee.set('toJSON');
employee.set('toObject');

module.exports = mongoose.model('employee', employee);