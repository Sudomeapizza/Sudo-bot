const timeZone = require("../../schemas/data");
const mongoose = require("mongoose");

module.exports = (client) => {
    client.setTimeZone = async (userId, guildId, inputTimeZone) => {
        console.log("test");
        const userTimeZone = await timeZone.findOne({
            userId: userId,
            timeZone: inputTimeZone,
        });
        console.log(userTimeZone);
        if (!userTimeZone) {
            userTimeZone = await new timeZone({
                _id: new mongoose.Types.ObjectId(),
                userId: userId,
                guildId: guildId,
                timeZone: inputTimeZone,
            });
            await userTimeZone.save().catch(console.error);
                await interaction.reply({
                    content: `Server Name: ${userTimeZone.guildName}`,
                });
                console.log(userTimeZone);
            return userTimeZone;
        } else {
            await interaction.reply({
                content: `Server ID: ${userTimeZone.guildId}`,
            });
            console.log(userTimeZone);
            return userTimeZone;
        }

        //     await userTimeZone.save().catch(console.error);
        //         await interaction.reply({
        //             content: `Server Name: ${userTimeZone.guildName}`,
        //         });
        //         console.log(userTimeZone);
        //     } else {
        //         await interaction.reply({
        //             content: `Server ID: ${userTimeZone.guildId}`,
        //         });
        //         console.log(userTimeZone);
        //     }

        // if (!userTimeZone) {
        //     userTimeZone = await new Guild({
        //         _id: Types.ObjectId(),
        //         userId: userId,
        //         guildId: guildId,
        //         timeZone: inputTimeZone,
        //     })
        //     await userTimeZone.save().catch(console.error);
        //     await interaction.reply({
        //         content: `Server Name: ${userTimeZone.guildName}`,
        //     });
        //     console.log(userTimeZone);
        // } else {
        //     await interaction.reply({
        //         content: `Server ID: ${userTimeZone.guildId}`,
        //     });
        //     console.log(userTimeZone);
        // }
    }
}