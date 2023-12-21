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