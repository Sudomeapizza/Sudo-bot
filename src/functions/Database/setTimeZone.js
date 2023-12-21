const timeZone = require("../../schemas/data");
const Types = require("mongoose");

module.exports = (client) => {
    client.setTimeZone = async (userId, guildId, inputTimeZone) => {
        const userTimeZone = await timeZone.findOne({
            userId: userId,
            timeZone: inputTimeZone,
        });

        if (!userTimeZone) {
            userTimeZone = await new timeZone({
                _id: Types.ObjectId(),
                userId: userId,
                guildId: guildId,
                timeZone: inputTimeZone,
            });
            await userTimeZone
                .save()
                .then( async (data) => {
                    console.log(`[TimeZone] saved region for ${data.userId}`);
                })
                .catch(console.error);
            return userTimeZone;
        } else return userTimeZone;
    }
}