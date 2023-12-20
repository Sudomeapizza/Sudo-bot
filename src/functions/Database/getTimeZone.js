const timeZone = require("../../schemas/data");
const Types = require("mongoose");

module.exports = (client) => {
    client.getTimeZone = async (userId, inputTimeZone) => {
        const userTimeZone = await timeZone.findOne({
            userId: userId,
            timeZone: inputTimeZone,
        });

        if (!userTimeZone) return false;
        else return userTimeZone;
    }
}