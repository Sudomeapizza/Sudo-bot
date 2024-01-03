const timeZone = require("../../schemas/data");
const mongoose = require("mongoose");

module.exports = (client) => {
    client.removeTimeZoneData = async (userId) => {
        try {
            // Find the time zone entry for the specified userId
            let userTimeZone = await timeZone.findOne({
                userId: userId,
            });

            // If the time zone entry exists, remove it from the database
            if (userTimeZone) {
                await userTimeZone.remove();
                console.log(`Successfully removed time zone data for userId: ${userId}`);
                return true; // Return true to indicate successful removal
            } else {
                console.log(`Time zone data not found for userId: ${userId}`);
                return false; // Return false to indicate that no data was found for the specified userId
            }
        } catch (error) {
            console.error(`Error removing time zone data for userId: ${userId}`, error);
            throw error; // Throw the error to handle it elsewhere if needed
        }
    };
};