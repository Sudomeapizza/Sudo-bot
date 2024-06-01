const { Schema, model } = require('mongoose');
const dataSchema = new Schema({
    _id: Schema.Types.ObjectId,
    cmd: String,
    allowed: Boolean,
    userId: String,
    userTag: String,
    lastUpdated: String,
});

module.exports = model("cmdPerms", dataSchema, "timezonedata");