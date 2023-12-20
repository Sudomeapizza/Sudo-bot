const { Schema, model } = require('mongoose');
const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    timeZone: { type: String },
});

module.exports = model("Guild", guildSchema, "guilds");