const mongoose = require("mongoose");
const { Schema } = mongoose;

const transaction = new Schema({
    machineId: { type: Schema.Types.ObjectId, ref: "machine" },
    employeeId: { type: Schema.Types.ObjectId, ref: "employee" },
    slotName: { type: String, default: null },
    transactionStatus: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});

transaction.set('toJSON');
transaction.set('toObject');

module.exports = mongoose.model('transaction', transaction);