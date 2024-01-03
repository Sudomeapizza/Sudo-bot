const { Schema, model } = require('mongoose');
const dataSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    userId: String,
    timeZone: String
});

module.exports = model("data", dataSchema, "timezonedata");