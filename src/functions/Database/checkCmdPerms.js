const cmdPerms = require("../../schemas/cmdPerms");
const Types = require("mongoose");

module.exports = (client) => {
    client.getTimeZone = async (cmdString,userIdTest) => {
        const userCmdPerms = await cmdPerms.findOne({
            cmd: cmdString,
        });

        if (userCmdPerms) {
            userCmdPerms.forEach(userId => {
                if (userId == userIdTest) {
                    if (userCmdPerms.allowed) {
                        return true;
                    }
                }
            });
            return false;
        } else return false;
    }
}