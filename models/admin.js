const mongoose = require("mongoose");
const { Schema } = mongoose;

const admin = new Schema({
    email: { type: String, default: null },
    password: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});

admin.set('toJSON');
admin.set('toObject');

module.exports = mongoose.model('admin', admin);