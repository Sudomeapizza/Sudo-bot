const { Schema, model } = require('mongoose');
const dataSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: Number,
    userId: String,
    timeZone: String
});

module.exports = model("data", dataSchema, "timezonedata");