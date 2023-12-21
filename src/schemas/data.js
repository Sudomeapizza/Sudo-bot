const { Schema, model } = require('mongoose');
const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: Number,
    userId: String,
    timeZone: { type: String },
});

module.exports = model("data", guildSchema, "timezonedata");