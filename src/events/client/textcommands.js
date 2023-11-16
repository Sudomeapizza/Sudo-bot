// const { SlashCommandBuilder } = require('discord.js')

console.log("text1");

module.exports = {
    name: 'textcommands',

    async execute(interaction, client) {
        // if (interaction.) {}

        const channel = client.channels.cache.get(1173069259618930808);
        channel.send('message');

        console.log("text2");
        client.on("messageCreate", async (message) => {
            console.log("text3");          
            if (message.author.bot) return false;
            if (message.content.includes("ping1")) {
                console.log(message);
                console.log("message created: " + message.content);
                // message.send(`heyo1`);
            }
        })

    }

}