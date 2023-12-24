const timeZone = require("../../schemas/data");
const mongoose = require("mongoose");

module.exports = (client) => {
    client.setTimeZone = async (userId, guildId, inputTimeZone) => {
        var userTimeZone = await timeZone.findOneAndUpdate({
            userId: userId,
            // guildId: guildId,
            timeZone: inputTimeZone,
        });
        if (!userTimeZone) {
            userTimeZone = await new timeZone({
                _id: new mongoose.Types.ObjectId(),
                userId: userId,
                guildId: guildId,
                timeZone: inputTimeZone,
            });
            await userTimeZone.save().catch(console.error);
            return userTimeZone;
        } else {
            return userTimeZone;
        }
    }
}
