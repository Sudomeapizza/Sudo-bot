const timeZone = require("../../schemas/data");
const mongoose = require("mongoose");

module.exports = (client) => {
    client.setTimeZone = async (userId, guildId, inputTimeZone) => {
        // Check if the userTimeZone already exists in the database
        let userTimeZone = await timeZone.findOne({
            userId: userId,
            timeZone: inputTimeZone,
        });

        if (!userTimeZone) {
            console.log("Attempting to set a new time zone entry");

            // Create a new time zone entry
            userTimeZone = new timeZone({
                _id: new mongoose.Types.ObjectId(),
                userId: userId,
                timeZone: inputTimeZone,
            });

            // Save the new entry to the database
            await userTimeZone.save().catch(console.error);
            return userTimeZone;
        } else {
            console.log("Attempting to update an existing time zone entrys");

            // Update the existing time zone entry with the new information if needed
            userTimeZone.timeZone = inputTimeZone;

            // Save the updated entry to the database
            await userTimeZone.save().catch(console.error);
            return userTimeZone;
        }
    };
};