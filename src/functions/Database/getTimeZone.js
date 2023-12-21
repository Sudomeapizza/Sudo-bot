const timeZone = require("../../schemas/data");
const Types = require("mongoose");

module.exports = (client) => {
    client.getTimeZone = async (userId) => {
        const userTimeZone = await timeZone.findOne({
            userId: userId,
        });

        if (!userTimeZone) return false;
        else return userTimeZone;
    }
}