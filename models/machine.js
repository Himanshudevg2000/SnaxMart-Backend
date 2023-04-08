const mongoose = require("mongoose");
const { Schema } = mongoose;

const machine = new Schema({
    companyName: { type: String, default: null },
    description: { type: String, default: null },
    location: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});

machine.set('toJSON');
machine.set('toObject');

module.exports = mongoose.model('machine', machine);