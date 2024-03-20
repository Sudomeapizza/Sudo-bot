const cmdPerms = require("../../schemas/cmdPerms");
const mongoose = require("mongoose");

module.exports = (client) => {
    client.setTimeZone = async (userId, userTag, cmdString, cmdAllowed) => {
        // Check if the cmdString already exists in the database
        let userCmdPerms = await cmdPerms.findOne({
            cmd: cmdString,
        });

        if (!userCmdPerms) {
            // console.log("Attempting to set a new time zone entry");

            // Create a new time zone entry
            cmdPerms = new cmdPerms({
                _id: new mongoose.Types.ObjectId(),
                cmd: cmdString,
                allowed: cmdAllowed,
                userId: userId,
                userTag: userTag,
                lastUpdated: new Date().toLocaleString(),
            });

            // Save the new entry to the database
            await cmdPerms.save().catch(console.error);
            return cmdPerms;
        } else {
            // console.log("Attempting to update an existing time zone entry");

            // Update the existing time zone entry with the new information if needed
            cmdPerms.allowed = cmdAllowed,
            cmdPerms.userId = userId,
            cmdPerms.userTag = userTag,
            cmdPerms.lastUpdated = new Date().toLocaleString(),

            // Save the updated entry to the database
            await cmdPerms.save().catch(console.error);
            return cmdPerms;
        }
    };
};